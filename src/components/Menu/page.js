'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { FaHome, FaTools} from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { FiMenu, FiX, FiLogOut} from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import { FaPersonCircleCheck } from "react-icons/fa6"; 

const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: <FaTools />, label: "Products", href: "/products", visible: ["admin"] },
      
      { icon: <FaPersonCircleCheck />, label: "Users", href: "/user", visible: ["admin"] },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [logoUrl, setLogoUrl] = useState('/profile3.png');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.logo) {
      setLogoUrl(
        session.user.logo.startsWith('http')
          ? session.user.logo
          : `${process.env.BASE_URL}/${session.user.logo}`
      );
    }
  }, [session, status]);

  const handleLogout = () => {
    setIsMobileOpen(false);
    signOut({ callbackUrl: '/' });
  };

  const renderMenu = () => (
    <>
      

      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              const isActive = pathname.split('/')[1] === item.href.split('/')[1];
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-center lg:justify-start gap-4 py-2 md:px-2 rounded-md hover:bg-lamablue hover:text-white
                    ${isActive ? 'bg-lamablue text-white' : 'text-gray-500'}`}
                >
                  <span className={`text-lg ${isActive ? 'text-white' : 'text-black'} hover:text-white`}>
                    {item.icon}
                  </span>
                  <span className="hidden lg:block text-base">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block mt-4 text-sm">
        {renderMenu()}
      </div>

      {/* Mobile Header — Hamburger Left, Logo Right */}
      <div className="flex lg:hidden justify-between items-center p-3 bg-gray-100 shadow-md fixed top-0 left-0 w-full z-30">
        {/* Hamburger Left */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-3xl z-40 flex-none"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? <FiX /> : <FiMenu />}
        </button>

      
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="text-2xl"
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          {renderMenu()}

          {/* Logout Button */}
          <div className="mt-10 border-t border-gray-300 pt-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-500 hover:text-red-600 font-medium"
            >
              <FiLogOut className="text-2xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
