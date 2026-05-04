
import React, { useEffect } from 'react';
import './termsandcondition.css';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-container">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      <h1>Terms and Conditions</h1>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing this website, you agree to comply with and be bound by these terms. Do not continue to use StyleHub if you do not agree with all of the terms and conditions stated on this page.</p>
      </section>

      <section>
        <h2>2. User Responsibilities</h2>
        <ul>
          <li>Provide accurate and complete information.</li>
          <li>Do not misuse or attempt to hack the website.</li>
          <li>Respect other users and our community guidelines.</li>
        </ul>
      </section>

      <section>
        <h2>3. Intellectual Property</h2>
        <p>All content on StyleHub, including text, images, logos, and designs, is the property of StyleHub and protected by copyright laws.</p>
      </section>

      <section>
        <h2>4. Order Policy</h2>
        <p>All orders placed are subject to availability and confirmation. StyleHub reserves the right to refuse or cancel any order at our discretion.</p>
      </section>

      <section>
        <h2>5. Liability Limitation</h2>
        <p>We are not liable for any direct or indirect damages arising from the use of our website or products.</p>
      </section>

      <section>
        <h2>6. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the website will signify your acceptance of the updated terms.</p>
      </section>

      <section>
        <h2>Product Notes</h2>
        <p>• Product color may vary slightly due to photographic lighting sources or monitor settings.</p>
        <p>• All measurements are in inches with slight tolerance.</p>
      </section>

      <p className="last-updated">Last Updated: September 2025</p>
    </div>
  );
};

export default TermsAndConditions;
