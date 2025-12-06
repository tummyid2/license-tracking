'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Company, Tag, Scope } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';


export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'companies' | 'tags' | 'scopes'>('companies');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [scopes, setScopes] = useState<Scope[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);



    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [companiesRes, tagsRes, scopesRes] = await Promise.all([
                fetch('/api/companies'),
                fetch('/api/tags'),
                fetch('/api/scopes')
            ]);

            if (companiesRes.ok) setCompanies(await companiesRes.json());
            if (tagsRes.ok) setTags(await tagsRes.json());
            if (scopesRes.ok) setScopes(await scopesRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: 'companies' | 'tags' | 'scopes') => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) return;

        try {
            const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchData();
            } else {
                alert('ไม่สามารถลบข้อมูลได้ (อาจมีการใช้งานอยู่)');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const type = activeTab;
        const isEdit = !!editingItem?.id;
        const url = isEdit ? `/api/${type}/${editingItem.id}` : `/api/${type}`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem),
            });

            if (res.ok) {
                setEditingItem(null);
                setIsDialogOpen(false);
                fetchData();
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึก');
            }
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const renderTable = (data: any[], columns: { key: string; label: string }[]) => (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.key}>{col.label}</TableHead>
                        ))}
                        <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            {columns.map((col) => (
                                <TableCell key={col.key}>{item[col.key] || '-'}</TableCell>
                            ))}
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setEditingItem(item);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(item.id, activeTab)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );

    const renderForm = () => {
        const fields = activeTab === 'companies'
            ? [
                { name: 'name', label: 'ชื่อบริษัท', required: true },
                { name: 'address', label: 'ที่อยู่' },
                { name: 'contact_person', label: 'ผู้ติดต่อ' },
                { name: 'email', label: 'อีเมล' },
                { name: 'phone', label: 'เบอร์โทร' }
            ]
            : activeTab === 'tags'
                ? [
                    { name: 'name', label: 'ชื่อ Tag', required: true },
                    { name: 'description', label: 'คำอธิบาย' }
                ]
                : [
                    { name: 'standard_code', label: 'Standard Code', required: true },
                    { name: 'description', label: 'Description', required: true }
                ];

        return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem?.id ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'}</DialogTitle>
                        <DialogDescription>
                            กรอกข้อมูลด้านล่างแล้วคลิกบันทึก
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        {fields.map((field) => (
                            <div key={field.name} className="space-y-2">
                                <Label htmlFor={field.name}>{field.label}</Label>
                                <Input
                                    id={field.name}
                                    type="text"
                                    required={field.required}
                                    value={editingItem?.[field.name] || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, [field.name]: e.target.value })}
                                />
                            </div>
                        ))}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditingItem(null);
                                    setIsDialogOpen(false);
                                }}
                            >
                                ยกเลิก
                            </Button>
                            <Button type="submit">บันทึก</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-foreground">จัดการข้อมูลหลัก (Master Data)</h1>
                    <Button
                        onClick={() => {
                            setEditingItem({});
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        เพิ่มข้อมูล
                    </Button>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { key: 'companies', label: 'Companies' },
                            { key: 'tags', label: 'Tags' },
                            { key: 'scopes', label: 'Scopes' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'companies' && renderTable(companies, [
                            { key: 'name', label: 'ชื่อบริษัท' },
                            { key: 'contact_person', label: 'ผู้ติดต่อ' },
                            { key: 'phone', label: 'เบอร์โทร' }
                        ])}
                        {activeTab === 'tags' && renderTable(tags, [
                            { key: 'name', label: 'ชื่อ Tag' },
                            { key: 'description', label: 'คำอธิบาย' }
                        ])}
                        {activeTab === 'scopes' && renderTable(scopes, [
                            { key: 'standard_code', label: 'Standard Code' },
                            { key: 'description', label: 'Description' }
                        ])}
                    </>
                )}

                {renderForm()}
            </div>
    );
}
