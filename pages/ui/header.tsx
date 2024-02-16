'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './logo';
import Dropdown from '@/components/utils/dropdown';
import MobileMenu from './mobile-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [top, setTop] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(true);

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    const tokenCheck = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    // Listen for the login-success event
    window.addEventListener('login-success', tokenCheck);

    // Initial check in case the component mounts after the event was dispatched
    tokenCheck();

    return () => {
      window.removeEventListener('login-success', tokenCheck);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
    setIsProfileMenuOpen(false);
  }, [isLoggedIn]); // Depend on isLoggedIn to trigger the effect

  useEffect(() => {
    console.log(isProfileMenuOpen);
    const tokenCheck = () => {
      const token = localStorage.getItem('token');
      console.log('I GOT THIS TOKEN' + token);
      setIsLoggedIn(!!token);
    };

    tokenCheck();
    window.addEventListener('login-success', tokenCheck);

    console.log(isProfileMenuOpen);

    return () => {
      window.removeEventListener('login-success', tokenCheck);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileMenuOpen) {
      setIsProfileMenuOpen(false);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top ? 'bg-white backdrop-blur-sm shadow-lg' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-end flex-wrap items-center">
              {!isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/signin"
                      className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3"
                    >
                      <span>Sign up</span>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="relative">
                    <button
                      onClick={toggleProfileMenu}
                      className="px-4 py-3 flex items-center"
                    >
                      <FontAwesomeIcon icon={faUserCircle} size="2x" />
                    </button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 py-2 w-48 bg-white shadow-xl z-20">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
                        >
                          Admin Dashboard
                        </Link>
                        <a
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white"
                        >
                          Sign Out
                        </a>
                      </div>
                    )}
                  </li>
                  <li className="relative">
                    <button onClick={toggleMenu} className="ml-3">
                      <FontAwesomeIcon icon={faBars} size="2x" />
                    </button>
                    {isMenuOpen && <MobileMenu />}
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
