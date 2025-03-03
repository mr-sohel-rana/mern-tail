import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CategoryName = () => {
    const { name } = useParams(); // Access category name from the URL params
    const [categories, setCategory] = useState([]);

    useEffect(() => {
        const categoryByName = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/v1/category/${name}`);
                if (res.data.status === 'success') {
                    setCategory(res.data.products);
                } else {
                    alert(res.data.message);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                alert('Something went wrong!');
            }
        };
        categoryByName();
    }, [name]);  
    console.log(categories)

    return (
        <div>
            <h1>Products in Category: {name}</h1>
            <div className="products">
                {categories.length > 0 ? (
                    categories.map((product) => (
                        <div key={product._id} className="product-item">
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>${product.price}</p>
                        </div>
                    ))
                ) : (
                    <p>No products found in this category.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryName;
