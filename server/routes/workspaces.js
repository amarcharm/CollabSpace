const express = require('express');
const crypto = require('crypto');
const Workspace = require('../models/Workspace');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const workspace = await Workspace.create({
      name: req.body.name,
      owner: req.userId,
      members: [{ user: req.userId, role: 'admin' }],
      inviteCode: crypto.randomBytes(6).toString('hex'),
    });
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  const workspaces = await Workspace.find({ 'members.user': req.userId });
  res.json(workspaces);
});

router.post('/join/:inviteCode', auth, async (req, res) => {
  const workspace = await Workspace.findOne({ inviteCode: req.params.inviteCode });
  if (!workspace) return res.status(404).json({ message: 'Invalid invite code' });

  const alreadyMember = workspace.members.some(m => m.user.toString() === req.userId);
  if (!alreadyMember) {
    workspace.members.push({ user: req.userId, role: 'member' });
    await workspace.save();
  }
  res.json(workspace);
});

module.exports = router;