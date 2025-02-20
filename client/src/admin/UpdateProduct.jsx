import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminMenu from './AdminMenu';

const UpdataProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    shipping: false,
    photos: [],
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/v1/single-product/${id}`);
      if (data.status === 'success') {
        setProduct({
          ...data.product,
          shipping: data.product.shipping || false,
          photos: data.product.photos || [],
        });
      } else {
        toast.error('Failed to load product');
      }
    } catch (error) {
      toast.error('Error fetching product details');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/v1/allcategory');
      if (data.status === 'success') {
        setCategories(data.allCategory);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e, index) => {
    const newPhotos = [...product.photos];
    const newFile = e.target.files[0];
    
    // Ensure the selected file is valid before updating the state
    if (newFile) {
      newPhotos[index] = newFile;
    }

    setProduct({ ...product, photos: newPhotos });
  };

  const handleImageRemove = (index) => {
    const newPhotos = product.photos.filter((_, i) => i !== index);
    setProduct({ ...product, photos: newPhotos });
    deleteImageFromServer(product.photos[index]);
  };

  const deleteImageFromServer = async (imageName) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/v1/delete-image`, {
        data: { imageName },
      });
      if (response.data.status === 'success') {
        toast.success('Image deleted successfully');
      } else {
        toast.error('Failed to delete image from server');
      }
    } catch (error) {
      toast.error('Error deleting image');
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('quantity', product.quantity);
    formData.append('shipping', product.shipping);

    product.photos.forEach((photo, index) => {
      if (photo) {
        formData.append(`photo${index + 1}`, photo);
      }
    });

    try {
      const response = await axios.put(`http://localhost:5001/api/v1/product-update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status === 'success') {
        toast.success('Product updated successfully');
        navigate('/dashboard/admin/products');
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('Error updating product');
    }
    setIsLoading(false);
  };

  const deleteProduct = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`http://localhost:5001/api/v1/product-delete/${id}`);
        if (response.data.status === 'success') {
          toast.success('Product deleted successfully');
          navigate('/dashboard/admin/products');
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  const getImagePreview = (photo) => {
    if (photo instanceof File) {
      return URL.createObjectURL(photo);  // For newly uploaded files
    }
    return `http://localhost:5001/uploads/${photo}`;  // For already uploaded images
  };

  return (
    <Layout>
      <div className="flex">
        <div>
          <AdminMenu />
        </div>
        <div className="container mx-auto mt-4 p-4 max-w-4xl bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-2xl font-semibold mb-6">Edit Product</h2>
          <form onSubmit={updateProduct} className="space-y-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="mt-2 p-2 w-full border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows="4"
                className="mt-2 p-2 w-full border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className="mt-2 p-2 w-full border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium">Category</label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="mt-2 p-2 w-full border rounded-md"
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
              <label htmlFor="quantity" className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleInputChange}
                className="mt-2 p-2 w-full border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="shipping" className="block text-sm font-medium">Shipping</label>
              <input
                type="checkbox"
                id="shipping"
                name="shipping"
                checked={product.shipping}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Images</label>
              <div className="flex flex-wrap gap-2">
                {product.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={getImagePreview(photo)}
                      alt={`Product ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={() => handleImageRemove(index)}
                    >
                      X
                    </button>
                    <input
                      type="file"
                      className="mt-2 w-full"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </div>
                ))}
                {product.photos.length < 5 && (
                  <div className="mt-2">
                    <input
                      type="file"
                      className="w-full"
                      onChange={(e) => handleImageChange(e, product.photos.length)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Product'}
              </button>

              <button
                type="button"
                onClick={deleteProduct}
                className="w-full bg-red-500 text-white p-2 rounded-md"
              >
                Delete Product
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default UpdataProduct;
