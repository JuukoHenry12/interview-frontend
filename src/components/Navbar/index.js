
'use client'
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); 
  const avatarRef = useRef(null);     

  const {data:session,status}=useSession()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown when clicking outside the avatar or dropdown
  const handleClickOutside = (e) => {
    if (
      avatarRef.current && !avatarRef.current.contains(e.target) &&  // Check if clicked outside avatar
      dropdownRef.current && !dropdownRef.current.contains(e.target)   // Check if clicked outside dropdown
    ) {
      setIsDropdownOpen(false);
    }
  };

  // Add event listener to handle clicks outside of the dropdown
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='flex items-center justify-between p-4 bg-white mb-4'>
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <Image src="/search.png" alt="" width={14} height={14} />
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>
      <div className='flex items-center gap-6 justify-end w-full'>
       
        <div className='flex flex-col'>
          <span className="text-xs text-black leading-3 font-medium">{session?.user?.name}</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <div className="relative">
          <Image
            src="/avatar.png"
            alt="User Avatar"
            width={36}
            height={36}
            className="rounded-full cursor-pointer"
            onClick={toggleDropdown}
            ref={avatarRef} 
          />
          {isDropdownOpen && (
            <div
              className="avatar-dropdown absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg"
              ref={dropdownRef} 
            >
              <a href='/'>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  onClick={() => {
                    console.log('Logged out');
                    setIsDropdownOpen(false); 
                  }}
                >
                  Logout
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
