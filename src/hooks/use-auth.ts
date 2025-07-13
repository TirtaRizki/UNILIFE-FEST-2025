"use client";

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';

// Let's assume the current logged-in user is the one with the 'Admin' role for this demo.
// In a real app, this would come from a proper auth context after login.
const getDemoUser = (users: User[]): User | null => {
    // For this demo, we'll try to find an 'Admin', then 'Panitia', then the first user as the logged-in user.
    return users.find(u => u.role === 'Admin') || users.find(u => u.role === 'Panitia') || users[0] || null;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const handleStorageChange = () => {
            const usersInStorage = localStorage.getItem('users');
            if (usersInStorage) {
                const allUsers: User[] = JSON.parse(usersInStorage);
                setUser(getDemoUser(allUsers));
            } else {
                setUser(null);
            }
        };

        // Initial load
        handleStorageChange();

        // Listen for changes
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const hasRole = useCallback((roles: Array<User['role']>) => {
        if (!user) return false;
        return roles.includes(user.role);
    }, [user]);
    
    return { user, hasRole };
}