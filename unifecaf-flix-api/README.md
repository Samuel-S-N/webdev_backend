# UniFECAF Flix API

API REST do acervo de filmes da plataforma fictícia **UniFECAF Flix**, desenvolvida em Node.js + Express + Prisma + MySQL, no padrão **MVC**.

## Requisitos

- Node.js 18+
- MySQL 8+

## Instalação

```bash
cd unifecaf-flix-api
npm install
```

## Banco de dados

### 1. Gerar o script SQL (a partir do CSV)

```bash
npm run gerar-sql
```

Isso cria `database/unifecaf_flix.sql` com ~200 filmes.

### 2. Importar no MySQL

```bash
mysql -u usuario -p < database/unifecaf_flix.sql
```

Ou importe pelo MySQL Workbench / DBeaver.

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com sua `DATABASE_URL` e `PORT` (padrão 3000).

### 4. Gerar o Prisma Client

```bash
npx prisma generate
```

> Use o script SQL para criar e popular o banco. Não rode `prisma migrate dev` depois do import completo.

## Executar a API

```bash
npm run dev
```

Ou em produção local:

```bash
npm start
```

A API ficará em `http://localhost:3000`.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/v1/controle-filmes/filme` | Lista todos os filmes |
| GET | `/v1/controle-filmes/filme/:id` | Busca filme por ID |
| GET | `/v1/controle-filmes/filtro/filme?nome=xxx` | Filtra por nome ou sinopse |

## Testes com Postman

Importe a coleção em `postman/unifecaf-flix.postman_collection.json`.

## Entrega

Compacte a pasta `unifecaf-flix-api` (incluindo `database/unifecaf_flix.sql`) em `.zip` ou `.rar` conforme orientação da disciplina.
