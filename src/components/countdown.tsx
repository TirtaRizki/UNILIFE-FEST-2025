
"use client";
import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate, title }: { targetDate: string, title: string }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        
        return () => clearInterval(timer);
    }, [targetDate]);

    const formatTime = (time: number) => {
        return String(time).padStart(2, '0');
    }
    
    const TimerUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="bg-gradient-to-br from-primary to-[#764ba2] text-white rounded-lg p-3 md:p-4 text-center min-w-[70px] md:min-w-[80px]">
            <div className="text-2xl md:text-3xl font-bold">{isClient ? formatTime(value) : '00'}</div>
            <div className="text-xs uppercase opacity-80">{label}</div>
        </div>
    );
    
    return (
        <div className="text-center">
            <h2 className="text-lg font-semibold uppercase tracking-widest text-foreground dark:text-primary-foreground mb-4">{title}</h2>
            <div className="flex justify-center items-center gap-2 md:gap-4">
                <TimerUnit value={timeLeft.days} label="Days" />
                <TimerUnit value={timeLeft.hours} label="Hours" />
                <TimerUnit value={timeLeft.minutes} label="Minutes" />
                <TimerUnit value={timeLeft.seconds} label="Seconds" />
            </div>
        </div>
    );
};

export default Countdown;
