import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/img/lucu.jpg';
import { GoPencil } from "react-icons/go";
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { isLoggedIn, logout, user } = useAuth(); // Ambil data user dari context
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        address: user.address || '',
        // image: user.image || profileImage,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) return <p className="text-center mt-20">Memuat profil...</p>;

  // ... lanjutkan render profil seperti biasa ...


  return (
  <div className="min-h-screen flex flex-col items-center py-32 px-4">
    <div className="w-full max-w-6xl bg-white rounded-2xl p-8 flex flex-col lg:flex-row gap-10">

      {/* Left: Avatar & Logo Picker */}
      <div className="flex flex-col items-center gap-8 w-full lg:w-1/3">
        <h2 className="text-2xl font-semibold black-800 mb-8">PROFILE</h2>
        <div className="relative">
          <img
            src={profile.image}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border border-gray-300"
          />
          {isEditing && (
            <>
              <div className="absolute bottom-1 right-2">
                <label
                  htmlFor="image-upload"
                  className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
                  title="Edit Foto"
                >
                  <GoPencil className="w-5 h-5" />
                </label>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Right: Profile Form */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold black-600 mb-2">Nama</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-3 text-base"
              />
            ) : (
              <p className="mt-1 text-lg black-800">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-semibold black-600 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-3 text-base"
              />
            ) : (
              <p className="mt-1 text-lg black-800">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-semibold black-600 mb-2">Nomor Telepon</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-3 text-base"
              />
            ) : (
              <p className="mt-1 text-lg black-800">{profile.phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-lg font-semibold black-600 mb-2">Kata Sandi</label>
            {isEditing ? (
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={profile.password}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-3 text-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 black-500"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            ) : (
              <p className="mt-1 text-lg black-800">********</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-lg font-semibold black-600 mb-2">Alamat</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-3 text-lg"
              />
            ) : (
              <p className="mt-1 text-lg black-800">{profile.address}</p>
            )}
          </div>
        </div>

        {/* Tombol Simpan / Edit / Logout */}
        <div className="flex gap-6 pt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium transition text-base"
              >
                Simpan
              </button>
              <button
                onClick={handleCancel}
                className="border border-primary text-primary px-8 py-3 rounded-lg font-medium transition text-base"
              >
                Batal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition text-base"
              >
                Edit Profile
              </button>

              {isLoggedIn && (
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="bg-red-700 text-white px-8 py-3 rounded-lg transition text-base"
                >
                  Keluar
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

};

export default ProfilePage;
