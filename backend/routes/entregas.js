const express = require('express');
const router = express.Router();
const { Entrega } = require('../models');

router.get('/', async (req, res) => {
  const list = await Entrega.findAll({ order: [['createdAt', 'DESC']] });
  res.json(list);
});

router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    if (payload.horaoPrevisto) payload.horaoPrevisto = new Date(payload.horaoPrevisto);
    if (payload.horarioConclusao != null && payload.horarioConclusao !== '') payload.horarioConclusao = new Date(payload.horarioConclusao);
    const created = await Entrega.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    const message = err.errors ? err.errors.map(e => e.message).join('; ') : err.message;
    res.status(400).json({ error: message || 'invalid payload' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entrega = await Entrega.findByPk(id);
    if (!entrega) return res.status(404).json({ error: 'not found' });
    const updates = req.body;
    if (updates.horaoPrevisto) updates.horaoPrevisto = new Date(updates.horaoPrevisto);
    if (updates.horarioConclusao != null && updates.horarioConclusao !== '') updates.horarioConclusao = new Date(updates.horarioConclusao);
    await entrega.update(updates);
    res.json(entrega);
  } catch (err) {
    console.error(err);
    const message = err.errors ? err.errors.map(e => e.message).join('; ') : err.message;
    res.status(400).json({ error: message || 'invalid update' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entrega = await Entrega.findByPk(id);
    if (!entrega) return res.status(404).json({ error: 'not found' });
    await entrega.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid delete' });
  }
});

module.exports = router;
