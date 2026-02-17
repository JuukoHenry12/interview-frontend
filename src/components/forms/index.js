'use client'
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Link from 'next/link';

const BusinessSignupForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    about: "",
    location: "",
    officen_no: "",
    website: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors = {
      name: "",
      about: "",
      location: "",
      officen_no: "",
      website: "",
      email: "",
    };

    let isValid = true;

    if (!companyName.trim()) {
      newErrors.name = "Business Name is required.";
      isValid = false;
    }

    if (!about.trim()) {
      newErrors.about = "About field is required.";
      isValid = false;
    }

    if (!location.trim()) {
      newErrors.location = "Location is required.";
      isValid = false;
    }

    const phoneDigits = (phone || "").replace(/\D/g, "");
    if (!phoneDigits) {
      newErrors.officen_no = "Office Number is required.";
      isValid = false;
    } else if (!/^\d{7,15}$/.test(phoneDigits)) {
      newErrors.officen_no = "Office Number looks invalid.";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email format is invalid.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/business/`,
        {
          name: companyName,
          about: about,
          location: location,
          officen_no: phone.replace(/\D/g, ''),
          website: website,
          email: email,
        }
      );

      Swal.fire({
        title: 'Success!',
        text: 'Business registered successfully',
        icon: 'success',
        confirmButtonColor: "#C8187D",
      });

      // Reset form
      setCompanyName("");
      setAbout("");
      setLocation("");
      setPhone("");
      setWebsite("");
      setEmail("");
      setErrors({
        name: "",
        about: "",
        location: "",
        officen_no: "",
        website: "",
        email: "",
      });

      router.push('/');
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Submission failed',
        icon: 'error',
        confirmButtonColor: "#C8187D",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-lg mx-auto p-4 form" onSubmit={handleSubmit}>
      {/* Business Name */}
      <div className="mb-4">
        <label className="block uppercase text-gray-700 text-xs mb-2">Business Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => { setCompanyName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
          className={`w-full bg-gray-200 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-full py-3 px-4`}
          placeholder="Business Name"
        />
        {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
      </div>

      {/* About */}
      <div className="mb-4">
        <label className="block uppercase text-gray-700 text-xs mb-2">About</label>
        <textarea
          value={about}
          onChange={(e) => { setAbout(e.target.value); setErrors(prev => ({ ...prev, about: "" })); }}
          className={`w-full bg-gray-200 border ${errors.about ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3`}
          placeholder="Describe your business"
        />
        {errors.about && <p className="text-red-500 text-xs italic">{errors.about}</p>}
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block uppercase text-gray-700 text-xs mb-2">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => { setLocation(e.target.value); setErrors(prev => ({ ...prev, location: "" })); }}
          className={`w-full bg-gray-200 border ${errors.location ? 'border-red-500' : 'border-gray-200'} rounded-full py-3 px-4`}
          placeholder="Location"
        />
        {errors.location && <p className="text-red-500 text-xs italic">{errors.location}</p>}
      </div>

      {/* Office Number */}
      <div className="mb-4">
        <label className="block uppercase text-gray-700 text-xs mb-2">Office Number</label>
        <PhoneInput
          country="ug"
          value={phone}
          onChange={(value) => { setPhone(value); setErrors(prev => ({ ...prev, officen_no: "" })); }}
          containerClass="phone-input-container"
          buttonClass="phone-input-button"
          inputStyle={{
            width: "100%",
            backgroundColor: "#e5e7eb",
            color: "#374151",
            border: errors.officen_no ? "1px solid #ef4444" : "1px solid #e5e7eb",
            borderRadius: "9999px",
            padding: "0.75rem 1rem 0.75rem 3.5rem",
            lineHeight: "1.5",
            outline: "none",
            height: "48px",
            fontSize: "16px",
          }}
        />
        {errors.officen_no && <p className="text-red-500 text-xs italic">{errors.officen_no}</p>}
      </div>

      {/* Website */}
      <div className="mb-4">
        <label className="block uppercase text-gray-700 text-xs mb-2">Website (Optional)</label>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full bg-gray-200 border border-gray-200 rounded-full py-3 px-4"
          placeholder="https://example.com"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block uppercase text-gray-700 text-xs mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
          className={`w-full bg-gray-200 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-full py-3 px-4`}
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center w-full">
        <button
          type="submit"
          className="w-full text-white text-xl hover:bg-pink-800 mt-2 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-3 text-center transition-all duration-200 ease-in-out shadow-md"
          style={{ backgroundColor: '#C8187D' }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      <div className="flex items-center justify-center w-full mt-3">
        <Link href="/login" className="text-blue-700">Login</Link>
      </div>
    </form>
  );
};

export default BusinessSignupForm;
