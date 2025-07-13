"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserCheck, Calendar as CalendarIcon, Mic } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const Countdown = () => {
    const calculateTimeLeft = () => {
        const eventDate = new Date("2025-07-30T00:00:00");
        const difference = +eventDate - +new Date();
        
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

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

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const formatTime = (time: number) => {
        return String(time).padStart(2, '0');
    }
    
    const TimerUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="bg-gradient-to-br from-primary to-[#764ba2] text-white rounded-lg p-3 md:p-4 text-center min-w-[70px] md:min-w-[80px]">
            <div className="text-2xl md:text-3xl font-bold">{formatTime(value)}</div>
            <div className="text-xs uppercase opacity-80">{label}</div>
        </div>
    );

    return (
        <div className="text-center">
            <h2 className="text-lg font-semibold uppercase tracking-widest text-foreground mb-4">Start The Event</h2>
            <div className="flex justify-center items-center gap-2 md:gap-4">
                <TimerUnit value={timeLeft.days} label="Days" />
                <TimerUnit value={timeLeft.hours} label="Hours" />
                <TimerUnit value={timeLeft.minutes} label="Minutes" />
                <TimerUnit value={timeLeft.seconds} label="Seconds" />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card className="content-card p-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-2 pt-0">
            <div className="text-2xl font-bold text-foreground">{value}</div>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Panitia" value="303" icon={Users} />
        <StatCard title="Peserta Terdaftar" value="235" icon={UserCheck} />
        <StatCard title="Event Aktif" value="12" icon={CalendarIcon} />
        <StatCard title="Lineup Artis" value="8" icon={Mic} />
      </div>
      <div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-5">
        <Card className="lg:col-span-3 content-card p-4 md:p-6">
          <Countdown />
        </Card>
        <Card className="lg:col-span-2 content-card flex justify-center items-center p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </Card>
      </div>
    </>
  );
}
