import React, { useState } from 'react';
import profileImage from '../assets/img/lucu.jpg';

// Logo image imports
import logo1 from '../assets/img/poster1.png';
import logo2 from '../assets/img/poster2.png';
import logo3 from '../assets/img/poster3.png';


const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogos, setShowLogos] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 Tambahan di sini

  const [profile, setProfile] = useState({
    name: 'Daniel Budianto',
    email: 'budispeed@gmail.com',
    phone: '085780845220',
    password: '',
    address: 'Jl. Contoh No.123, Bandung, Indonesia',
    image: profileImage,
  });

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

  const logoOptions = [logo1, logo2, logo3];

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex justify-center items-center py-10 px-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 flex flex-col lg:flex-row gap-10">
        {/* Left: Avatar & Logo Picker */}
        <div className="flex flex-col items-center gap-8 w-full lg:w-1/3">
          <div className="relative">
            <img
              src={profile.image}
              alt="Profile"
              className="w-48 h-48 rounded-xl object-cover border-4 border-gray-200"
            />
            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
              <label htmlFor="image-upload" className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-4.553a1.5 1.5 0 112.121 2.121L17.121 12.12m-4.243 4.243L3 21l4.636-9.879m4.243-4.243l4.95 4.95M5 13l4 4" />
                </svg>
              </label>
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Logo Button & Picker */}
          <div className="w-full">
            <button
              onClick={() => setShowLogos(!showLogos)}
              className="w-full border-2 border-dashed border-indigo-300 rounded-xl py-6 text-sm font-medium text-indigo-500 hover:bg-indigo-50 transition"
            >
              Pilih Logo
            </button>
            {showLogos && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {logoOptions.map((logo, idx) => (
                  <img
                    key={idx}
                    src={logo}
                    alt={`Logo ${idx + 1}`}
                    onClick={() => {
                      setProfile({ ...profile, image: logo });
                      setShowLogos(false);
                    }}
                    className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:ring-2 hover:ring-indigo-500"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Profile Form */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">PROFILEKU</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">Nama</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-3 text-lg"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-800">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-3 text-lg"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-800">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">No.hp</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-3 text-lg"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-800">{profile.phone}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">Kata Sandi</label>
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
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.12.184-2.194.525-3.2m3.847 7.803a3 3 0 004.242-4.242m0 0a3 3 0 014.242 4.242m0 0a3 3 0 01-4.242-4.242m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <p className="mt-1 text-lg text-gray-800">********</p>
              )}
            </div>


            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">Alamat</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-4 py-3 text-lg"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-800">{profile.address}</p>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="flex gap-6 pt-6">
              <button
                onClick={handleSave}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition text-base"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition text-base"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition text-base"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
