'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Company, Tag, Scope, ComputedLicenseData } from '@/types';

const formSchema = z.object({
    registration_no: z.string().min(1, "กรุณาระบุเลขทะเบียน"),
    company_id: z.string().min(1, "กรุณาเลือกบริษัท"),
    tag_id: z.string().min(1, "กรุณาเลือก Tag"),
    scope_id: z.string().min(1, "กรุณาเลือก Scope"),
    certification_authority: z.string().min(1, "กรุณาระบุหน่วยรับรอง"),
    effective_date: z.date({
        message: "กรุณาระบุวันที่เริ่มต้น",
    }),
    valid_until: z.date({
        message: "กรุณาระบุวันหมดอายุ",
    }),
    status: z.enum(["Active", "Inactive", "Pending"]),
    remark: z.string().optional(),
});

interface LicenseFormProps {
    onClose: () => void;
    onSuccess: () => void;
    editData?: ComputedLicenseData | null;
}

export function LicenseForm({ onClose, onSuccess, editData }: LicenseFormProps) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [scopes, setScopes] = useState<Scope[]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            registration_no: '',
            company_id: '',
            tag_id: '',
            scope_id: '',
            certification_authority: '',
            status: 'Active',
            remark: '',
        },
    });

    useEffect(() => {
        const fetchOptions = async () => {
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
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        if (editData) {
            form.reset({
                registration_no: editData.registrationNo,
                company_id: editData.companyId,
                tag_id: editData.tagId,
                scope_id: editData.scopeId,
                certification_authority: editData.certificationAuthority,
                effective_date: editData.effectiveDate ? new Date(editData.effectiveDate.split('/').reverse().join('-')) : undefined,
                valid_until: editData.validUntil ? new Date(editData.validUntil.split('/').reverse().join('-')) : undefined,
                status: editData.status as "Active" | "Inactive" | "Pending",
                remark: editData.remark || '',
            });
        }
    }, [editData, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                effective_date: format(values.effective_date, 'yyyy-MM-dd'),
                valid_until: format(values.valid_until, 'yyyy-MM-dd'),
            };

            const url = editData
                ? `/api/licenses/${editData.id}`
                : '/api/licenses/create';
            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editData ? 'แก้ไขใบอนุญาต' : 'เพิ่มใบอนุญาตใหม่'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="registration_no"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>เลขทะเบียน</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SG-20-013" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="company_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>บริษัท</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="เลือกบริษัท" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {companies.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tag_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tag</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="เลือก Tag" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {tags.map((t) => (
                                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="certification_authority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>หน่วยรับรอง</FormLabel>
                                        <FormControl>
                                            <Input placeholder="กรมวิชาการเกษตร" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="scope_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Scope</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือก Scope" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {scopes.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.standard_code} - {s.description}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="effective_date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>วันที่เริ่มต้น</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="valid_until"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>วันหมดอายุ</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>สถานะ</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="เลือกสถานะ" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="remark"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>หมายเหตุ</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="หมายเหตุเพิ่มเติม..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={onClose}>
                                ยกเลิก
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editData ? 'บันทึกการแก้ไข' : 'เพิ่มใบอนุญาต'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
