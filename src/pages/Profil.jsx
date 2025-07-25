import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/img/lucu.jpg';
import { GoPencil } from "react-icons/go";
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { isLoggedIn, logout, user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        address: user.address || '',
      });
      setImagePreview(user.profile_photo || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Tambahkan upload ke server jika ingin upload foto profil
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password || undefined,
      };

      await updateProfile(profileData);
      setIsEditing(false);
      console.log('Data berhasil disimpan ke server');
    } catch (error) {
      console.error('Gagal update profil:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        address: user.address || '',
      });
      setImagePreview(user.profile_photo || null);
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-32 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl p-8 flex flex-col lg:flex-row gap-10">
        
        {/* Foto profil */}
        <div className="flex flex-col items-center gap-8 w-full lg:w-1/3">
          <h2 className="text-2xl font-semibold black-800 mb-8">PROFILE</h2>
          <div className="relative">
            <img
              src={imagePreview || profileImage}
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

        {/* Formulir profil */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Nama", name: "name" },
              { label: "Email", name: "email" },
              { label: "Nomor Telepon", name: "phone" },
              { label: "Kata Sandi", name: "password", isPassword: true },
              { label: "Alamat", name: "address" },
            ].map((field, idx) => (
              <div key={idx} className={field.name === "name" || field.name === "address" || field.name === "password" ? "md:col-span-2" : ""}>
                <label className="block text-lg font-semibold black-600 mb-2">{field.label}</label>
                {isEditing ? (
                  field.isPassword ? (
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name={field.name}
                        value={formData[field.name]}
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
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="mt-1 w-full border rounded-lg px-4 py-3 text-base"
                    />
                  )
                ) : (
                  <p className="mt-1 text-lg black-800">{field.isPassword ? '********' : formData[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Tombol aksi */}
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