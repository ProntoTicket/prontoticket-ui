'use client';

import Link from 'next/link';
import { useState } from 'react';

const BASE_URL = 'http://localhost:5110';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false); // Boolean state to indicate signup success

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const rawResponse = await response.text();
        console.log('Raw response:', rawResponse);

        try {
          const parsedResponse = JSON.parse(rawResponse);
          console.error('Parsed JSON error:', parsedResponse);
        } catch (parseError) {
          console.error('Non-JSON response:', rawResponse);
        }

        throw new Error('Failed to sign up.');
      }

      setSignupSuccess(true);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Page header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h1 className="h1">Welcome to ProntoTicket</h1>
          </div>

          {/* Form */}
          <div className="max-w-sm mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="w-full px-3 mb-4">
                <label
                  className="block text-gray-800 text-sm font-medium mb-1"
                  htmlFor="firstName"
                >
                  First Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="form-input w-full text-gray-800"
                  placeholder="Enter your first name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="w-full px-3 mb-4">
                <label
                  className="block text-gray-800 text-sm font-medium mb-1"
                  htmlFor="lastName"
                >
                  Last Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="form-input w-full text-gray-800"
                  placeholder="Enter your last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="w-full px-3 mb-4">
                <label
                  className="block text-gray-800 text-sm font-medium mb-1"
                  htmlFor="username"
                >
                  Username <span className="text-red-600">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-input w-full text-gray-800"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="w-full px-3 mb-4">
                <label
                  className="block text-gray-800 text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input w-full text-gray-800"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-full px-3 mb-4">
                <label
                  className="block text-gray-800 text-sm font-medium mb-1"
                  htmlFor="password"
                >
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input w-full text-gray-800"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button className="btn text-white bg-blue-600 hover:bg-blue-700 w-full">
                    Sign up
                  </button>
                </div>
              </div>
              {signupSuccess && (
                <div className="text-green-600 text-center mt-4">
                  Signup successful. You can{' '}
                  <Link
                    href="/signin"
                    className="text-blue-600 hover:underline transition duration-150 ease-in-out"
                  >
                    sign in
                  </Link>
                </div>
              )}
              <div className="text-sm text-gray-500 text-center mt-3">
                By creating an account, you agree to the{' '}
                <a className="underline" href="#0">
                  terms & conditions
                </a>
                , and our{' '}
                <a className="underline" href="#0">
                  privacy policy
                </a>
                .
              </div>
            </form>

            <div className="flex items-center my-6">
              <div
                className="border-t border-gray-300 grow mr-3"
                aria-hidden="true"
              ></div>
              <div className="text-gray-600 italic">Or</div>
              <div
                className="border-t border-gray-300 grow ml-3"
                aria-hidden="true"
              ></div>
            </div>
            <form>
              <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3">
                  <button className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center">
                    <svg
                      className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                    </svg>
                    <span className="flex-auto pl-16 pr-8 -ml-16">
                      Continue with Google
                    </span>
                  </button>
                </div>
              </div>
            </form>
            <div className="text-gray-600 text-center mt-6">
              Already using Simple?{' '}
              <Link
                href="/signin"
                className="text-blue-600 hover:underline transition duration-150 ease-in-out"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
