 import React, { useState } from 'react';
import './Login.css';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { SlLogin } from "react-icons/sl";
import toast from 'react-hot-toast';
import apis from '../utils/apis';
import LoadingButton from './LoadingButton';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/UserSlice';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const emailChange = (e) => setEmail(e.target.value);
  const passwordChange = (e) => setPassword(e.target.value);


  const submitHandler = async (event) => {
    event.preventDefault();
    console.clear();
    console.log(" submitHandler TRIGGERED");
    console.log(" Sending payload:", { email, password });

    if (!email || !password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const apiUrl = apis().loginUser;
      console.log(" API Endpoint:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log(" Response status:", response.status, response.statusText);

      const rawText = await response.text();
      console.log(" Raw Response Text:", rawText);

      let result;
      try {
        result = JSON.parse(rawText);
      } catch (parseError) {
        console.error(" JSON Parse Error:", parseError);
        throw new Error("Invalid JSON from server");
      }

      console.log(" Parsed JSON:", result);

      if (!response.ok) {
        throw new Error(result?.message || "Login failed");
      }

      if (result?.status) {
        toast.success(result.message);
          if (result.role === 'admin') {
              localStorage.setItem('adminToken', result.token);
             navigate('/admin');
          } else {
              localStorage.setItem('accessToken', result.token);
localStorage.setItem('user', JSON.stringify(result.user));

// Clean up old keys
localStorage.removeItem('token');
localStorage.removeItem('userToken');

// ✅ Redux mein bhi set karo
dispatch(setUser(result.user));

navigate('/');
  // // ✅ Use accessToken as the key
  // localStorage.setItem('accessToken', result.token);
  // localStorage.setItem('user', JSON.stringify(result.user));
  
  // // Clean up old keys
  // localStorage.removeItem('token');
  // localStorage.removeItem('userToken');
  
  // navigate('/');
}
  
            }


      
      
       else {
        throw new Error(result?.message || "Login failed");
      }

    } catch (error) {
      console.error(" Error in submitHandler:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth_main'>
      <form onSubmit={submitHandler}>
        <div className='auth_container'>
          <div className='auth_header'>
            <SlLogin size={24} color="#060918ff" />
            <p className='auth_heading'>Welcome Back</p>
            <p className='auth_title'>Login to continue</p>
          </div>

          <div className='auth_item'>
            <label>Email *</label>
            <input
              type="email"
              autoComplete="off"
              value={email}
              onChange={emailChange}
              placeholder="enter your email"
              className="ui_Input"
              required
            />
          </div>

          <div className='auth_item'>
            <label>Password *</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={passwordChange}
              placeholder="enter your password"
              className="ui_Input"
              required
            />
          </div>

          <div className='auth_action'>
            <Button type="submit">
              <LoadingButton loading={loading} title="Login" />
            </Button>
            <div className='auth_option'>
              <Link to='/register'>Create new account?</Link>
              <Link to='/forget/password'>Forget password</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
