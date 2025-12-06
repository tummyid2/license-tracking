'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LicenseForm } from '@/components/licenses/LicenseForm';
import { LicenseTable } from '@/components/licenses/LicenseTable';
import { SearchBar } from '@/components/licenses/SearchBar';
import { PaginationControls } from '@/components/licenses/PaginationControls';
import { Plus, Bell } from 'lucide-react';
import { ComputedLicenseData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';


export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [licenses, setLicenses] = useState<ComputedLicenseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLicense, setEditingLicense] = useState<ComputedLicenseData | null>(null);
    const [notificationStatus, setNotificationStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'registration' | 'company' | 'tag'>('registration');



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

    const handleSendLineNotification = async () => {
        setNotificationStatus('sending');

        // Filter licenses that need notification (1-90 days remaining)
        const licensesToNotify = licenses.filter(
            (d) => d.daysRemaining >= 1 && d.daysRemaining <= 90
        );

        if (licensesToNotify.length === 0) {
            alert('ไม่มีใบอนุญาตที่ต้องแจ้งเตือนในขณะนี้');
            setNotificationStatus('idle');
            return;
        }

        try {
            const response = await fetch('/api/notify/line', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licenses: licensesToNotify,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotificationStatus('sent');
                alert(
                    `✅ ส่งการแจ้งเตือนสำเร็จ!\n\n` +
                    `ใบอนุญาต: ${data.licensesNotified} รายการ\n` +
                    `ข้อความที่ส่ง: ${data.messagesSent} ข้อความ\n` +
                    `โควต้าคงเหลือ: ${data.quotaRemaining}/300\n\n` +
                    (data.quotaWarning ? '⚠️ ใกล้ถึงโควต้าแล้ว!' : '')
                );
                setTimeout(() => setNotificationStatus('idle'), 3000);
            } else {
                if (data.error === 'quota_exceeded') {
                    throw new Error(
                        `เกินโควต้า 300 ข้อความ/เดือน\nใช้ไปแล้ว: ${data.quotaUsed}/300`
                    );
                }
                throw new Error(data.error || 'Failed to send notification');
            }
        } catch (error: any) {
            setNotificationStatus('idle');
            alert(`❌ เกิดข้อผิดพลาด:\n${error.message}`);
        }
    };

    // Apply Search Filter
    const searchedData = licenses.filter(item => {
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
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

    // Calculate Pagination
    const paginatedData = (() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return searchedData.slice(startIndex, endIndex);
    })();

    const totalPages = Math.ceil(searchedData.length / itemsPerPage);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, searchType, itemsPerPage]);

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold text-foreground self-start sm:self-center">
                        จัดการใบอนุญาต
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Button
                            onClick={handleSendLineNotification}
                            disabled={notificationStatus !== 'idle'}
                            className="bg-[#00B900] hover:bg-[#009900] text-white w-full sm:w-auto"
                        >
                            <Bell className="mr-2 h-4 w-4" />
                            {notificationStatus === 'sending' ? 'Sending...' : notificationStatus === 'sent' ? 'Sent!' : 'Notify LINE'}
                        </Button>
                        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            เพิ่มใบอนุญาตใหม่
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {/* Search Bar */}
                        <Card className="mb-6">
                            <div className="p-4">
                                <SearchBar
                                    searchQuery={searchQuery}
                                    searchType={searchType}
                                    onSearchQueryChange={setSearchQuery}
                                    onSearchTypeChange={setSearchType}
                                    resultCount={searchedData.length}
                                    totalCount={licenses.length}
                                />
                            </div>
                        </Card>

                        {/* Table */}
                        <Card>
                            <LicenseTable
                                data={paginatedData}
                                groupBy="none"
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </Card>

                        {/* Pagination */}
                        {searchedData.length > 0 && (
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={searchedData.length}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        )}
                    </>
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
        </>
    );
}
