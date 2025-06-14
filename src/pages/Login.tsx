import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });

      const { token, chatToken, email: userEmail, role, full_name, school_id } = res.data;
      const decoded = jwtDecode<{ id: string }>(token);
      const user_id = decoded.id;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('role', role);
      localStorage.setItem('full_name', full_name);
      if (school_id) localStorage.setItem('school_id', school_id);
      if (chatToken) localStorage.setItem('chat_token', chatToken); // save for later

      // Redirect by role
      const roleRoutes: Record<string, string> = {
        super_admin: '/super-admin',
        school_super_admin: '/school-super-admin',
        school_admin: '/school-admin',
        teacher: '/teacher',
        student: '/student',
        parent: '/parent',
      };

      navigate(roleRoutes[role] || '/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <span
            onClick={() => navigate('/forgot-password')}
            className="text-blue-500 cursor-pointer"
          >
            Forgot password?
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
