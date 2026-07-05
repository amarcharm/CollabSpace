import { create } from 'zustand';
import { getListsByBoard, createList as apiCreateList, deleteList as apiDeleteList } from '../api/lists';
import { createCard as apiCreateCard, moveCard as apiMoveCard, deleteCard as apiDeleteCard } from '../api/cards';

export const useBoardStore = create((set, get) => ({
  lists: [],       // array of { ...list, cards: [...] }
  loading: false,

  // Load the full board state
  fetchBoard: async (boardId) => {
    set({ loading: true });
    const res = await getListsByBoard(boardId);
    set({ lists: res.data, loading: false });
  },

  // Optimistic local add — update UI instantly, then persist
  addList: async (boardId, title) => {
    const res = await apiCreateList({ title, boardId });
    set(state => ({ lists: [...state.lists, { ...res.data, cards: [] }] }));
  },

  addCard: async (listId, boardId, title) => {
    const res = await apiCreateCard({ title, listId, boardId });
    set(state => ({
      lists: state.lists.map(l =>
        l._id === listId ? { ...l, cards: [...l.cards, res.data] } : l
      ),
    }));
  },

  deleteList: async (listId) => {
    await apiDeleteList(listId);
    set(state => ({ lists: state.lists.filter(l => l._id !== listId) }));
  },

  deleteCard: async (cardId, listId) => {
    await apiDeleteCard(cardId);
    set(state => ({
      lists: state.lists.map(l =>
        l._id === listId ? { ...l, cards: l.cards.filter(c => c._id !== cardId) } : l
      ),
    }));
  },

  // The core drag-and-drop state handler — called on every DnD drop event
  moveCard: async (cardId, sourceListId, destListId, newPosition, reorderedLists) => {
    // 1. Instantly update local UI state (optimistic)
    set({ lists: reorderedLists });

    // 2. Persist to server in background
    try {
      await apiMoveCard(cardId, { newListId: destListId, newPosition });
    } catch (err) {
      // 3. On failure, re-fetch the real server state to rollback
      console.error('Move failed, rolling back:', err);
      const boardId = get().lists[0]?.board;
      if (boardId) get().fetchBoard(boardId);
    }
  },
}));