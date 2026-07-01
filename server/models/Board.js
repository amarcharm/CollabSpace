const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  background: { type: String, default: '#0079bf' },
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);