import { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useBoardStore } from '../store/boardStore';
import KanbanCard from './KanbanCard';

export default function KanbanList({ list }) {
  const { addCard, deleteList } = useBoardStore();
  const [newCardTitle, setNewCardTitle] = useState('');
  const [addingCard, setAddingCard] = useState(false);

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;
    await addCard(list._id, list.board, newCardTitle.trim());
    setNewCardTitle('');
    setAddingCard(false);
  };

  return (
    <div className="bg-slate-100 rounded-xl w-72 flex-shrink-0 flex flex-col max-h-[80vh]">
      {/* List Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="font-semibold text-slate-800 text-sm">{list.title}</h3>
        <button
          onClick={() => deleteList(list._id)}
          className="text-slate-400 hover:text-red-500 text-xs px-1"
        >
          ✕
        </button>
      </div>

      {/* Droppable card area */}
      <Droppable droppableId={list._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 px-2 pb-2 overflow-y-auto flex-1 min-h-[4px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {list.cards.map((card, index) => (
              <Draggable key={card._id} draggableId={card._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <KanbanCard card={card} listId={list._id} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add card area */}
      <div className="px-2 pb-2">
        {addingCard ? (
          <div className="flex flex-col gap-1">
            <textarea
              autoFocus
              value={newCardTitle}
              onChange={e => setNewCardTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(); } }}
              placeholder="Card title..."
              className="w-full text-sm rounded p-2 border border-blue-400 resize-none outline-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
              >
                Add card
              </button>
              <button
                onClick={() => setAddingCard(false)}
                className="text-slate-500 text-xs px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full text-left text-slate-500 text-sm hover:bg-slate-200 rounded px-2 py-1 transition"
          >
            + Add a card
          </button>
        )}
      </div>
    </div>
  );
}