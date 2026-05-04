import React from 'react';
 import './FAQ.css';
 import { useNavigate } from 'react-router-dom'; 
 const Faq = () => {
   const navigate = useNavigate();
   return ( <div>
    <button onClick={() => navigate(-1)} className="back-button">← Back</button>
  
     <div className="faq-container">
      
       <h1 className="faq-heading">Frequently Asked Questions</h1>
       <div className="faq-list">
 
         <div className="faq-item">
           <h3>What is StyleHub?</h3>
           <p>StyleHub is an online fashion platform that helps you find trendy outfits with custom fit recommendations based on your body measurements.</p>
         </div>
 
         <div className="faq-item">
           <h3>How does size recommendation work?</h3>
           <p>When you enter your body measurements, our system suggests the closest matching standard size or lets you create a custom fit for better comfort and style.</p>
         </div>
 
         <div className="faq-item">
           <h3>Can I order custom-sized clothing?</h3>
           <p>Yes! StyleHub allows you to create custom sizes for select items, especially formalwear like suits and kurtas, so your outfit fits perfectly.</p>
         </div>
 
         <div className="faq-item">
           <h3>Do you offer international shipping?</h3>
           <p>Currently, we deliver across major cities in Pakistan. International shipping is coming soon!</p>
         </div>
 
         <div className="faq-item">
           <h3>How can I contact customer support?</h3>
           <p>You can reach us through our Contact Us page or email us at support@stylehub.com. We're here to help!</p>
         </div>
 
       </div>
     </div>
     </div>
   );
 };
 
 export default Faq;