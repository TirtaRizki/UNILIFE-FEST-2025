"use client";

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const updateUserFromStorage = useCallback(() => {
        if (typeof window !== 'undefined') {
            const userJson = sessionStorage.getItem('loggedInUser');
            if (userJson) {
                try {
                    const parsedUser = JSON.parse(userJson);
                    // We only care about Admin and Panitia for the CMS now
                    if (['Admin', 'Panitia'].includes(parsedUser.role)) {
                         setUser(parsedUser);
                    } else {
                         setUser(null);
                    }
                } catch (e) {
                    console.error("Failed to parse user from sessionStorage", e);
                    setUser(null);
                    sessionStorage.removeItem('loggedInUser');
                }
            } else {
                setUser(null);
            }
        }
    }, []);

    useEffect(() => {
        updateUserFromStorage();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'loggedInUser' || event.key === 'users') {
                updateUserFromStorage();
            }
        };

        const handleSessionChange = () => {
            updateUserFromStorage();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('session', handleSessionChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('session', handleSessionChange);
        };
    }, [updateUserFromStorage]);

    const hasRole = useCallback((roles: Array<User['role']>) => {
        if (!isClient || !user) return false;
        return roles.includes(user.role);
    }, [user, isClient]);
    
    return { user, hasRole, isClient };
}
