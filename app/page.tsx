'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, ListFilter, HelpCircle, Bell, LogIn, Settings } from 'lucide-react';
import { LicenseTable } from '@/components/licenses/LicenseTable';
import { ComputedLicenseData } from '@/types';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Home() {
    const [showAdvice, setShowAdvice] = useState(false);
    const [filter, setFilter] = useState<'all' | 'expired' | 'warning' | 'active'>('all');
    const [groupBy, setGroupBy] = useState<'none' | 'company' | 'tag'>('none');
    const [notificationStatus, setNotificationStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [allData, setAllData] = useState<ComputedLicenseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Fetch data from API
    useEffect(() => {
        const fetchLicenses = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/licenses');

                if (!response.ok) {
                    throw new Error('Failed to fetch licenses');
                }

                const data = await response.json();
                setAllData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching licenses:', err);
                setError('Failed to load license data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchLicenses();
    }, []);

    // Calculate Stats
    const stats = useMemo(() => {
        return {
            total: allData.length,
            expired: allData.filter(d => d.computedStatus === 'Expired').length,
            warning: allData.filter(d => d.computedStatus === 'Expiring Soon').length,
            active: allData.filter(d => d.computedStatus === 'Active').length,
        };
    }, [allData]);

    // Filter Data
    const filteredData = useMemo(() => {
        return allData.filter(item => {
            if (filter === 'expired') return item.computedStatus === 'Expired';
            if (filter === 'warning') return item.computedStatus === 'Expiring Soon';
            if (filter === 'active') return item.computedStatus === 'Active';
            return true;
        });
    }, [allData, filter]);

    const handleSimulateNotification = () => {
        setNotificationStatus('sending');
        setTimeout(() => {
            setNotificationStatus('sent');
            setTimeout(() => setNotificationStatus('idle'), 3000);
            alert(`[จำลอง] ส่งแจ้งเตือนไปยัง LINE OA เรียบร้อยแล้ว!\n\nรายการแจ้งเตือน:\n- หมดอายุ: ${stats.expired} รายการ\n- ใกล้หมด: ${stats.warning} รายการ`);
        }, 1500);
    };

    return (
        <div className="min-h-screen pb-12 bg-background">
            {/* Navbar */}
            <nav className="bg-card shadow-sm border-b sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                                <ListFilter size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">LicenseGuard</h1>
                                <p className="text-xs text-muted-foreground">ระบบติดตามใบอนุญาต</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            {user ? (
                                <Button asChild>
                                    <Link href="/admin">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Admin
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild variant="outline">
                                    <Link href="/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        เข้าสู่ระบบ
                                    </Link>
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                onClick={() => setShowAdvice(true)}
                            >
                                <HelpCircle className="mr-2 h-4 w-4" />
                                คำแนะนำ Tech Stack
                            </Button>
                            <Button
                                onClick={handleSimulateNotification}
                                disabled={notificationStatus !== 'idle'}
                                className="bg-[#00B900] hover:bg-[#009900] text-white"
                            >
                                <Bell className="mr-2 h-4 w-4" />
                                {notificationStatus === 'sending' ? 'Sending...' : notificationStatus === 'sent' ? 'Sent!' : 'Notify LINE'}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Welcome Banner */}
                <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
                    <CardHeader>
                        <CardTitle className="text-3xl">ภาพรวมใบอนุญาต</CardTitle>
                        <CardDescription className="text-base">
                            ตรวจสอบสถานะวันหมดอายุของใบอนุญาต (Registration), แยกตามบริษัท และแจ้งเตือนอัตโนมัติ ข้อมูลอัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="text-destructive">Error</CardTitle>
                            <CardDescription>{error}</CardDescription>
                        </CardHeader>
                    </Card>
                )}

                {/* Data Display - Only show when not loading and no error */}
                {!loading && !error && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card
                                className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary' : 'hover:shadow-lg'}`}
                                onClick={() => setFilter('all')}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">ใบอนุญาตทั้งหมด</CardTitle>
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <ListFilter className="h-6 w-6 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total}</div>
                                    <p className="text-xs text-muted-foreground">รายการทั้งหมด</p>
                                </CardContent>
                            </Card>

                            <Card
                                className={`cursor-pointer transition-all ${filter === 'expired' ? 'ring-2 ring-destructive' : 'hover:shadow-lg'}`}
                                onClick={() => setFilter('expired')}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">หมดอายุแล้ว</CardTitle>
                                    <div className="p-3 bg-destructive/10 rounded-lg">
                                        <AlertTriangle className="h-6 w-6 text-destructive" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-destructive">{stats.expired}</div>
                                    <p className="text-xs text-muted-foreground">ต้องดำเนินการด่วน</p>
                                </CardContent>
                            </Card>

                            <Card
                                className={`cursor-pointer transition-all ${filter === 'warning' ? 'ring-2 ring-yellow-500' : 'hover:shadow-lg'}`}
                                onClick={() => setFilter('warning')}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">ใกล้หมดอายุ (90 วัน)</CardTitle>
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                        <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
                                    <p className="text-xs text-muted-foreground">ควรเตรียมต่ออายุ</p>
                                </CardContent>
                            </Card>

                            <Card
                                className={`cursor-pointer transition-all ${filter === 'active' ? 'ring-2 ring-green-500' : 'hover:shadow-lg'}`}
                                onClick={() => setFilter('active')}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">ใช้งานปกติ</CardTitle>
                                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                                    <p className="text-xs text-muted-foreground">ยังไม่ต้องดำเนินการ</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Controls */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <span className="text-sm font-medium whitespace-nowrap">Group By:</span>
                                        <div className="inline-flex rounded-md shadow-sm" role="group">
                                            <Button
                                                type="button"
                                                variant={groupBy === 'none' ? 'default' : 'outline'}
                                                onClick={() => setGroupBy('none')}
                                                className="rounded-r-none"
                                            >
                                                None
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={groupBy === 'company' ? 'default' : 'outline'}
                                                onClick={() => setGroupBy('company')}
                                                className="rounded-none border-l-0"
                                            >
                                                Company
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={groupBy === 'tag' ? 'default' : 'outline'}
                                                onClick={() => setGroupBy('tag')}
                                                className="rounded-l-none border-l-0"
                                            >
                                                Tag
                                            </Button>
                                        </div>
                                    </div>

                                    <Badge variant="secondary" className="text-sm">
                                        แสดงข้อมูล {filteredData.length} รายการ จากทั้งหมด {allData.length}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Main Table Content */}
                        <LicenseTable data={filteredData} groupBy={groupBy} />
                    </>
                )}

            </main>
        </div>
    );
}
