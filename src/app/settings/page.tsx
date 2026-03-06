import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FirebaseConfig } from '../../lib/firebase'; // Assuming you have a firebase config file
import { AuthContextProvider, useAuth } from '../../context/AuthContext'; // Assuming you have an Auth context

const app = initializeApp(FirebaseConfig);

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<any>({}); // Replace `any` with appropriate settings type
    
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            // Fetch user settings from API or state management
            fetchUserSettings();
        }
    }, [user, router]);

    const fetchUserSettings = async () => {
        try {
            const response = await fetch('/api/settings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.uid}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setSettings(data);
            } else {
                toast.error(data.message || 'Failed to fetch settings');
            }
        } catch (error) {
            toast.error(err instanceof Error ? err.message : String(err));
        }
    };

    const handleUpdateSettings = async (newSettings: any) => {
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.uid}`,
                },
                body: JSON.stringify(newSettings),
            });

            if (response.ok) {
                toast.success('Settings updated successfully!');
                setSettings(newSettings);
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to update settings');
            }
        } catch (error) {
            toast.error(err instanceof Error ? err.message : String(err));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Settings</h1>
            {/* Render settings form here */}
            {/* Include input handlers and update calls */}
        </div>
    );
};

const Settings = () => (
    <AuthContextProvider>
        <SettingsPage />
    </AuthContextProvider>
);

export default Settings;