import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Modal from '../Modal';
import { Pencil, Eye, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

interface School {
  id: number;
  name: string;
}

interface SuperAdmin {
  id: number;
  phone: string;
  address: string;
  blood_type: string;
  gender: string;
  birthday: string;
  img?: string;
  user: User;
  school: School;
}

const SchoolSuperAdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<SuperAdmin[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editModeId, setEditModeId] = useState<number | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<SuperAdmin | null>(null);
  const [search, setSearch] = useState('');

  const fetchAdmins = async () => {
    try {
      let url = '/schoolsuperadmins';
      if (search) {
        url = `schoolsuperadmins/search/SchoolName?query=AdminName&search=${search}`;
      }
      const res = await api.get(url);
      setAdmins(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch School Super Admins');
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [search]);

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      for (let key in formData) {
        if (formData[key]) payload.append(key, formData[key]);
      }
      await api.post('/schoolsuperadmins', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('School Super Admin created');
      setShowAddModal(false);
      setFormData({});
      fetchAdmins();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this Super Admin?")) {
      return;
    }

    try {
      await api.delete(`/schoolsuperadmins/${id}`);
      toast.success('Deleted successfully');
      fetchAdmins();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (admin: SuperAdmin) => {
    setEditModeId(admin.id);
    setFormData({ ...admin });
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
      await api.put(`/schoolsuperadmins/${editModeId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Updated successfully');
      setEditModeId(null);
      setFormData({});
      setEditModalOpen(false);
      fetchAdmins();
    } catch (error) {
      console.error(error);
      toast.error('Update failed');
    }
  };

  const handleView = (admin: SuperAdmin) => {
    setSelectedAdmin(admin);
    setViewModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <h1 className="text-xl font-bold">School Super Admin Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Super Admin
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full md:w-1/3"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">School</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-right w-full">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t">
                <td className="p-3">
                  {admin.img && (
                    <img
                      src={`http://localhost:8000/uploads/schoolSuperAdmins/${admin.img}`}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="profile"
                    />
                  )}
                </td>
                <td className="p-3">{admin.user.full_name}</td>
                <td className="p-3">{admin.user.email}</td>
                <td className="p-3">{admin.school.name}</td>
                <td className="p-3">{admin.phone}</td>
                <td className=" text-right gap-4">
                  <button onClick={() => handleView(admin)} className="text-indigo-600">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleEdit(admin)} className="text-blue-600">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(admin.id)} className="text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <div className="p-4 space-y-2">
            <h2 className="font-bold text-lg">Add Super Admin</h2>
            <input type="text" placeholder="Full Name" className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
            <input type="email" placeholder="Email" className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type="text" placeholder="Phone" className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <input type="text" placeholder="Address" className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            <input type="text" placeholder="Blood Type" className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })} />
            <input type="text" placeholder="Gender" className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
            <input type="date" placeholder="Birthday" className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} />
            <input type="number" placeholder="School ID" className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, school_id: e.target.value })} />
            <input type="file" className="w-full" accept="image/*"
              onChange={(e) => setFormData({ ...formData, img: e.target.files?.[0] || null })} />
            <div className="flex justify-end gap-2">
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
            <h2 className="font-bold text-lg">Edit Super Admin</h2>
            <input type="text" value={formData.phone || ''} className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <input type="text" value={formData.address || ''} className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            <input type="text" value={formData.blood_type || ''} className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })} />
            <input type="text" value={formData.gender || ''} className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
            <input type="date" value={formData.birthday || ''} className="w-full p-2 border"
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} />
            <input type="file" className="w-full" accept="image/*"
              onChange={(e) => setFormData({ ...formData, img: e.target.files?.[0] || null })} />
            <div className="flex justify-end gap-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedAdmin && (
        <Modal onClose={() => setViewModalOpen(false)}>
          <div className="p-4 space-y-2">
            <h2 className="font-bold text-lg">View Super Admin</h2>
            {selectedAdmin.img && (
              <img
                src={`http://localhost:8000/uploads/schoolSuperAdmins/${selectedAdmin.img}`}
                className="w-20 h-20 rounded-full"
                alt="profile"
              />
            )}
            <div><strong>Name:</strong> {selectedAdmin.user.full_name}</div>
            <div><strong>Email:</strong> {selectedAdmin.user.email}</div>
            <div><strong>School:</strong> {selectedAdmin.school.name}</div>
            <div><strong>Phone:</strong> {selectedAdmin.phone}</div>
            <div><strong>Address:</strong> {selectedAdmin.address}</div>
            <div><strong>Blood Type:</strong> {selectedAdmin.blood_type}</div>
            <div><strong>Gender:</strong> {selectedAdmin.gender}</div>
            <div><strong>Birthday:</strong> {selectedAdmin.birthday}</div>
            <div className="flex justify-end">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setViewModalOpen(false)}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SchoolSuperAdminManagement;


 
