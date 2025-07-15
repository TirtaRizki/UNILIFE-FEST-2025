
"use client";

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const VisitorCounter = () => {
    // Start with a semi-realistic random number
    const [count, setCount] = useState(() => Math.floor(10000 + Math.random() * 5000));

    useEffect(() => {
        const interval = setInterval(() => {
            // Increment by a small random number to look more realistic
            setCount(prevCount => prevCount + Math.floor(Math.random() * 3) + 1);
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 flex items-center gap-3 text-white">
            <Users className="h-5 w-5 text-primary" />
            <div className="text-left">
                <p className="font-bold text-lg leading-none">{count.toLocaleString('id-ID')}</p>
                <p className="text-xs text-white/70">Total Visitors</p>
            </div>
        </div>
    );
};

export default VisitorCounter;
