import React, { useState } from 'react';
import './auth.css';
import './Button.css';
import Button from './Button';
import { LuFilePlus2 } from "react-icons/lu";
import BackToLogin from './BackToLogin';
import { useNavigate } from 'react-router-dom';
import apis from '../utils/apis';
import toast from 'react-hot-toast';
import LoadingButton from './LoadingButton';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(apis().registerUser, {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      console.log(result);
      setLoading(false);

      if (response.ok && result.status) {
        toast.success(result.message || 'Registered successfully');
          if (result.role === 'admin') {
  localStorage.setItem('adminToken', result.token);
} else {
  // ✅ Use accessToken as the key
  localStorage.setItem('accessToken', result.token);
  
  if (result.user) {
    localStorage.setItem('user', JSON.stringify(result.user));
  }
  
  // Clean up old keys
  localStorage.removeItem('token');
  localStorage.removeItem('userToken');
}
        // if (result.role === 'admin') {
        //   localStorage.setItem('adminToken', result.token);
        // } else {
        //   localStorage.setItem('userToken', result.token);
        // }

        // if (result.user) {
        //   localStorage.setItem('token', result.token); // ✅ single key use karo
        //   localStorage.setItem('user', JSON.stringify(result.user));
        // }

        navigate('/');
      }

      else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error.message);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className='auth_main'>
      <form onSubmit={submitHandler}>
        <div className='auth_header'>
          <LuFilePlus2 size={24} color="#060918ff" />
          <div className='auth_texts'>
            <p className='auth_heading'>Welcome</p>
            <p className='auth_title'>Create a new account</p>
          </div>
        </div>

        <div className='auth_container'>
          <div className='auth_item'>
            <label>Name *</label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="Enter your name"
              className="ui_Input"
              autoComplete="name"
            />
          </div>

          <div className='auth_item'>
            <label>Email *</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Enter your email"
              className="ui_Input"
              autoComplete="email"
            />
          </div>

          <div className='auth_item'>
            <label>Password *</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Enter your password"
              className="ui_Input"
              autoComplete="new-password"
            />
          </div>

          <div className='auth_action'>
            <Button type="submit">
              <LoadingButton loading={loading} title="Register" />
            </Button>
            <div>
              <BackToLogin />
              <div></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;