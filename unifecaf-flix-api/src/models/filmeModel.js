const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function serializarFilme(filme) {
  if (!filme) return null;
  return {
    ...filme,
    nota_imdb: filme.nota_imdb != null ? Number(filme.nota_imdb) : null,
  };
}

async function listarTodos() {
  const filmes = await prisma.filme.findMany({
    orderBy: { id: 'asc' },
  });
  return filmes.map(serializarFilme);
}

async function buscarPorId(id) {
  const filme = await prisma.filme.findUnique({
    where: { id },
  });
  return serializarFilme(filme);
}

async function filtrar(termo) {
  const filmes = await prisma.filme.findMany({
    where: {
      OR: [
        { nome: { contains: termo } },
        { sinopse: { contains: termo } },
      ],
    },
    orderBy: { id: 'asc' },
  });
  return filmes.map(serializarFilme);
}

module.exports = {
  listarTodos,
  buscarPorId,
  filtrar,
};
