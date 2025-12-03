'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
    searchQuery: string;
    searchType: 'registration' | 'company' | 'tag';
    onSearchQueryChange: (query: string) => void;
    onSearchTypeChange: (type: 'registration' | 'company' | 'tag') => void;
    resultCount?: number;
    totalCount?: number;
}

export function SearchBar({
    searchQuery,
    searchType,
    onSearchQueryChange,
    onSearchTypeChange,
    resultCount,
    totalCount,
}: SearchBarProps) {
    const handleClear = () => {
        onSearchQueryChange('');
    };

    const getPlaceholder = () => {
        switch (searchType) {
            case 'registration':
                return 'ค้นหาเลขทะเบียน (เช่น SG-20-013)';
            case 'company':
                return 'ค้นหาชื่อบริษัท';
            case 'tag':
                return 'ค้นหาหมวดหมู่ (SG, DOA, EU, JP)';
            default:
                return 'ค้นหา...';
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Type Selector */}
                <Select value={searchType} onValueChange={(value: any) => onSearchTypeChange(value)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="registration">
                            <div className="flex items-center gap-2">
                                <span>🔍</span>
                                <span>เลขทะเบียน</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="company">
                            <div className="flex items-center gap-2">
                                <span>🏢</span>
                                <span>บริษัท</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="tag">
                            <div className="flex items-center gap-2">
                                <span>🏷️</span>
                                <span>หมวดหมู่</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={getPlaceholder()}
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Results Count */}
            {searchQuery && resultCount !== undefined && totalCount !== undefined && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">
                        {resultCount} จาก {totalCount} รายการ
                    </Badge>
                    {resultCount === 0 && <span>ไม่พบผลลัพธ์ที่ต้องการ</span>}
                </div>
            )}
        </div>
    );
}
