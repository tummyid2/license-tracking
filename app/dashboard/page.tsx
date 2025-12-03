'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Clock, ListFilter, Settings, LogOut } from 'lucide-react';
import { LicenseTable } from '@/components/licenses/LicenseTable';
import { ComputedLicenseData } from '@/types';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { SearchBar } from '@/components/licenses/SearchBar';
import { PaginationControls } from '@/components/licenses/PaginationControls';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
    const router = useRouter();
    const { user, signOut, loading: authLoading } = useAuth();

    const [filter, setFilter] = useState<'all' | 'expired' | 'warning' | 'active'>('all');
    const [groupBy, setGroupBy] = useState<'none' | 'company' | 'tag'>('none');
    const [allData, setAllData] = useState<ComputedLicenseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'registration' | 'company' | 'tag'>('registration');

    // 🔒 Authentication Guard - Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Fetch data from API
    useEffect(() => {
        if (!user) return; // Don't fetch if not authenticated

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
    }, [user]);

    // Calculate Stats
    const stats = useMemo(() => {
        return {
            total: allData.length,
            expired: allData.filter(d => d.computedStatus === 'Expired').length,
            warning: allData.filter(d => d.computedStatus === 'Expiring Soon').length,
            active: allData.filter(d => d.computedStatus === 'Active').length,
        };
    }, [allData]);

    // Apply Search Filter
    const searchedData = useMemo(() => {
        if (!searchQuery) return allData;

        const query = searchQuery.toLowerCase();
        return allData.filter(item => {
            switch (searchType) {
                case 'registration':
                    return item.registrationNo.toLowerCase().includes(query);
                case 'company':
                    return item.company.toLowerCase().includes(query);
                case 'tag':
                    return (item.tag || '').toLowerCase().includes(query);
                default:
                    return true;
            }
        });
    }, [allData, searchQuery, searchType]);

    // Apply Status Filter
    const filteredData = useMemo(() => {
        return searchedData.filter(item => {
            if (filter === 'expired') return item.computedStatus === 'Expired';
            if (filter === 'warning') return item.computedStatus === 'Expiring Soon';
            if (filter === 'active') return item.computedStatus === 'Active';
            return true;
        });
    }, [searchedData, filter]);

    // Calculate Pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, searchType, itemsPerPage]);

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    // Show loading while checking authentication
    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12 bg-background">
            {/* Navbar */}
            <nav className="bg-card shadow-sm border-b sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="bg-primary p-1.5 sm:p-2 rounded-lg text-primary-foreground flex-shrink-0">
                                <ListFilter size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">
                                    <span className="hidden sm:inline">License Tracking System</span>
                                    <span className="sm:hidden">License Tracker</span>
                                </h1>
                                <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">ระบบติดตามใบอนุญาต</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                            <ThemeToggle />

                            {/* Desktop: Show all buttons */}
                            <div className="hidden sm:flex items-center gap-3">
                                <Button asChild size="sm">
                                    <Link href="/admin">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Admin
                                    </Link>
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                    size="sm"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    ออกจากระบบ
                                </Button>
                            </div>

                            {/* Mobile: Show icon-only buttons */}
                            <div className="flex sm:hidden items-center gap-1.5">
                                <Button asChild size="sm" variant="ghost" className="p-2">
                                    <Link href="/admin">
                                        <Settings className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                    size="sm"
                                    className="p-2"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Welcome Banner */}
                <Card className="border-primary/20 bg-primary/5 dark:bg-primary/5">
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


                        {/* Search Bar */}
                        <Card>
                            <CardContent className="pt-6">
                                <SearchBar
                                    searchQuery={searchQuery}
                                    searchType={searchType}
                                    onSearchQueryChange={setSearchQuery}
                                    onSearchTypeChange={setSearchType}
                                    resultCount={filteredData.length}
                                    totalCount={allData.length}
                                />
                            </CardContent>
                        </Card>

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
                        <LicenseTable data={paginatedData} groupBy={groupBy} />

                        {/* Pagination Controls */}
                        {filteredData.length > 0 && (
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredData.length}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        )}
                    </>
                )}

            </main>
        </div>
    );
}
