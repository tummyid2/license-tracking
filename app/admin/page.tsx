'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LicenseForm } from '@/components/licenses/LicenseForm';
import { LicenseTable } from '@/components/licenses/LicenseTable';
import { Plus } from 'lucide-react';
import { ComputedLicenseData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AdminNav } from '@/components/common/AdminNav';

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [licenses, setLicenses] = useState<ComputedLicenseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLicense, setEditingLicense] = useState<ComputedLicenseData | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchLicenses();
        }
    }, [user]);

    const fetchLicenses = async () => {
        try {
            const response = await fetch('/api/licenses');
            const data = await response.json();
            setLicenses(data);
        } catch (error) {
            console.error('Error fetching licenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบใบอนุญาตนี้?')) return;

        try {
            const response = await fetch(`/api/licenses/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchLicenses();
            }
        } catch (error) {
            console.error('Error deleting license:', error);
        }
    };

    const handleEdit = (license: ComputedLicenseData) => {
        setEditingLicense(license);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingLicense(null);
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminNav />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-foreground">
                        จัดการใบอนุญาต
                    </h2>
                    <Button onClick={() => setShowForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มใบอนุญาตใหม่
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <Card>
                        <LicenseTable
                            data={licenses}
                            groupBy="none"
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </Card>
                )}
            </div>

            {/* License Form Modal */}
            {showForm && (
                <LicenseForm
                    onClose={handleCloseForm}
                    onSuccess={fetchLicenses}
                    editData={editingLicense}
                />
            )}
        </div>
    );
}
