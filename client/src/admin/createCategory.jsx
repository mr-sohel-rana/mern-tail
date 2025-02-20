import React, { useState, useEffect } from 'react';
import AdminMenus from './AdminMenu';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(''); // Store existing image URL
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const allCategory = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/v1/allcategory');
        if (data.status === 'success') {
          setCategories(data.allCategory || []);
          toast.success('Categories Fetched Successfully');
        } else {
          toast.error(data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        toast.error('Something went wrong!');
        setCategories([]);
      }
    };
    allCategory();
  }, []);

  const submitHandle = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('categoryName', name);
    if (photo) formData.append('categoryPhoto', photo);

    try {
      let response;
      if (editId) {
        response = await axios.put(`http://localhost:5001/api/v1/update-category/${editId}`, formData);
        toast.success('Category Updated Successfully');
      } else {
        response = await axios.post('http://localhost:5001/api/v1/create-category', formData);
        toast.success('Category Created Successfully');
      }

      if (response.data.status === 'success') {
        setName('');
        setPhoto(null);
        setPhotoURL('');
        setEditId(null);
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async (cat) => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/delete-category/${cat._id}`);
      toast.success('Category Deleted Successfully');
      setCategories(categories.filter((c) => c._id !== cat._id));
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleEdit = (cat) => {
    setName(cat.categoryName);
    setEditId(cat._id);
    setPhoto(null); // Reset uploaded file
    setPhotoURL(`http://localhost:5001/api/v1/categoryimage/${cat._id}`); // Set existing photo URL
  };

  return (
    <Layout>
      <div className="flex mt-20 min-h-screen bg-gray-100">
        <div className="w-1/4 bg-white p-4 shadow-md">
          <AdminMenus />
        </div>

        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-center mb-6">{editId ? 'Edit Category' : 'Create Category'}</h1>
          <form onSubmit={submitHandle} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-3"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* File Upload */}
            <label className="block bg-blue-600 text-white text-center py-2 px-4 rounded-lg cursor-pointer">
              {photo ? photo.name : 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setPhoto(e.target.files[0]);
                  setPhotoURL(''); // Remove existing image when uploading new one
                }}
              />
            </label>

            {/* Show selected or existing image */}
            {(photo || photoURL) && (
              <div className="text-center mt-3">
                <img
                  src={photo ? URL.createObjectURL(photo) : photoURL}
                  alt="Selected"
                  className="w-24 h-24 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  className="text-red-500 mt-2 text-sm"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoURL('');
                  }}
                >
                  Remove Photo
                </button>
              </div>
            )}

            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600">
              {editId ? 'Update' : 'Submit'}
            </button>
          </form>

          <h2 className="text-xl font-semibold text-center mt-6">All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div key={cat._id} className="bg-white p-4 shadow-md rounded-lg flex flex-col items-center">
                  <img
                    src={`http://localhost:5001/api/v1/categoryimage/${cat._id}`}
                    alt={cat.categoryName}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                  <p className="mt-2 font-medium">{cat.categoryName}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm" onClick={() => handleDelete(cat)}>
                      Delete
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm" onClick={() => handleEdit(cat)}>
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-600">No categories found.</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default CreateCategory;
