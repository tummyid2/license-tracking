'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LogOut, Home, Settings, FileText, Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AdminNav() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <nav className="bg-card shadow-sm border-b sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <h1 className="text-lg sm:text-xl font-bold text-foreground">
                            Admin <span className="hidden sm:inline">Dashboard</span>
                        </h1>

                        {/* Desktop Links */}
                        <div className="hidden sm:flex items-center gap-1">
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/dashboard">
                                    <Home className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/admin">
                                    <FileText className="mr-2 h-4 w-4" />
                                    จัดการใบอนุญาต
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/admin/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    ตั้งค่า
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/admin/notifications">
                                    <Bell className="mr-2 h-4 w-4" />
                                    ประวัติการส่ง
                                </Link>
                            </Button>
                        </div>

                        {/* Mobile Links (Icon only) */}
                        <div className="flex sm:hidden items-center gap-1">
                            <Button asChild variant="ghost" size="sm" className="px-2">
                                <Link href="/dashboard">
                                    <Home className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="px-2">
                                <Link href="/admin">
                                    <FileText className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="px-2">
                                <Link href="/admin/settings">
                                    <Settings className="h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="px-2">
                                <Link href="/admin/notifications">
                                    <Bell className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">
                            {user?.email}
                        </span>
                        <ThemeToggle />

                        {/* Desktop Logout */}
                        <Button onClick={handleLogout} variant="destructive" size="sm" className="hidden sm:flex">
                            <LogOut className="mr-2 h-4 w-4" />
                            ออกจากระบบ
                        </Button>

                        {/* Mobile Logout */}
                        <Button onClick={handleLogout} variant="destructive" size="sm" className="sm:hidden px-2">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
