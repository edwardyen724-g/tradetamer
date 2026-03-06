import React from 'react';
import { getAuth } from 'firebase/auth';
import { useSession } from '../../context/AuthContext';
import { firebaseApp } from '../../lib/firebase'; // Make sure to set up the firebase app
  
const SettingsPage: React.FC = () => {
  const auth = getAuth(firebaseApp);
  const { user } = useSession();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      {user ? (
        <div>
          <h2 className="text-xl">Welcome, {user.displayName || 'User'}</h2>
          <div className="mt-4">
            <h3 className="font-semibold">Profile Settings</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm">Email:</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="block w-full p-2 border rounded"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Name:</label>
                <input
                  type="text"
                  defaultValue={user.displayName || ''}
                  className="block w-full p-2 border rounded"
                />
              </div>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Update Settings</button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-red-600">Please sign in to access your settings.</p>
      )}
    </div>
  );
};

export default SettingsPage;