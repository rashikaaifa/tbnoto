import React, { useState } from 'react';
import '../style/ProfilStyle.css';
import profileImage from '../assets/img/lucu.jpg';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Daniel Budianto',
    email: 'budispeed@gmail.com',
    phone: '085780845220',
    website: '',
    password: '********'
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saved profile:', profile);
  };

  return (
    <div className="profile-page">
      <div className="profile-card-modern">
        <div className="profile-header-modern">
        <img src={profileImage} alt="Profile" className="profile-avatar" />
        <div>
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
          </div>
          <button
            className={isEditing ? 'btn-save-modern' : 'btn-edit-modern'}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="profile-form-modern">
          <div className="form-group-modern">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group-modern">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group-modern">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group-modern">
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={profile.website}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group-modern">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
