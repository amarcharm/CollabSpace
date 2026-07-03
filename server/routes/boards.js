const express = require('express');
const Board = require('../models/Board');
const List = require('../models/List');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a board inside a workspace
router.post('/', auth, async (req, res) => {
  try {
    const { title, workspaceId, background } = req.body;
    const board = await Board.create({
      title,
      workspace: workspaceId,
      createdBy: req.userId,
      background: background || '#0079bf',
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all boards in a workspace
router.get('/workspace/:workspaceId', auth, async (req, res) => {
  try {
    const boards = await Board.find({ workspace: req.params.workspaceId });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single board with its lists and cards
router.get('/:boardId', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const lists = await List.find({ board: req.params.boardId }).sort('position');
    res.json({ board, lists });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a board
router.delete('/:boardId', auth, async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.params.boardId);
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;