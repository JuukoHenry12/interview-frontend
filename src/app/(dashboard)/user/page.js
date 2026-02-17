'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSession } from "next-auth/react";

const Pages = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Viewer',
    phone_number: ''
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();

  const API_URL = 'http://127.0.0.1:8000/api/users/';

  // Axios instance with Bearer token
  const axiosInstance = axios.create({
    headers: {
      Authorization: session ? `Bearer ${session.user.authToken}` : '',
      'Content-Type': 'application/json',
    },
  });

  // Fetch users
  const fetchUsers = async () => {
    if (!session) return;
    try {
      const res = await axiosInstance.get(API_URL);
      setUsers(res.data.results || res.data); // handle pagination or plain list
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    }
  };

  // Fetch users when session is ready
  useEffect(() => {
    if (status === 'authenticated') fetchUsers();
  }, [status, session]);

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open Add Modal
  const openAddModal = () => {
    setForm({
      username: '',
      email: '',
      password: '',
      role: 'Viewer',
      phone_number: ''
    });
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setForm({
      username: user.username,
      email: user.email,
      password: '', // password not editable
      role: user.role,
      phone_number: user.phone_number || ''
    });
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  // Submit Add/Edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || (!editingUserId && !form.password)) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    const payload = {
      username: form.username,
      email: form.email,
      role: form.role,
      phone_number: form.phone_number,
      business: session.user.business_id 
    };

    console.log(payload)

    if (!editingUserId) payload.password = form.password; 

    try {
      if (editingUserId) {
        await axiosInstance.put(`${API_URL}${editingUserId}/`, payload);
        Swal.fire('Success', 'User updated successfully', 'success');
      } else {
        await axiosInstance.post(API_URL, payload);
        Swal.fire('Success', 'User added successfully', 'success');
      }
      setForm({
        username: '',
        email: '',
        password: '',
        role: 'Viewer',
        phone_number: ''
      });
      setEditingUserId(null);
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to save user', 'error');
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`${API_URL}${userId}/`);
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          fetchUsers();
        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'Failed to delete user', 'error');
        }
      }
    });
  };

  // Loading and unauthenticated states
  if (status === 'loading') return <div>Loading session...</div>;
  if (status === 'unauthenticated') return <div>Please login to access users</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <button
        onClick={openAddModal}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add User
      </button>

      {/* Users Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">{user.phone_number}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="bg-yellow-400 px-2 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingUserId ? 'Edit User' : 'Add User'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              {!editingUserId && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              )}
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Approver">Approver</option>
                <option value="Viewer">Viewer</option>
              </select>
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={form.phone_number}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  {editingUserId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pages;
