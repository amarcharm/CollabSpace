const express = require('express');
const List = require('../models/List');
const Card = require('../models/Card');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a list
router.post('/', auth, async (req, res) => {
  try {
    const { title, boardId } = req.body;

    // Put new list at the end — find highest position first
    const lastList = await List.findOne({ board: boardId }).sort('-position');
    const position = lastList ? lastList.position + 1000 : 1000;

    const list = await List.create({ title, board: boardId, position });
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update list title
router.put('/:listId', auth, async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(
      req.params.listId,
      { title: req.body.title },
      { new: true }
    );
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete list + all its cards
router.delete('/:listId', auth, async (req, res) => {
  try {
    await Card.deleteMany({ list: req.params.listId });
    await List.findByIdAndDelete(req.params.listId);
    res.json({ message: 'List and its cards deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all lists for a board with their cards
router.get('/board/:boardId', auth, async (req, res) => {
  try {
    const lists = await List.find({ board: req.params.boardId }).sort('position');
    const cards = await Card.find({ board: req.params.boardId }).sort('position');

    // Attach cards to their parent list
    const listsWithCards = lists.map(list => ({
      ...list.toObject(),
      cards: cards.filter(c => c.list.toString() === list._id.toString()),
    }));

    res.json(listsWithCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;