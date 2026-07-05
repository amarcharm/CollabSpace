import api from './axios';

export const createBoard = (data) => api.post('/boards', data);
export const getBoardsByWorkspace = (wsId) => api.get(`/boards/workspace/${wsId}`);
export const getBoardById = (boardId) => api.get(`/boards/${boardId}`);
export const deleteBoard = (boardId) => api.delete(`/boards/${boardId}`);