import React, { useState, useEffect } from 'react';
import API from '../api/api';


const ProtectedPage = () => {
  const [password, setPassword] = useState('');
  const [correctPassword, setCorrectPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const response = await API.get('/password');
        setCorrectPassword(response.data.password);
      } catch (error) {
        console.error('Error fetching password:', error);
      }
    };
    fetchPassword();
  }, []);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lockedOut) {
      alert('You are locked out due to too many incorrect attempts.');
      return;
    }

    if (password === correctPassword) {
      setIsAuthenticated(true);
      setShowModal(false);
    } else {
      setAttempts(prev => prev + 1);
      alert('Incorrect password!');
      if (attempts + 1 >= 3) { 
        setLockedOut(true);
      }
    }
    setPassword(''); 
  };

  return (
    <div>
      {/* Password Modal */}
      {showModal && !isAuthenticated && (
        <div className="fixed inset-0 bg-[#000000bf] flex justify-center items-center z-50 w-full h-full">
          <div className="bg-white p-10 rounded-lg shadow-lg w-[600px] h-[300px] max-w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">Enter Password</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="border p-3 mb-6 w-full rounded text-lg"
                required
                disabled={lockedOut}
              />
              <button
                type="submit"
                className="bg-blue-800 hover:bg-blue-700 text-white py-3 px-6 rounded w-full text-lg"
                disabled={lockedOut}
              >
                Submit
              </button>
            </form>
            {lockedOut && (
              <p className="text-red-600 text-center mt-4">Too many wrong attempts. Please refresh the page.</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {isAuthenticated && (
        <></>
      )}
    </div>
  );
};

export default ProtectedPage;
