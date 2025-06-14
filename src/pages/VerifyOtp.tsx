
import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOtp: React.FC = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as any)?.email;
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await api.post('/verify-otp', { email, code });
      navigate('/reset-password', { state: { email } });
    };
  
    return (
      <div className="min-h-screen flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
          <input type="text" placeholder="Enter OTP" required
            value={code} onChange={e => setCode(e.target.value)}
            className="w-full mb-4 p-2 border rounded" />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Verify</button>
        </form>
      </div>
    );
}
export default VerifyOtp;
  