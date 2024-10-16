import React, { useState, useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import {UserContext} from './UserContext.jsx';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';

const MySvgIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
  );
  
export default function CustomDropdown() {
  const [show, setShow] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();
  const handleToggle = (isOpen) => setShow(isOpen);

  async function Logout(e) {
    e.preventDefault();
    try {
      await axios.post("/logout");
      alert('Logout Successful');
      setUser(null)
      navigate('/');
    } catch (error) {
      console.log(error)
      alert('Logout Failed');
    }
  }

  return (
    <Dropdown show={show} onToggle={handleToggle} className="custom-dropdown">
      <Dropdown.Toggle as="button" className="bg-white-300 flex gap-2 border border-gray-300 rounded-full py-2 px-4 items-center xs:hidden md:flex">
            <MySvgIcon />
            <div className="bg-gray-500 rounded-full border-2 border-gray-500 text-white overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
          </div>
          {!!user && (
          <div>
            Hello, {user.name}!
          </div>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="custom-dropdown-menu">
        {!user && <Dropdown.Item as={Link} to={'/login'} className="custom-dropdown-item">
          Login
        </Dropdown.Item>}
        {!user && <Dropdown.Item as={Link} to={'/register'} className="custom-dropdown-item">
          Register
        </Dropdown.Item>}
        {user && <Dropdown.Item as={Link} to={'/account'} className="custom-dropdown-item">
          My Profile
        </Dropdown.Item>}
        {user && <Dropdown.Item as={Link} to={'/account/bookings'} className="custom-dropdown-item">
          My Bookings
        </Dropdown.Item>}
        {user && <Dropdown.Item as={Link} to={'/account/places'} className="custom-dropdown-item text-nowrap">
          My Acommodations
        </Dropdown.Item>}
        {user && <Dropdown.Item as="a" className="custom-dropdown-item" onClick={Logout}>
          Logout
        </Dropdown.Item>}
      </Dropdown.Menu>
    </Dropdown>
  );
}