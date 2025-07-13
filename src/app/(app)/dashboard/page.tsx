"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Ticket, Clock, LogIn } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import PageHeader from '@/components/page-header';

const Countdown = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date("2025-01-01") - +new Date();
        let timeLeft = {};

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

    const formatTime = (time: number | undefined) => {
        return time !== undefined ? String(time).padStart(2, '0') : '00';
    }

    return (
        <div className="text-center">
            <h2 className="text-xl font-semibold uppercase tracking-widest text-white mb-2">Start The Event</h2>
            <div className="flex justify-center items-center gap-4 text-white">
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-bold">{formatTime(timeLeft.days)}</span>
                    <span className="text-sm uppercase">Days</span>
                </div>
                <span className="text-6xl font-bold">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-bold">{formatTime(timeLeft.hours)}</span>
                    <span className="text-sm uppercase">Hours</span>
                </div>
                <span className="text-6xl font-bold">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-bold">{formatTime(timeLeft.minutes)}</span>
                    <span className="text-sm uppercase">Minute</span>
                </div>
                <span className="text-6xl font-bold">:</span>
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-bold">{formatTime(timeLeft.seconds)}</span>
                    <span className="text-sm uppercase">Second</span>
                </div>
            </div>
        </div>
    );
};

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <>
      <PageHeader title="Dasboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card text-white">
          <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiket Terjual</CardTitle>
            <div className="text-2xl font-bold">383</div>
          </CardHeader>
        </Card>
        <Card className="glass-card text-white">
          <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiket Pending</CardTitle>
            <div className="text-2xl font-bold">233</div>
          </CardHeader>
        </Card>
        <Card className="glass-card text-white">
          <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riwayat Login</CardTitle>
            <div className="text-2xl font-bold">-</div>
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-card p-6">
          <Countdown />
        </div>
        <div className="glass-card flex justify-center items-center p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            classNames={{
                caption: "text-white",
                caption_label: "text-white",
                nav_button: "text-white hover:bg-white/10",
                head_cell: "text-white/80",
                day: "text-white hover:bg-white/20",
                day_selected: "bg-white/30 text-white",
                day_today: "bg-white/10 text-white",
                day_outside: "text-white/50",
            }}
          />
        </div>
      </div>
    </>
  );
}
