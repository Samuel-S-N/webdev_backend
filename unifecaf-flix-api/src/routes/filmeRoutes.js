const express = require('express');
const filmeController = require('../controllers/filmeController');

const router = express.Router();

router.get('/filtro/filme', filmeController.filtrar);
router.get('/filme/:id', filmeController.buscarPorId);
router.get('/filme', filmeController.listar);

module.exports = router;
