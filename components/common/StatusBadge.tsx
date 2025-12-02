import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
    daysRemaining: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ daysRemaining }) => {
    if (daysRemaining < 0) {
        return (
            <Badge className="bg-red-500/75 hover:bg-red-700/75 dark:text-white/80">
                หมดอายุ ({Math.abs(daysRemaining)} วัน)
            </Badge>
        );
    } else if (daysRemaining <= 90) {
        return (
            <Badge className="bg-orange-500/55 hover:bg-orange-700/55 text-foreground dark:text-white/80">
                ใกล้หมด ({daysRemaining} วัน)
            </Badge>
        );
    } else {
        return (
            <Badge className="bg-green-500/65 hover:bg-green-700/65 dark:text-white/80">
                ใช้งาน ({daysRemaining} วัน)
            </Badge>
        );
    }
};
