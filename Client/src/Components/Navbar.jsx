import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ListContext } from '../Context/ListContext';
import { toast } from 'react-toastify';
import { FaSearch, FaBars } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { token, setToken } = useContext(ListContext);
  const [search, setSearch] = useState('')  
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const {getAllListings,listings,setListings} = useContext(ListContext)
  let [allListings,setAllListings] = useState([])

  const logout = () => {
    try {
      setToken('');
      localStorage.removeItem('token');
      navigate('/');
      toast.success('Logout successful');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (listings.length > 0 && allListings.length === 0) {
      setAllListings(listings);
    }
  }, [listings]);

  
  const submitSearch = async () => {
    try {
      if (search.trim() === '') {
        toast.error('Please enter a search term!');
        setListings(allListings)
        return;
      }

     
        
      const filtered = allListings.filter(l => 
            [l.title, l.location, l.country, l.type,l.location+l.country,l.weather].some(field =>
              field.toLowerCase().split(/\s+/).includes(search.toLowerCase())
            ) //some aamathi koi ek pan match thay to return true thai jashe. .split words ne whitspace na according array ma convert kari dese and now aakha word mate check thase ex: ["hotel"].includes("hot") to false return thase without split true return thase
          );
      
          
          if (filtered.length === 0) {
            toast.error('No Property found!');
            setListings(allListings)
            return
          }
          else setListings(filtered)
          
        } catch (error) {
          toast.error('Invalid search!');
        }
      }

      useEffect(() => {
        if(search.length > 0) submitSearch()
      },[])
      
     
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        <NavLink to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          BookNest
        </NavLink>

        {/* Search (Desktop) */}
        <div className="hidden md:flex items-center relative w-1/3">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Search..."
          />
           <FontAwesomeIcon onClick={submitSearch} className='bg-red-500 md:px-3 px+2 md:m-4 m-3 cursor-pointer md:py-3 py-2 rounded-full' icon={faMagnifyingGlass} style={{ color:'#ffff' }} />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 dark:text-white text-xl focus:outline-none"
          >
            <FaBars />
          </button>
        </div>

        {/* Menu (Desktop) */}
        <ul className="hidden md:flex space-x-6 items-center font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-blue-500 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-white'}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-blue-500 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-white'}`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add-newproperty"
              className={({ isActive }) =>
                `hover:text-blue-500 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-white'}`
              }
            >
              Add New
            </NavLink>
          </li>
          {!token ? (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `hover:text-blue-500 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-white'}`
                }
              >
                Create Account
              </NavLink>
            </li>
          ) : (
            <li>
              <button onClick={logout} className="text-gray-700 dark:text-white hover:text-red-500">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex items-center relative mb-4">
            <FaSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Search..."
            />
           <FontAwesomeIcon onClick={submitSearch} className='bg-red-500 px-2 m-3 cursor-pointer py-2 rounded-full' icon={faMagnifyingGlass} style={{ color:'#ffff' }} />
          </div>
          <ul className="flex flex-col space-y-2 font-medium text-gray-700 dark:text-white">
            <li>
              <NavLink to="/" onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={() => setMenuOpen(false)}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/add-newproperty" onClick={() => setMenuOpen(false)}>
                Add New
              </NavLink>
            </li>
            {!token ? (
              <li>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                  Create Account
                </NavLink>
              </li>
            ) : (
              <li>
                <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
