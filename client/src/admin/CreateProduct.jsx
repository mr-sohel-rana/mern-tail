import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Upload, Button, Modal, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    shipping: false,
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

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

  useEffect(() => {
    allCategory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const updatedImages = newFileList.map((file) => file.originFileObj || file);
    setFormData({ ...formData, images: updatedImages });
  };

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewOpen(true);
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, description, price, category, quantity, images } = formData;
    if (!name || !description || !price || !category || !quantity) {
      toast.error('All fields are required!');
      setIsLoading(false);
      return;
    }

    if (price <= 0 || quantity <= 0) {
      toast.error('Price and quantity must be positive numbers.');
      setIsLoading(false);
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image.');
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('description', description);
    formDataToSend.append('price', price);
    formDataToSend.append('category', category);
    formDataToSend.append('quantity', quantity);
    formDataToSend.append('shipping', formData.shipping);

    images.forEach((image, index) => {
      if (image) {
        formDataToSend.append(`photo${index + 1}`, image);
      }
    });

    try {
      const response = await axios.post('http://localhost:5001/api/v1/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        toast.success('Product Created Successfully');
        navigate('/dashboard/admin/products');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error creating product:', error.response || error);
      toast.error('Something went wrong! Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="container mt-20 mx-auto mt-8 p-4">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create Product</h2>
          <form onSubmit={submitHandle}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-lg font-medium text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category</label>
              <select
                id="category"
                name="category"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="quantity" className="block text-lg font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Shipping</label>
              <input
                type="checkbox"
                name="shipping"
                className="mr-2"
                checked={formData.shipping}
                onChange={handleInputChange}
              />
              <span className="text-gray-700">Include shipping</span>
            </div>

            <div className="mb-6">
              <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" 
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleImageChange}
                multiple
                maxCount={5}
              >
                {fileList.length >= 5 ? null : <Button icon={<UploadOutlined />}>Upload Images</Button>}
              </Upload>
              <Modal
                open={previewOpen}
                title="Image Preview"
                footer={null}
                onCancel={() => setPreviewOpen(false)}
              >
                <Image alt="preview" src={previewImage} style={{ width: '100%' }} />
              </Modal>
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default CreateProduct;
