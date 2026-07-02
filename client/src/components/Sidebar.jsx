import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Sidebar({ onSelectWorkspace }) {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    api.get('/workspaces').then(res => setWorkspaces(res.data));
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen p-4 flex flex-col gap-2">
      <h2 className="text-lg font-semibold mb-4">Workspaces</h2>
      {workspaces.map(ws => (
        <button
          key={ws._id}
          onClick={() => onSelectWorkspace(ws)}
          className="text-left px-3 py-2 rounded hover:bg-slate-700 transition"
        >
          {ws.name}
        </button>
      ))}
    </aside>
  );
}