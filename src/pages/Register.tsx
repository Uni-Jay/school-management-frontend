import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api'; // Assuming you have some styles for the form

// Zod validation schema
const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().optional(),
  blood_type: z.enum(['', 'A+', 'O+', 'B+', 'AB+', 'O-']),
  gender: z.enum(['', 'male', 'female']),
  birthday: z.string().optional(),
});

interface FormDataState {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  blood_type: string;
  gender: string;
  birthday: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormDataState>({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    blood_type: '',
    gender: '',
    birthday: '',
  });

  const [img, setImg] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImg(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate formData
    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (img) data.append('img', img);

      await api.post('/superAdmins', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Super Admin registered successfully!');

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        blood_type: '',
        gender: '',
        birthday: '',
      });
      setImg(null);

      // Navigate after toast shows
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Register
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 dark:text-white">
          <input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="input"
          />
          <select
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
            className="input dark:text-black dark:bg-gray-200"
          >
            <option value="">Blood Type</option>
            <option value="A+">A+</option>
            <option value="O+">O+</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="O-">O-</option>
          </select>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input dark:text-black dark:bg-gray-200"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            className="input"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="input col-span-2"
          />
          <input
            type="hidden"
            name="role"
            className="input"
            disabled
            value="super_admin"
          />
          {/* <input
          type='password'
          name="password"
          placeholder="Password (optional)"
          value={formData.password}
          onChange={handleChange}
          className="input col-span-2"
          /> */}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-2 rounded text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <ToastContainer position="top-center" autoClose={3000} />
      </form>
    </div>
  );
};

export default Register;
