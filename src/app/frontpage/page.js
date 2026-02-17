'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link'
import ChatUI from '@/components/chat';
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

   const fetchProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/public-products/');
    console.log("testing",response.data.results)
    setProducts(response.data.results);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
    <main>
      
      <nav className="flex justify-end gap-6 mb-6 bg-white p-4 rounded shadow">
        <li className="list-none hover:text-blue-600 cursor-pointer">
          <Link href="/">Home</Link>
        </li>
        <li className="list-none hover:text-blue-600 cursor-pointer">
          <Link href="/login">Login</Link>
        </li>
      </nav>

    <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>

    {products.length === 0 ? (
      <p className="text-gray-600">No products found.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-800 font-medium mb-1">
                Price: <span className="text-green-600">${product.price}</span>
              </p>
              <p className="text-gray-800 mb-1">
                Status: <span className="capitalize">{product.status}</span>
              </p>
              {product.category && (
                <p className="text-gray-800">
                  Category: {product.category.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </main>
  <div>
     <ChatUI/>
  </div>
</div>

  );
};

export default ProductsPage;
