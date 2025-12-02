'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LogOut, Home, Settings } from 'lucide-react';
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
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-foreground">
                            Admin Dashboard
                        </h1>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/admin">
                                <Settings className="mr-2 h-4 w-4" />
                                จัดการใบอนุญาต
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/admin/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                จัดการข้อมูลหลัก
                            </Link>
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            {user?.email}
                        </span>
                        <ThemeToggle />
                        <Button onClick={handleLogout} variant="destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            ออกจากระบบ
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
