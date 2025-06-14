import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../../utils/api';
// import Modal from '../components/Modal'; // You can build this or use any modal library
import io from 'socket.io-client';
import Modal from '../Modal';

const socket = io(import.meta.env.VITE_SOCKET_URL);

interface Announcement {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  media?: string;
  author?: { full_name: string };
}

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    file: null as File | null,
  });

  const school_id = localStorage.getItem('school_id');

  const fetchAnnouncements = async () => {
    const res = await api.get(`/announcements`, {
      params: {
        school_id,
        page,
        limit: 5,
        q: searchQuery,
      },
    });
    setAnnouncements(res.data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [searchQuery, page]);

  useEffect(() => {
    socket.on('new_announcement', (data) => {
      if (data.school_id === school_id) {
        alert(`📢 New Announcement: ${data.title}`);
        fetchAnnouncements();
      }
    });

    return () => {
      socket.off('new_announcement');
    };
  }, []);

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append('title', newAnnouncement.title);
    formData.append('message', newAnnouncement.message);
    formData.append('school_id', school_id || '');
    if (newAnnouncement.file) {
      formData.append('file', newAnnouncement.file);
    }

    await api.post('/announcements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setShowModal(false);
    setNewAnnouncement({ title: '', message: '', file: null });
    fetchAnnouncements();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📣 Announcements</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          <Plus size={16} className="inline mr-1" /> New Announcement
        </button>
      </div>

      <div className="mb-4 flex items-center">
        <Search size={18} className="mr-2" />
        <input
          type="text"
          placeholder="Search by title or message"
          className="border rounded p-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="border p-4 rounded shadow bg-white dark:bg-gray-800"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">{a.title}</h2>
              <span className="text-sm text-gray-500">{new Date(a.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-200">{a.message}</p>
            {a.media && (
              <img
                src={`${api.defaults.baseURL}/uploads/${a.media}`}
                alt="Attachment"
                className="mt-2 rounded max-h-60"
              />
            )}
            <p className="text-sm mt-2 text-gray-500">Posted by: {a.author?.full_name}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Create Announcement</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border mb-2"
              value={newAnnouncement.title}
              onChange={(e) =>
                setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
              }
            />
            <textarea
              placeholder="Message"
              className="w-full p-2 border mb-2"
              value={newAnnouncement.message}
              onChange={(e) =>
                setNewAnnouncement({ ...newAnnouncement, message: e.target.value })
              }
            />
            <input
              type="file"
              className="mb-4"
              onChange={(e) =>
                setNewAnnouncement({ ...newAnnouncement, file: e.target.files?.[0] || null })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleCreate}
              >
                Post
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AnnouncementsPage;
