
import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as any)?.email;
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await api.post('/reset-password', { email, newPassword });
      alert('Password reset successfully');
      navigate('/login');
    };
  
    return (
      <div className="min-h-screen flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>
          <input type="password" placeholder="New password" required
            value={newPassword} onChange={e => setNewPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded" />
          <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded">Reset</button>
        </form>
      </div>
    );
  };
export default ResetPassword;  