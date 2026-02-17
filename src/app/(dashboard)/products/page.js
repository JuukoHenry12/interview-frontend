'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/private.js";
import Pagination from "@/components/Table/index.js";
import Table from "@/components/Table/index.js";
import Swal from "sweetalert2";

const columns = [
  { header: "Image", accessor: "image" },
  { header: "Name", accessor: "name" },
  { header: "Description", accessor: "description", className: "hidden md:table-cell" },
  { header: "Price", accessor: "price", className: "hidden md:table-cell" },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  { header: "Category", accessor: "category", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ProductList = () => {
  const { data: session } = useSession();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    status: "draft",
    category: "",
    image: null,
  });


  const fetchProducts = async () => {
    if (!session) return;
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/products/", {
        headers: {
          Authorization: `Bearer ${session.user.authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      const productsArray = Array.isArray(data) ? data : data.results || [];
      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [session]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      status: "draft",
      category: "",
      image: null,
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const url = isEditing
        ? `http://127.0.0.1:8000/api/products/${currentId}/`
        : "http://127.0.0.1:8000/api/products/";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session.user.authToken}`,
        },
        body: data,
      });

      if (!res.ok) throw new Error("Failed to save product");

      Swal.fire(
        "Success",
        isEditing ? "Product updated successfully" : "Product added successfully",
        "success"
      );

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      status: product.status || "draft",
      category: product.category || "",
      image: null,
    });

    setCurrentId(product.id);
    setIsEditing(true);
    setShowModal(true);
  };


  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the product permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.authToken}`,
        },
      });

      Swal.fire("Deleted!", "Product has been deleted.", "success");
      fetchProducts();
    } catch (err) {
      Swal.fire("Error", "Failed to delete product", "error");
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (!term) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) =>
      Object.values(product).some(
        (val) =>
          val &&
          (typeof val === "string" || typeof val === "number") &&
          val.toString().toLowerCase().includes(term.toLowerCase())
      )
    );

    setFilteredProducts(filtered);
  };


  const renderStatus = (status) => {
    switch (status) {
      case "draft": return "bg-gray-400 text-white";
      case "pending": return "bg-yellow-500 text-white";
      case "approved": return "bg-green-500 text-white";
      default: return "bg-transparent text-black";
    }
  };

  const renderRow = (product) => (
    <tr key={product.id} className="border-b even:bg-slate-50 text-sm hover:bg-gray-100">
      <td className="p-2 flex justify-center">
        {product.image ? (
          <Image src={product.image} alt={product.name} width={50} height={50} className="rounded" />
        ) : <span className="text-gray-400">No Image</span>}
      </td>
      <td>{product.name}</td>
      <td className="hidden md:table-cell">{product.description}</td>
      <td className="hidden md:table-cell">${product.price}</td>
      <td className="hidden md:table-cell">
        <span className={`px-2 py-1 rounded-full ${renderStatus(product.status)}`}>
          {product.status}
        </span>
      </td>
      <td className="hidden lg:table-cell">{product.category || "-"}</td>
      <td className="flex justify-center gap-2">
        <Link href={`/products/${product.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-white">
            <FaEye />
          </button>
        </Link>

        <button
          onClick={() => handleEdit(product)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-yellow-500 text-white"
        >
          <FaEdit />
        </button>

        <button
          onClick={() => handleDelete(product.id)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <ProtectedRoute>
      <div className="bg-white p-4 rounded-md flex-1 m-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Product Management</h1>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="border p-2 rounded w-[200px]"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Product
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center py-10">No products found.</p>
        ) : (
          <>
            <Table columns={columns} data={filteredProducts} renderRow={renderRow} />
            <Pagination />
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Product Name" className="w-full border p-2 rounded" value={formData.name} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" value={formData.description} onChange={handleChange} />
              <input type="number" name="price" placeholder="Price" className="w-full border p-2 rounded" value={formData.price} onChange={handleChange} required />
              <select name="status" className="w-full border p-2 rounded" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
              <input type="text" name="category" placeholder="Category" className="w-full border p-2 rounded" value={formData.category} onChange={handleChange} />
              <input type="file" name="image" className="w-full border p-2 rounded" onChange={handleChange} />

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 bg-gray-400 text-white rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  {isEditing ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default ProductList;
