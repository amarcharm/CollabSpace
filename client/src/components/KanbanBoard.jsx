import { useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useBoardStore } from '../store/boardStore';
import KanbanList from './KanbanList';
import AddListForm from './AddListForm';
import { calculateNewPosition } from '../utils/dndHelpers';

export default function KanbanBoard({ boardId }) {
  const { lists, loading, fetchBoard, moveCard } = useBoardStore();

  useEffect(() => {
    fetchBoard(boardId);
  }, [boardId]);

  const onDragEnd = (result) => {
    const { draggableId, source, destination } = result;

    // Drop outside any list — do nothing
    if (!destination) return;

    // Drop in same position — do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const sourceList = lists.find(l => l._id === source.droppableId);
    const destList = lists.find(l => l._id === destination.droppableId);
    const card = sourceList.cards[source.index];

    // Build the new cards array for the destination list
    // to calculate the correct fractional position
    const destCards = [...destList.cards];

    if (source.droppableId === destination.droppableId) {
      // Same list — remove from old index, insert at new
      destCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, card);
    } else {
      // Cross-list — just insert at destination index for position calc
      destCards.splice(destination.index, 0, card);
    }

    const newPosition = calculateNewPosition(destCards, destination.index);

    // Build optimistically updated lists for instant UI response
    const reorderedLists = lists.map(list => {
      if (list._id === source.droppableId && list._id !== destination.droppableId) {
        return { ...list, cards: list.cards.filter(c => c._id !== card._id) };
      }
      if (list._id === destination.droppableId) {
        const newCards = list._id === source.droppableId
          ? [...list.cards]
          : list.cards.filter(c => c._id !== card._id);

        // Remove card from its old position and insert at new
        const withoutCard = newCards.filter(c => c._id !== card._id);
        withoutCard.splice(destination.index, 0, { ...card, position: newPosition });
        return { ...list, cards: withoutCard };
      }
      return list;
    });

    moveCard(card._id, source.droppableId, destination.droppableId, newPosition, reorderedLists);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-gray-400">
      Loading board...
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-6 overflow-x-auto h-full items-start">
        {lists.map(list => (
          <KanbanList key={list._id} list={list} />
        ))}
        <AddListForm boardId={boardId} />
      </div>
    </DragDropContext>
  );
}