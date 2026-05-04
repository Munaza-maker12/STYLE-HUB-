import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apis from '../utils/apis';
import toast from 'react-hot-toast';
import Button from './Button';
import LoadingButton from './LoadingButton';
import BackToLogin from './BackToLogin';
const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Forget Password Submit Triggered");

    try {
      setLoading(true);

      const response = await fetch(apis().forgetPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) throw new Error(result?.message || 'Request failed');

      if (result?.status) {
        toast.success(result.message);
        console.log("✅ Email sent:", result);
      }
        // ✅ Save correct token
        if (result.token) {
          localStorage.setItem('passToken', result.token); // ✅ This is now correct

        localStorage.setItem('email',email)


        navigate('/VerifyOTP'); // ✅ Go to OTP screen
      }
    
    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <div className='auth_main'>
      <form onSubmit={handleSubmit}>
        <div className='auth_container'>
          <div className='auth_header'>
            <p className='auth_heading'>Forget Password</p>
            <p className='auth_title'>Enter your email</p>
          </div>

          <div className='auth_item'>
            <label>Email *</label>
            <input
              type="email"
              className="ui_Input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='auth_action'>
            <Button type="submit">
              <LoadingButton loading={loading} title="Send OTP" />
            </Button>
            {/* <div className='auth_option'>
              <Link to="/login">Back to login</Link>
            </div> */}
            
              <BackToLogin/>
          
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;