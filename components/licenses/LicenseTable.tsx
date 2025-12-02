import React from 'react';
import { ComputedLicenseData } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LicenseTableProps {
  data: ComputedLicenseData[];
  groupBy: 'none' | 'company' | 'tag';
  onEdit?: (license: ComputedLicenseData) => void;
  onDelete?: (id: string) => void;
}

export const LicenseTable: React.FC<LicenseTableProps> = ({ data, groupBy, onEdit, onDelete }) => {

  const renderTable = (items: ComputedLicenseData[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registration No.</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Tag / Scope</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
            {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="text-blue-600 dark:text-blue-400">{item.registrationNo}</div>
                <div className="text-xs text-muted-foreground">{item.certificationAuthority}</div>
              </TableCell>
              <TableCell>{item.company}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className="w-fit">
                    {item.tag}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.standardScope} - {item.criteriaScope}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">Valid: {item.validUntil}</div>
                <div className="text-xs text-muted-foreground">Effective: {item.effectiveDate}</div>
              </TableCell>
              <TableCell>
                <StatusBadge daysRemaining={item.daysRemaining} />
              </TableCell>
              {(onEdit || onDelete) && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (groupBy === 'none') {
    return renderTable(data);
  }

  // Grouping Logic
  const grouped = data.reduce((acc, item) => {
    const key = groupBy === 'company' ? item.company : item.tag;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ComputedLicenseData[]>);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([groupTitle, items]) => (
        <div key={groupTitle} className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg flex items-center gap-2">
              {groupBy === 'company' ? '🏢' : '🏷️'} {groupTitle}
            </h3>
            <Badge variant="secondary">{(items as ComputedLicenseData[]).length} items</Badge>
          </div>
          {renderTable(items as ComputedLicenseData[])}
        </div>
      ))}
    </div>
  );
};