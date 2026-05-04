import React, { useRef, useEffect, useState } from 'react';
import { PiFingerprintLight } from "react-icons/pi";
import './VerifyOTP.css';
import Button from './Button';
import BackToLogin from './BackToLogin';
import Timer from './Timer';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apis from '../utils/apis';
import LoadingButton from './LoadingButton';

const VerifyOTP = () => {
  const refs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(null);
  const navigate = useNavigate();
  const [IsExpire, setIsExpire] = useState(false);

  const handleInput = (e, index) => {
    let value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) value = value.slice(0, 1);

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    const finalOTP = otp.join('').trim();

    if (finalOTP.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('passToken');
      if (!token) {
        throw new Error("No OTP token found");
      }

      const response = await fetch(apis().verifyOTP, {
        method: 'POST',
        body: JSON.stringify({ otp: finalOTP, token }),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(result?.message || 'Verification failed');
      }

      if (result?.status) {
        toast.success('✅ OTP Verified Successfully');
        setOtpTimer(result?.sendTime); 
        navigate("/Updatepassword");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || '❌ OTP Verification failed');
    }
  };

  useEffect(() => {
    const getTime = async () => {
      try {
        const token = localStorage.getItem('passToken');
        if (!token) throw new Error('No OTP token found');

        const response = await fetch(apis().getOTPTime, {
          method: 'POST',
          body: JSON.stringify({ token }),
          headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result?.message || 'Failed to fetch OTP time');

        if (result?.status) {
          const remainingTime = new Date(result?.sendTime).getTime() - new Date().getTime();
          if (remainingTime > 0) {
            setOtpTimer(result.sendTime);
          } else {
            setIsExpire(true);
          }
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch OTP time');
      }
    };

    getTime();
  }, []);

  const resendHandler = async () => {
    try {
      const response = await fetch(apis().forgetPassword, {
        method: 'POST',
        body: JSON.stringify({ email: localStorage.getItem('email') }),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message);

      if (result?.status) {
        toast.success(result?.message);
        localStorage.setItem('passToken', result?.token);


        setOtpTimer(new Date(Date.now() + 60000).toISOString());
        setIsExpire(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='auth_main'>
      <form onSubmit={submitHandler} autoComplete="off">
        <div className='auth_container'>
          <div className='auth_header'>
            <PiFingerprintLight size={24} color="#060918ff" />
            <p className='auth_heading'>Verify Your OTP</p>
            <p className='auth_title'>Enter the 6-digit OTP sent to your email</p>
          </div>

          <div className='auth_item'>
            <label>OTP *</label>
            <div className='otp_input_container'>
              {otp.map((digit, index) => (
                <input
                  required
                  key={index}
                  ref={(el) => (refs.current[index] = el)}
                  type='text'
                  maxLength={1}
                  name={`otp_${index}`}
                  autoComplete="off"
                  className='ui_input otp-input'
                  value={digit}
                  onChange={(e) => handleInput(e, index)}
                />
              ))}
            </div>
          </div>

          <div className='auth_action'>
            <Button type='submit'>
              <LoadingButton loading={loading} title="Verify OTP" />
            </Button>
          </div>

          <div>
            {otpTimer !== null && !IsExpire ? (
              <Timer setIsExpire={setIsExpire} time={otpTimer} />
            ) : (
              <span onClick={resendHandler} className='otp_resend_action'>Resend</span>
            )}
          </div>

          <div>
            <BackToLogin />
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyOTP;
