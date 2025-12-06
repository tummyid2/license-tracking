"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Loader2, AlertCircle, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NotificationLog {
  id: number;
  license_id: string; // Assuming UUID string, mapped to some info if needed
  notification_type: string;
  status: string;
  sent_at: string;
  message_preview: string;
  error_message?: string;
}

interface Metadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function NotificationHistoryPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?page=${page}&limit=20`);
      if (res.ok) {
        const result = await res.json();
        setLogs(result.data);
        setMetadata(result.metadata);
      }
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบประวัติการแจ้งเตือนทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      return;
    }

    try {
      const res = await fetch('/api/notifications', { method: 'DELETE' });
      if (res.ok) {
        alert("ล้างประวัติเรียบร้อยแล้ว");
        fetchLogs(1);
      } else {
        alert("ไม่สามารถล้างประวัติได้");
      }
    } catch (error) {
      console.error("Error clearing history:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "15_days":
        return <Badge variant="destructive">ด่วน (15 วัน)</Badge>;
      case "30_days":
        return <Badge className="bg-orange-500 hover:bg-orange-600">แจ้งเตือน (30 วัน)</Badge>;
      case "45_days":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">ล่วงหน้า (45 วัน)</Badge>;
      case "90_days":
        return <Badge variant="secondary">ล่วงหน้า (90 วัน)</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <span role="img" aria-label="history">📜</span> ประวัติการส่งแจ้งเตือน
          </CardTitle>
          <Button variant="destructive" size="sm" onClick={handleClearHistory} disabled={logs.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            ล้างประวัติ
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              ไม่พบประวัติการแจ้งเตือน
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>วันที่ส่ง</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>ข้อความ</TableHead>
                      <TableHead>License ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(log.sent_at), "dd MMM yyyy HH:mm", {
                            locale: th,
                          })}
                        </TableCell>
                        <TableCell>{getTypeBadge(log.notification_type)}</TableCell>
                        <TableCell>
                          {log.status === "success" ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle2 className="mr-1 h-4 w-4" /> สำเร็จ
                            </div>
                          ) : (
                            <div className="flex items-center text-destructive">
                              <XCircle className="mr-1 h-4 w-4" /> ล้มเหลว
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate" title={log.message_preview}>
                          {log.message_preview}
                          {log.error_message && (
                            <div className="text-xs text-destructive mt-1">
                              Error: {log.error_message}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {log.license_id?.substring(0, 8)}...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {metadata && metadata.totalPages > 1 && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchLogs(metadata.page - 1)}
                    disabled={metadata.page <= 1}
                  >
                    ก่อนหน้า
                  </Button>
                  <span className="flex items-center text-sm">
                    หน้า {metadata.page} จาก {metadata.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchLogs(metadata.page + 1)}
                    disabled={metadata.page >= metadata.totalPages}
                  >
                    ถัดไป
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
