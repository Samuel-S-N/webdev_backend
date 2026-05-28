const filmeModel = require('../models/filmeModel');

async function listar(req, res) {
  try {
    const filmes = await filmeModel.listarTodos();
    return res.status(200).json({
      status: true,
      items: filmes.length,
      filmes,
    });
  } catch (error) {
    console.error('Erro ao listar filmes:', error);
    return res.status(500).json({
      status: false,
      message: 'Erro interno ao listar filmes.',
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: false,
        message: 'ID inválido. Informe um número inteiro positivo.',
      });
    }

    const filme = await filmeModel.buscarPorId(id);

    if (!filme) {
      return res.status(404).json({
        status: false,
        message: 'Filme não encontrado.',
      });
    }

    return res.status(200).json({
      status: true,
      filme,
    });
  } catch (error) {
    console.error('Erro ao buscar filme:', error);
    return res.status(500).json({
      status: false,
      message: 'Erro interno ao buscar filme.',
    });
  }
}

async function filtrar(req, res) {
  try {
    const termo = typeof req.query.nome === 'string' ? req.query.nome.trim() : '';

    if (!termo) {
      return res.status(400).json({
        status: false,
        message: 'Parâmetro nome é obrigatório e não pode estar vazio.',
      });
    }

    const filmes = await filmeModel.filtrar(termo);

    return res.status(200).json({
      status: true,
      items: filmes.length,
      filmes,
    });
  } catch (error) {
    console.error('Erro ao filtrar filmes:', error);
    return res.status(500).json({
      status: false,
      message: 'Erro interno ao filtrar filmes.',
    });
  }
}

module.exports = {
  listar,
  buscarPorId,
  filtrar,
};
