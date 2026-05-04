import React, { useEffect, useState } from 'react';

const Timer = ({ setIsExpire, time }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const endTime = new Date(time).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.floor((endTime - now) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);
        setSeconds(0);
        setIsExpire(true);
      } else {
        setSeconds(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time, setIsExpire]);

  return (
    <p style={{ textAlign: 'center', color: 'black', marginTop: '10px' }}>
      Resend OTP in {seconds}s
    </p>
  );
};

export default Timer;
