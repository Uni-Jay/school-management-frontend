import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Modal from '../Modal';
import { Pencil, Trash2, Check, Plus, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

interface School {
  id: number;
  name: string;
  type: string;
  contact_email: string;
  phone: string;
  address: string;
  website: string;
  established_year: number;
  description: string;
  logo_url?: string;
  isActive: boolean;
  createdAt: string;
}

const SchoolManagement: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editModeId, setEditModeId] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchSchools = async () => {
    try {
      const res = await api.get('/schools');
      let filtered = res.data;

      if (search) {
        filtered = filtered.filter((s: School) =>
          s.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (activeOnly) {
        filtered = filtered.filter((s: School) => s.isActive);
      }

      setSchools(filtered);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch schools');
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [search, activeOnly]);

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      for (let key in formData) {
        if (formData[key]) payload.append(key, formData[key]);
      }

      await api.post('/schools', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('School added');
      setShowAddModal(false);
      setFormData({});
      fetchSchools();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add school');
    }
  };

  const handleEdit = (school: School) => {
    setEditModeId(school.id);
    setFormData({ ...school });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editModeId) return;

    try {
      const payload = new FormData();
      for (let key in formData) {
        if (key !== 'id' && formData[key] !== undefined) {
          payload.append(key, formData[key]);
        }
      }

      await api.put(`/schools/${editModeId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('School updated');
      setEditModeId(null);
      setFormData({});
      setEditModalOpen(false);
      fetchSchools();
    } catch (error) {
      console.error(error);
      toast.error('Update failed');
    }
  };

  const toggleSchoolStatus = async (id: number, isActive: boolean) => {
    await api.patch(`/schools/${id}/${isActive ? 'deactivate' : 'reactivate'}`);
    toast.success(`School ${isActive ? 'deactivated' : 'reactivated'}`);
    fetchSchools();
  };

  const handleView = (school: School) => {
    setSelectedSchool(school);
    setViewModalOpen(true);
  };

  const paginated = schools.slice((page - 1) * limit, page * limit);
  const pageCount = Math.ceil(schools.length / limit);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">School Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add School
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-64"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Active Only
        </label>
      </div>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Logo</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Website</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((school) => (
            <tr key={school.id} className="border-t">
              <td className="p-3">
                {school.logo_url && (
                  <img
                    src={`http://localhost:5000/uploads/schoolAdmins/${school.logo_url}`}
                    alt="logo"
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </td>
              <td className="p-3">{school.name}</td>
              <td className="p-3">{school.type}</td>
              <td className="p-3">{school.contact_email}</td>
              <td className="p-3">{school.phone}</td>
              <td className="p-3">{school.website}</td>
              <td className="p-3 text-right space-x-2">
                <button onClick={() => handleView(school)} className="text-indigo-600">
                  <Eye size={18} />
                </button>
                <button onClick={() => handleEdit(school)} className="text-blue-600">
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => toggleSchoolStatus(school.id, school.isActive)}
                  className={school.isActive ? 'text-red-600' : 'text-green-600'}
                >
                  {school.isActive ? <Trash2 size={18} /> : <Check size={18} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {page} of {pageCount}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            disabled={page === pageCount}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add, Edit, View modals here */}
      {/* ✅ You already implemented them well, no issues there */}
      {/* Add Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <div className="p-4 space-y-2">
            <h2 className="text-lg font-bold">Add School</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <select
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <input
              type="text"
              placeholder="Website"
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
            <input
              type="number"
              placeholder="Established Year"
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="file"
              className="w-full"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.files?.[0] || null })}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Add</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal onClose={() => setEditModalOpen(false)}>
          <div className="p-4 space-y-2">
            <h2 className="text-lg font-bold">Edit School</h2>
            <input
              type="text"
              value={formData.name || ''}
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <select
              className="w-full p-2 border"
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="">Select Type</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
            <input
              type="email"
              value={formData.contact_email || ''}
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            />
            <input
              type="text"
              value={formData.phone || ''}
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="text"
              value={formData.address || ''}
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <input
              type="text"
              value={formData.website || ''}
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
            <input
              type="number"
              value={formData.established_year || ''}
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
            />
            <textarea
              value={formData.description || ''}
              className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="file"
              className="w-full"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.files?.[0] || null })}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => {
                handleUpdate();
                setEditModalOpen(false);
              }}>Update</button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedSchool && (
  <Modal onClose={() => setViewModalOpen(false)}>
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold mb-2">View School</h2>
      <div className="space-y-2">
        {selectedSchool.logo_url && (
          <img
            src={`http://localhost:8000/uploads/schools/${selectedSchool.logo_url}`}
            className="w-16 h-16 object-cover rounded"
            alt="School Logo"
          />
        )}
        <div><strong>Name:</strong> {selectedSchool.name}</div>
        <div><strong>Type:</strong> {selectedSchool.type}</div>
        <div><strong>Email:</strong> {selectedSchool.contact_email}</div>
        <div><strong>Phone:</strong> {selectedSchool.phone}</div>
        <div><strong>Website:</strong> {selectedSchool.website}</div>
        <div><strong>Address:</strong> {selectedSchool.address}</div>
        <div><strong>Year:</strong> {selectedSchool.established_year}</div>
        <div><strong>Status:</strong> {selectedSchool.isActive ? 'Active' : 'Inactive'}</div>
        <div><strong>Description:</strong> {selectedSchool.description}</div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setViewModalOpen(false)}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
)}




    </div>
  );
};

export default SchoolManagement;
