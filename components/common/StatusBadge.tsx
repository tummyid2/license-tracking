import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
    daysRemaining: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ daysRemaining }) => {
    if (daysRemaining < 0) {
        return (
            <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
                หมดอายุ ({Math.abs(daysRemaining)} วัน)
            </Badge>
        );
    } else if (daysRemaining <= 90) {
        return (
            <Badge className="bg-orange-600 hover:bg-orange-700">
                ใกล้หมด ({daysRemaining} วัน)
            </Badge>
        );
    } else {
        return (
            <Badge className="bg-green-600 hover:bg-green-700">
                ใช้งาน ({daysRemaining} วัน)
            </Badge>
        );
    }
};
