
import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';


const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await api.post('/forgot-password', { email });
      navigate('/verify-otp', { state: { email } });
    };
  
    return (
      <div className="min-h-screen flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
          <input type="email" placeholder="Enter your email" required
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border rounded" />
          <button type="submit" onClick={() => navigate('/verify-otp')} className="w-full bg-blue-600 text-white p-2 rounded">Send OTP</button>
        </form>
      </div>
    );
};

export default ForgotPassword;
  