const express = require('express');
const Card = require('../models/Card');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a card at the bottom of a list
router.post('/', auth, async (req, res) => {
  try {
    const { title, listId, boardId } = req.body;

    const lastCard = await Card.findOne({ list: listId }).sort('-position');
    const position = lastCard ? lastCard.position + 1000 : 1000;

    const card = await Card.create({ title, list: listId, board: boardId, position });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single card details
router.get('/:cardId', auth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId).populate('assignees', 'name email avatar');
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update card fields (title, description, dueDate, labels, assignees)
router.put('/:cardId', auth, async (req, res) => {
  try {
    const allowed = ['title', 'description', 'dueDate', 'labels', 'assignees'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const card = await Card.findByIdAndUpdate(req.params.cardId, updates, { new: true });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Move card — handles both within-list and cross-list drag-and-drop
router.put('/:cardId/move', auth, async (req, res) => {
  try {
    const { newListId, newPosition } = req.body;
    // newPosition is calculated by the frontend based on neighbours
    // e.g. if dropped between cards at 1000 and 2000, frontend sends 1500
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { list: newListId, position: newPosition },
      { new: true }
    );
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a comment to a card
router.post('/:cardId/comments', auth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);
    card.comments.push({ user: req.userId, text: req.body.text });
    await card.save();
    res.json(card.comments[card.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a card
router.delete('/:cardId', auth, async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.cardId);
    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;