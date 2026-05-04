
// import React, { useEffect, useState } from 'react';
// import apis from '../utils/apis';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './AdminProfile.css';

// const AdminProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [showAvatarPage, setShowAvatarPage] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     avatar: '',
//   });

//   const [previewImage, setPreviewImage] = useState('');
//   const [uploadFile, setUploadFile] = useState(null);

//   const avatarOptions = [
//     "https://cdn-icons-png.flaticon.com/512/194/194938.png",
//     "https://cdn-icons-png.flaticon.com/512/194/194935.png",
//     "https://cdn-icons-png.flaticon.com/512/3006/3006878.png",
//     "https://cdn-icons-png.flaticon.com/512/1999/1999625.png",
//     "https://cdn-icons-png.flaticon.com/512/2922/2922506.png",
//     "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//     "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
//     "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
//     "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
//   ];

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const response = await fetch(apis().getAdminProfile, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (!response.ok) throw new Error('Failed to fetch profile');
//       const data = await response.json();
//       setProfile(data);
//       setFormData({
//         name: data.name || '',
//         email: data.email || '',
//         avatar: data.avatar || '',
//       });
//       setPreviewImage(data.avatar || '');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarSelect = url => {
//     setFormData(prev => ({ ...prev, avatar: url }));
//     setPreviewImage(url);
//     setShowAvatarPage(false);
//     setUploadFile(null);
//   };

//   const handleFileChange = e => {
//     const file = e.target.files[0];
//     if (file) {
//       setUploadFile(file);
//       setPreviewImage(URL.createObjectURL(file));
//       setFormData(prev => ({ ...prev, avatar: "" }));
//     }
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setUpdating(true);
//     try {
//       const token = localStorage.getItem('adminToken');
//       const submitData = new FormData();
//       submitData.append("name", formData.name);

//       if (uploadFile) {
//         submitData.append("avatar", uploadFile);
//       } else if (formData.avatar) {
//         submitData.append("avatar", formData.avatar);
//       }

//       const response = await fetch(apis().updateAdminProfile, {
//         method: 'PUT',
//         headers: { 'Authorization': `Bearer ${token}` },
//         body: submitData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update profile');
//       }

//       const result = await response.json();
//       setProfile(result.profile);
//       setIsEditing(false);
//       toast.success('Profile updated successfully!');
//     } catch (err) {
//       toast.error('Error: ' + err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const cancelEdit = () => {
//     setIsEditing(false);
//     setFormData({
//       name: profile.name || '',
//       email: profile.email || '',
//       avatar: profile.avatar || '',
//     });
//     setPreviewImage(profile.avatar || '');
//     setUploadFile(null);
//   };

//   if (loading) {
//     return (
//       <div className="admin-profile">
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="admin-profile">
//         <div className="error-container">
//           <div className="error-icon">⚠️</div>
//           <p>Error: {error}</p>
//           <button onClick={fetchProfile} className="retry-btn">Try Again</button>
//         </div>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="admin-profile">
//         <div className="error-container">
//           <div className="error-icon">📄</div>
//           <p>No profile data found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-profile">
//       <div className="profile-container">
//         <div className="profile-header">
//           <h1 className="profile-title">Admin Profile</h1>
//           <p className="profile-subtitle">Manage your account information</p>
//         </div>

//         {!isEditing && !showAvatarPage ? (
//           <div className="profile-view">
//             <div className="profile-avatar-section">
//               <div className="profile-avatar">
//                 {profile?.avatar ? (
//                   <img src={profile.avatar} alt="Admin Avatar" />
//                 ) : (
//                   <div className="avatar-placeholder">
//                     {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
//                   </div>
//                 )}
//               </div>
//               <h2 className="profile-name">{profile?.name || 'Admin'}</h2>
//               <span className="profile-role">Administrator</span>
//             </div>

//             <div className="profile-info">
//               <div className="info-grid">
//                 <div className="info-item">
//                   <span className="info-label">Full Name</span>
//                   <span className="info-value">{profile?.name || 'Not set'}</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Email Address</span>
//                   <span className="info-value">{profile?.email || 'Not set'}</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Role</span>
//                   <span className="info-value">
//                     <span className="role-badge">Admin</span>
//                   </span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Member Since</span>
//                   <span className="info-value">
//                     {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     }) : 'Unknown'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="profile-actions">
//               <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         ) : showAvatarPage ? (
//           <div className="avatar-selection-page">
//             <div className="avatar-header">
//               <button className="back-btn" onClick={() => setShowAvatarPage(false)}>
//                 ← Back
//               </button>
//               <h2>Choose Your Avatar</h2>
//               <p>Select from professional avatars</p>
//             </div>
            
//             <div className="avatar-grid">
//               {avatarOptions.map((url, index) => (
//                 <div
//                   key={url}
//                   className={`avatar-option ${formData.avatar === url ? 'selected' : ''}`}
//                   onClick={() => handleAvatarSelect(url)}
//                 >
//                   <img src={url} alt={`Avatar ${index + 1}`} />
//                   {formData.avatar === url && (
//                     <div className="selected-indicator">✓</div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="profile-edit-form">
//             <div className="form-header">
//               <button className="back-btn" onClick={cancelEdit}>
//                 ← Back
//               </button>
//               <h2>Edit Profile</h2>
//               <p>Update your information</p>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="form-avatar-section">
//                 <div className="current-avatar">
//                   {previewImage ? (
//                     <img src={previewImage} alt="Preview" />
//                   ) : (
//                     <div className="avatar-placeholder">
//                       {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="avatar-controls">
//                   <button
//                     type="button"
//                     className="choose-avatar-btn"
//                     onClick={() => setShowAvatarPage(true)}
//                   >
//                     Choose Avatar
//                   </button>
                  
//                   <div className="file-upload-wrapper">
//                     <input
//                       type="file"
//                       id="avatar-upload"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="file-input"
//                     />
//                     <label htmlFor="avatar-upload" className="upload-btn">
//                       Upload Image
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <div className="form-fields">
//                 <div className="field-group">
//                   <label className="field-label">Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="Enter your name"
//                     className="field-input"
//                     required
//                   />
//                 </div>

//                 <div className="field-group">
//                   <label className="field-label">Email Address</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     className="field-input disabled"
//                     readOnly
//                     placeholder="Email cannot be changed"
//                   />
//                   <small className="field-note">Email cannot be modified</small>
//                 </div>
//               </div>

//               <div className="form-actions">
//                 <button
//                   type="submit"
//                   className={`save-btn ${updating ? 'loading' : ''}`}
//                   disabled={updating}
//                 >
//                   {updating ? 'Saving...' : 'Save Changes'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={cancelEdit}
//                   className="cancel-btn"
//                   disabled={updating}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}
//       </div>
      
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </div>
//   );
// };

// export default AdminProfile;       


import React, { useEffect, useState } from 'react';
import apis from '../utils/apis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminProfile.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPage, setShowAvatarPage] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  const [previewImage, setPreviewImage] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  const avatarOptions = [
    "https://cdn-icons-png.flaticon.com/512/194/194938.png",
    "https://cdn-icons-png.flaticon.com/512/194/194935.png",
    "https://cdn-icons-png.flaticon.com/512/3006/3006878.png",
    "https://cdn-icons-png.flaticon.com/512/1999/1999625.png",
    "https://cdn-icons-png.flaticon.com/512/2922/2922506.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(apis().getAdminProfile, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        avatar: data.avatar || '',
      });
      setPreviewImage(data.avatar || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = url => {
    setFormData(prev => ({ ...prev, avatar: url }));
    setPreviewImage(url);
    setShowAvatarPage(false);
    setUploadFile(null);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, avatar: "" }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      const submitData = new FormData();
      submitData.append("name", formData.name);

      if (uploadFile) {
        submitData.append("avatar", uploadFile);
      } else if (formData.avatar) {
        submitData.append("avatar", formData.avatar);
      }

      const response = await fetch(apis().updateAdminProfile, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      setProfile(result.profile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };
const handleDeleteAccount = async () => {
  const confirmed = window.confirm(
    "Kya aap waqai apna account delete karna chahte hain? Yeh action undo nahi ho sakti."
  );
  if (!confirmed) return;

  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(apis().deleteAdminProfile, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to delete account');

    toast.success('Account deleted successfully!');
    localStorage.removeItem('adminToken');

    // Login page par redirect
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 2000);
  } catch (err) {
    toast.error('Error: ' + err.message);
  }
};
  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      avatar: profile.avatar || '',
    });
    setPreviewImage(profile.avatar || '');
    setUploadFile(null);
  };

  if (loading) {
    return (
      <div className="admin-profile">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-profile">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>Error: {error}</p>
          <button onClick={fetchProfile} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="admin-profile">
        <div className="error-container">
          <div className="error-icon">📄</div>
          <p>No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-profile">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Admin Profile</h1>
          <p className="profile-subtitle">Manage your account information</p>
        </div>

        {!isEditing && !showAvatarPage ? (
          <div className="profile-view">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Admin Avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
              </div>
              <h2 className="profile-name">{profile?.name || 'Admin'}</h2>
              <span className="profile-role">Administrator</span>
            </div>

            <div className="profile-info">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{profile?.name || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{profile?.email || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Role</span>
                  <span className="info-value">
                    <span className="role-badge">Admin</span>
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                Edit Profile
              </button>
              <button
    onClick={handleDeleteAccount}
    className="delete-account-btn"
    style={{
      background: "#dc2626",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginLeft: "10px",
    }}
  >
    Delete Account
  </button>
            </div>
          </div>
        ) : showAvatarPage ? (
          <div className="avatar-selection-page">
            <div className="avatar-header">
              <button className="back-btn" onClick={() => setShowAvatarPage(false)}>
                ← Back
              </button>
              <h2>Choose Your Avatar</h2>
              <p>Select from professional avatars</p>
            </div>
            
            <div className="avatar-grid">
              {avatarOptions.map((url, index) => (
                <div
                  key={url}
                  className={`avatar-option ${formData.avatar === url ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(url)}
                >
                  <img src={url} alt={`Avatar ${index + 1}`} />
                  {formData.avatar === url && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="profile-edit-form">
            <div className="form-header">
              <button className="back-btn" onClick={cancelEdit}>
                ← Back
              </button>
              <h2>Edit Profile</h2>
              <p>Update your information</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-avatar-section">
                <div className="current-avatar">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" />
                  ) : (
                    <div className="avatar-placeholder">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                </div>
                
                <div className="avatar-controls">
                  <button
                    type="button"
                    className="choose-avatar-btn"
                    onClick={() => setShowAvatarPage(true)}
                  >
                    Choose Avatar
                  </button>
                  
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <label htmlFor="avatar-upload" className="upload-btn">
                      Upload Image
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="field-input"
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="field-input disabled"
                    readOnly
                    placeholder="Email cannot be changed"
                  />
                  <small className="field-note">Email cannot be modified</small>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className={`save-btn ${updating ? 'loading' : ''}`}
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="cancel-btn"
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AdminProfile;