import api from './axios';

export const createCard = (data) => api.post('/cards', data);
export const updateCard = (cardId, data) => api.put(`/cards/${cardId}`, data);
export const moveCard = (cardId, data) => api.put(`/cards/${cardId}/move`, data);
export const deleteCard = (cardId) => api.delete(`/cards/${cardId}`);
export const addComment = (cardId, text) => api.post(`/cards/${cardId}/comments`, { text });