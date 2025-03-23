import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { ChartPie, FolderClosed, User, NotebookTabs, Contact, Handshake, LogOut, PanelsTopLeft, Menu, Bot } from "lucide-react";
import AdminProfile from "./account/AdminProfile";

export default function HomeNavbar() {
  const [profilePicture, setProfilePicture] = useState('/default-profile.jpg');
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null); // Reference for mobile menu
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSignOutClick = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");

    // Force re-render of other components listening to storage events
    window.dispatchEvent(new Event("storage"));

    // Navigate to login and reset state
    setIsDropdownOpen(false);
    setModalOpen(false);
    setIsMobileMenuOpen(false);
    
    // Use replace to prevent going back to protected routes
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { name: "Overview", icon: <ChartPie className="h-5 w-5" />, path: "/overview" },
    { name: "HTEs", icon: <NotebookTabs className="h-5 w-5" />, path: "/hte" },
    { name: "OJT Coordinators", icon: <Contact className="h-5 w-5" />, path: "/OJT-coordinators" },
    { name: "Industry Partners", icon: <Handshake className="h-5 w-5" />, path: "/industry-partners" },
    { name: "The Developer", icon: <Bot className="h-5 w-5" />, path: "/about-the-developer" }
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };




  useEffect(() => {
    const fetchUserName = async () => {
      const userId = localStorage.getItem("user_id"); // Get the user ID from local storage
      
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3001/api/auth/userDetails/${userId}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
  
          const userData = await response.json();
          setUserName(userData.name); 
          if (userData.profilePicture) {
            setProfilePicture(`http://localhost:3001${userData.profilePicture}`);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
  
    fetchUserName();
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close the dropdown if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    

    // Close mobile menu if clicked outside
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

    // Add event listener for clicks outside of the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup the event listener when the component is unmounted
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);


  return (
    <nav className={`fixed top-0 left-0  sm:h-full h-[4rem] flex flex-col items-start py-5 px-2 sm:px-5  z-50 transition-all w-16rem bg-[#800101] 
     
    `}
  >
 

    <div
        className="flex items-center max-w-full sm:mt-0 "
      >
      {/* Hide Logo on Small Screens */}
        <img src="/public/pup-logo.png" alt="Website Logo" className="w-[2.75rem] h-[2.75rem] hidden lg:block" />
        <p className="pl-3 font-extrabold hidden sm:block text-white">ARCDO Dashboard</p>



        {/* Hamburger Menu for Mobile */}
        <button onClick={toggleMobileMenu} className="lg:hidden -mt-2 p-2 h-3rem ">
          <Menu className="text-white hover:text-white h-6 w-6 to" />
        </button>
      </div>

      

      
      {/* Sidebar Items for Large Screens */}
      <ul className="hidden lg:flex flex-col space-y-2 mt-10 w-full text-white ">
        {menuItems.map((item) => (
          <li key={item.name} className="w-full">
            <NavLink
              to={item.path}
              className={({ isActive }) => `flex items-center px-2 py-3 rounded-2xl relative group ${
                  isActive ? "bg-white text-black" : "hover:bg-white hover:text-black"
                } transition duration-300`}
            >
            <div className="bg-white p-1 rounded-lg text-black mr-3">{item.icon}</div>
              
                <span className="text-sm  font-medium hidden sm:inline-block group-hover:block absolute sm:static left-12 px-2 py-1">
                  {item.name}
                </span>
              
          </NavLink>
          </li>
        ))}
      </ul>

      {/* Admin Profile in Large Screens */}
      <div className="hidden lg:flex mt-auto w-full text-white">
      <button
          onClick={toggleDropdown}
          className={`w-full flex items-center space-x-3 px-1 py-2 rounded-lg ${
            isDropdownOpen ? "bg-white text-black" : "hover:bg-white hover:text-black"
          } transition duration-300`}
        >
          <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center">
            <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center">
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="w-[35px] h-[35px] rounded-full object-cover"
                onError={(e) => {
                  // Fallback to default if image fails to load
                  e.target.onerror = null;
                  e.target.src = '/default-profile.jpg';
                }}
              />
            </div>
          </div>
            <span className="text-sm font-medium hidden sm:block">{userName}</span>
          
        </button>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-100 bg-white divide-y  rounded-lg shadow w-44 bottom-20 left-10 ml-3"
          >
            <ul className="py-2 text-sm text-black text-md font-medium">
              <li>
                <button
                  onClick={() => setModalOpen(true)} // Open modal
                  className="flex px-4 py-2 hover:text-yellow-500"
                >
                  <User className="h-5 w-5 mr-2" /> Account
                </button>
              </li>
              <li>
                <button
                  onClick={handleSignOutClick}
                  className="flex px-4 py-2 hover:text-yellow-500"
                >
                  <LogOut className="h-5 w-5 mr-2" /> Sign out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

    

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden absolute top-16 left-0 w-64 bg-white shadow-lg p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `flex items-center px-4 py-2 rounded-lg ${isActive ? "bg-gray-300 text-black" : "hover:bg-gray-200"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon} <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center px-4 py-2 text-black hover:bg-gray-200 rounded-lg w-full"
          >
            <User className="h-5 w-5 mr-2" /> Admin Profile
          </button>

          <hr className="my-3" />
          <button
            onClick={handleSignOutClick}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg w-full"
          >
            <LogOut className="h-5 w-5 mr-2" /> Sign Out
          </button>
        </div>
      )}

      {/* Admin Profile Modal */}
      <AdminProfile isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </nav>
  );
}
