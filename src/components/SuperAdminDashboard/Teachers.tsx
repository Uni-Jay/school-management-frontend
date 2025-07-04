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

interface Teacher {
  id: number;
  user_id: number;
  phone: string;
  address: string;
  blood_type: string;
  gender: string;
  birthday: string;
  img?: string;  // backend returns full URL
  user: User;
  school: School;
}

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [editModeId, setEditModeId] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const fetchTeachers = async () => {
    try {
      let url = '/teachers';
      if (search) {
        url = `/teachers/search?query=${encodeURIComponent(search)}`;
      }
      const res = await api.get(url);
      setTeachers(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch teachers');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [search]);

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      });

      await api.post('/teachers', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Teacher created');
      setShowAddModal(false);
      setFormData({});
      fetchTeachers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create teacher');
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditModeId(teacher.user_id);
    setFormData({
      ...teacher,
      full_name: teacher.user.full_name,
      email: teacher.user.email,
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editModeId) return;
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      });

      await api.put(`/teachers/${editModeId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Updated successfully');
      setEditModeId(null);
      setFormData({});
      setEditModalOpen(false);
      fetchTeachers();
    } catch (error) {
      console.error(error);
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await api.delete(`/teachers/${id}`);
      toast.success('Deleted successfully');
      fetchTeachers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete');
    }
  };

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setViewModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Teachers</h2>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18} /> Add Teacher
        </button>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="border p-2 w-full md:w-1/3 mb-4" />

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">School</th>
              <th className="p-3">Phone</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-t">
                <td className="p-3">
                  {teacher.img && <img src={teacher.img} className="w-10 h-10 rounded-full object-cover" alt="profile" />}
                </td>
                <td className="p-3">{teacher.user.full_name}</td>
                <td className="p-3">{teacher.user.email}</td>
                <td className="p-3">{teacher.school.name}</td>
                <td className="p-3">{teacher.phone}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleView(teacher)} className="text-indigo-600 mr-2"><Eye size={18} /></button>
                  <button onClick={() => handleEdit(teacher)} className="text-blue-600 mr-2"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(teacher.user_id)} className="text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <div className="p-4">
            <h3 className="font-bold mb-2">Add Teacher</h3>
            <div className="space-y-2">
              <input type="text" placeholder="Full Name" className="w-full p-2 border" onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
              <input type="email" placeholder="Email" className="w-full p-2 border" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="number" placeholder="School ID" className="w-full p-2 border" onChange={(e) => setFormData({ ...formData, school_id: e.target.value })} />
              <input type="text" placeholder="Phone" className="w-full p-2 border" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <input type="text" placeholder="Address" className="w-full p-2 border" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              <input type="text" placeholder="Blood Type" className="w-full p-2 border" onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })} />
              <input type="text" placeholder="Gender" className="w-full p-2 border" onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
              <input type="date" className="w-full p-2 border" onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} />
              <input type="file" accept="image/*" className="w-full" onChange={(e) => setFormData({ ...formData, img: e.target.files?.[0] })} />
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal onClose={() => setEditModalOpen(false)}>
          <div className="p-4">
            <h3 className="font-bold mb-2">Edit Teacher</h3>
            <div className="space-y-2">
              <input type="text" value={formData.full_name || ''} placeholder="Full Name" className="w-full p-2 border"
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
              <input type="email" value={formData.email || ''} placeholder="Email" className="w-full p-2 border"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="text" value={formData.phone || ''} placeholder="Phone" className="w-full p-2 border"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <input type="text" value={formData.address || ''} placeholder="Address" className="w-full p-2 border"
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              <input type="text" value={formData.blood_type || ''} placeholder="Blood Type" className="w-full p-2 border"
                onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })} />
              <input type="text" value={formData.gender || ''} placeholder="Gender" className="w-full p-2 border"
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
              <input type="date" value={formData.birthday || ''} className="w-full p-2 border"
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} />
              <input type="file" accept="image/*" className="w-full"
                onChange={(e) => setFormData({ ...formData, img: e.target.files?.[0] })} />
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedTeacher && (
        <Modal onClose={() => setViewModalOpen(false)}>
          <div className="p-4">
            <h3 className="font-bold mb-2">Teacher Details</h3>
            {selectedTeacher.img && <img src={selectedTeacher.img} alt="profile" className="w-20 h-20 rounded-full mb-3" />}
            <p><strong>Name:</strong> {selectedTeacher.user.full_name}</p>
            <p><strong>Email:</strong> {selectedTeacher.user.email}</p>
            <p><strong>Phone:</strong> {selectedTeacher.phone}</p>
            <p><strong>Address:</strong> {selectedTeacher.address}</p>
            <p><strong>Gender:</strong> {selectedTeacher.gender}</p>
            <p><strong>Blood Type:</strong> {selectedTeacher.blood_type}</p>
            <p><strong>Birthday:</strong> {selectedTeacher.birthday}</p>
            <div className="flex justify-end mt-3">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setViewModalOpen(false)}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TeachersPage;
