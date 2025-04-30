import React, { useState } from 'react';
import '../style/ProfilStyle.css';

const Profil = () => {
  const [profile, setProfile] = useState({
    name: 'Daniel Budianto',
    email: 'budispeed@gmail.com',
    phone: '085780845220',
    website: '',
    password: '********'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Simpan data ke backend di sini kalau sudah connect API
    console.log('Saved profile:', profile);
  };

  return (
    <div className="account-container">
      <div className="account-card">
        <h2>Account Setting</h2>

        <div className="tabs">
          <button className="active-tab">PROFILE</button>
          <button>VACANCIES</button>
        </div>

        <div className="profile-content">
          <div className="profile-image-section">
            <img src="/src/assets/lucu.jpg" alt="Profile" />
            <button className="change-btn">CHANGE</button>
          </div>

          <div className="profile-fields">
            <label>
              NAME
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>
            <label>
              EMAIL
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>
            <label>
              PHONE
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>
            <label>
              WEBSITE
              <input
                type="text"
                name="website"
                value={profile.website}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>
            <label>
              PASSWORD
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </label>

            <div className="button-group">
              {!isEditing ? (
                <button className="edit-btn" onClick={handleEditToggle}>EDIT</button>
              ) : (
                <button className="save-btn" onClick={handleSave}>SAVE</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;