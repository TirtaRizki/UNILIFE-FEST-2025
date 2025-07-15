
"use client";

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const VisitorCounter = () => {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const incrementVisitorCount = async () => {
            try {
                // Only increment count if it hasn't been done this session
                if (!sessionStorage.getItem('visitorCounted')) {
                    const response = await fetch('/api/visitors', { method: 'POST' });
                    const data = await response.json();
                    setCount(data.count);
                    sessionStorage.setItem('visitorCounted', 'true');
                } else {
                    // If already counted, just fetch the current count
                    const response = await fetch('/api/visitors');
                    const data = await response.json();
                    setCount(data.count);
                }
            } catch (error) {
                console.error("Failed to update visitor count:", error);
                // Fallback to fetching count if POST fails
                try {
                     const response = await fetch('/api/visitors');
                    const data = await response.json();
                    setCount(data.count);
                } catch (fetchError) {
                     console.error("Failed to fetch visitor count:", fetchError);
                }
            } finally {
                setIsLoading(false);
            }
        };

        incrementVisitorCount();
    }, []);

    const displayCount = isLoading ? "..." : count.toLocaleString('id-ID');

    return (
        <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 flex items-center gap-3 text-white min-w-[140px]">
            <Users className="h-5 w-5 text-primary" />
            <div className="text-left">
                <p className="font-bold text-lg leading-none">{displayCount}</p>
                <p className="text-xs text-white/70">Total Visitors</p>
            </div>
        </div>
    );
};

export default VisitorCounter;
