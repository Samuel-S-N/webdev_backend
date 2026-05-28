const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(
  __dirname,
  '..',
  '..',
  'UniFECAF_Flix',
  'world_imdb_movies_top_movies_per_year.csv'
);
const SQL_PATH = path.join(__dirname, '..', 'database', 'unifecaf_flix.sql');
const LIMITE_FILMES = 200;

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

function truncar(texto, max) {
  if (!texto) return '';
  const t = String(texto).trim();
  return t.length > max ? t.slice(0, max) : t;
}

function escaparSql(valor) {
  if (valor === null || valor === undefined) return '';
  return String(valor).replace(/'/g, "''");
}

function sintetizarSinopse(genero, ano, diretor, elenco) {
  const g = genero || 'gênero não informado';
  const a = ano || 'ano desconhecido';
  const d = diretor || 'diretor não informado';
  const e = elenco || 'elenco não informado';
  return `Filme de ${g} lançado em ${a}, dirigido por ${d}, estrelando ${e}.`;
}

function lerFilmesDoCsv() {
  const conteudo = fs.readFileSync(CSV_PATH, 'utf8');
  const linhas = conteudo.split(/\r?\n/).filter((l) => l.trim());
  const filmes = [];

  for (let i = 1; i < linhas.length; i++) {
    const cols = parseCsvLine(linhas[i]);
    if (cols.length < 16) continue;

    const title = cols[1];
    const year = parseInt(cols[3], 10);
    const duration = cols[4];
    const ratingImdb = parseFloat(cols[6]) || 0;
    const vote = parseInt(cols[7], 10) || 0;
    const director = cols[12];
    const star = cols[14];
    const genre = cols[15];

    if (!title || Number.isNaN(year)) continue;

    filmes.push({
      nome: truncar(title, 255),
      sinopse: sintetizarSinopse(genre, year, director, star),
      ano: year,
      duracao: truncar(duration || 'N/A', 20),
      diretor: truncar(director || 'Não informado', 255),
      genero: truncar(genre || 'Não informado', 255),
      elenco: truncar(star || 'Não informado', 500),
      nota_imdb: ratingImdb.toFixed(1),
      vote,
      ratingImdb,
    });
  }

  filmes.sort((a, b) => {
    if (b.vote !== a.vote) return b.vote - a.vote;
    return b.ratingImdb - a.ratingImdb;
  });

  return filmes.slice(0, LIMITE_FILMES);
}

function gerarSql(filmes) {
  const inserts = filmes.map((f) => {
    return (
      `INSERT INTO filme (nome, sinopse, ano, duracao, diretor, genero, elenco, nota_imdb) VALUES (` +
      `'${escaparSql(f.nome)}', ` +
      `'${escaparSql(f.sinopse)}', ` +
      `${f.ano}, ` +
      `'${escaparSql(f.duracao)}', ` +
      `'${escaparSql(f.diretor)}', ` +
      `'${escaparSql(f.genero)}', ` +
      `'${escaparSql(f.elenco)}', ` +
      `${f.nota_imdb});`
    );
  });

  return `-- UniFECAF Flix - script gerado automaticamente
-- Fonte: world_imdb_movies_top_movies_per_year.csv (~${filmes.length} filmes)

CREATE DATABASE IF NOT EXISTS unifecaf_flix
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE unifecaf_flix;

SET NAMES utf8mb4;

DROP TABLE IF EXISTS filme;

CREATE TABLE filme (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  sinopse TEXT NOT NULL,
  ano INT NOT NULL,
  duracao VARCHAR(20) NOT NULL,
  diretor VARCHAR(255) NOT NULL,
  genero VARCHAR(255) NOT NULL,
  elenco VARCHAR(500) NOT NULL,
  nota_imdb DECIMAL(3, 1) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

${inserts.join('\n')}
`;
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error('CSV não encontrado:', CSV_PATH);
    process.exit(1);
  }

  const filmes = lerFilmesDoCsv();
  const sql = gerarSql(filmes);

  fs.mkdirSync(path.dirname(SQL_PATH), { recursive: true });
  fs.writeFileSync(SQL_PATH, sql, 'utf8');

  console.log(`Gerado ${SQL_PATH} com ${filmes.length} filmes.`);
}

main();
