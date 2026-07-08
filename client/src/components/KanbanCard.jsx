import { useBoardStore } from '../store/boardStore';

export default function KanbanCard({ card, listId, isDragging }) {
  const { deleteCard } = useBoardStore();

  return (
    <div className={`bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-200 group relative
      ${isDragging ? 'shadow-lg rotate-1 border-blue-300' : 'hover:border-blue-300'}
      transition-all cursor-grab active:cursor-grabbing`}
    >
      {/* Labels */}
      {card.labels?.length > 0 && (
        <div className="flex gap-1 mb-1 flex-wrap">
          {card.labels.map(label => (
            <span key={label} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {label}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-slate-800">{card.title}</p>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-1">
        {card.dueDate && (
          <span className="text-xs text-slate-400">
            📅 {new Date(card.dueDate).toLocaleDateString()}
          </span>
        )}
        {card.comments?.length > 0 && (
          <span className="text-xs text-slate-400">💬 {card.comments.length}</span>
        )}
      </div>

      {/* Delete button — only visible on hover */}
      <button
        onClick={() => deleteCard(card._id, listId)}
        className="absolute top-1 right-1 text-slate-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition"
      >
        ✕
      </button>
    </div>
  );
}