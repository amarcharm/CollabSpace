import { useState } from 'react';
import { useBoardStore } from '../store/boardStore';

export default function AddListForm({ boardId }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const { addList } = useBoardStore();

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await addList(boardId, title.trim());
    setTitle('');
    setOpen(false);
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="w-72 flex-shrink-0 bg-white/30 hover:bg-white/50 text-white font-medium rounded-xl px-4 py-3 text-sm transition"
    >
      + Add another list
    </button>
  );

  return (
    <div className="w-72 flex-shrink-0 bg-white rounded-xl p-3 flex flex-col gap-2 shadow">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="List title..."
        className="border border-blue-400 rounded px-2 py-1 text-sm outline-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
        >
          Add list
        </button>
        <button onClick={() => setOpen(false)} className="text-slate-500 text-xs">
          Cancel
        </button>
      </div>
    </div>
  );
}