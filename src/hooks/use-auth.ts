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
                    setUser(JSON.parse(userJson));
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

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [updateUserFromStorage]);

    const hasRole = useCallback((roles: Array<User['role']>) => {
        if (!isClient || !user) return false;
        return roles.includes(user.role);
    }, [user, isClient]);
    
    return { user, hasRole, isClient };
}
