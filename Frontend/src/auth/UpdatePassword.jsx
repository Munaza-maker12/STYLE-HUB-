 import React, { useState } from 'react';
import './auth.css';
import './Button.css';
import Button from './Button';
import { RxUpdate } from "react-icons/rx";
import BackToLogin from './BackToLogin';
import { useNavigate } from 'react-router-dom';
import apis from '../utils/apis';
import toast from 'react-hot-toast';
import LoadingButton from './LoadingButton';

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await fetch(apis().passwordUpdate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          confirmPassword,
          token: localStorage.getItem("passToken")
        })
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(result?.message || 'Something went wrong');
      }

      if (result?.status) {
        toast.success(result?.message || 'Password updated successfully');
        localStorage.removeItem('passToken');
        localStorage.removeItem('email');
        navigate('/Login');
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      localStorage.removeItem('passToken');
      localStorage.removeItem('email');
      navigate('/Login');
    }
  };

  return (
    <div className='auth_main'>
      <form onSubmit={submitHandler}>
        <div className='auth_header'>
          <RxUpdate size={24} color="#060918ff" />
          <p className='auth_heading'>Update Password</p>
          <p className='auth_title'>Enter at least 6-digit long password</p>
        </div>

       
        <div className='auth_container'>
          <div className='auth_item'>
            <label>Password *</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Enter your new password"
              className="ui_Input"
              autoComplete='new-password'
            />
          </div>

          <div className='auth_item'>
            <label>Confirm Password *</label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              placeholder="Confirm password"
              className="ui_Input"
              autoComplete='new-password'
            />
          </div>

          <div className='auth_action'>
            <Button type="submit">
              <LoadingButton loading={loading} title='Update Password' />
            </Button>
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;
