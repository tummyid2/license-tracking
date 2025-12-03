import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface NotificationRequest {
    licenses?: Array<{
        id: string;
        registrationNo: string;
        company: string;
        validUntil: string;
        daysRemaining: number;
        computedStatus: string;
    }>;
    force?: boolean;
}

// Helper: Get notification count this month
async function getNotificationCountThisMonth() {
    const supabase = await createClient();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
        .from('notification_logs')
        .select('*', { count: 'exact', head: true })
        .gte('sent_at', startOfMonth.toISOString())
        .eq('status', 'success');

    return count || 0;
}

// Helper: Check if license was notified recently
async function wasNotifiedRecently(licenseId: string, notificationType: string) {
    const supabase = await createClient();
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const { data } = await supabase
        .from('notification_logs')
        .select('id')
        .eq('license_id', licenseId)
        .eq('notification_type', notificationType)
        .eq('status', 'success')
        .gte('sent_at', fifteenDaysAgo.toISOString())
        .limit(1);

    return data && data.length > 0;
}

// Helper: Determine notification type based on days remaining (1-90 days only)
function getNotificationType(daysRemaining: number): string {
    if (daysRemaining <= 15) return '15_days';
    if (daysRemaining <= 30) return '30_days';
    if (daysRemaining <= 45) return '45_days';
    if (daysRemaining <= 90) return '90_days';
    return 'manual';
}

// Helper: Format message
function formatMessage(licenses: any[], type: string): string {
    const emoji = type === '15_days' ? '🔴' : type === '30_days' ? '🟠' : type === '45_days' ? '🟡' : '🔵';
    const urgency = type === '15_days' ? 'ด่วนมาก!' : type === '30_days' ? 'แจ้งเตือน' : type === '45_days' ? 'แจ้งเตือนล่วงหน้า' : 'แจ้งเตือนล่วงหน้า (90 วัน)';

    let message = `${emoji} ${urgency}: ใบอนุญาตใกล้หมดอายุ\n\n`;

    licenses.forEach((license, index) => {
        const validUntilDate = new Date(license.validUntil);
        const dateStr = !isNaN(validUntilDate.getTime())
            ? validUntilDate.toLocaleDateString('th-TH')
            : license.validUntil || 'ไม่ระบุวันที่';

        message += `${index + 1}. ${license.registrationNo}\n`;
        message += `   บริษัท: ${license.company}\n`;
        message += `   หมดอายุ: ${dateStr}\n`;
        message += `   เหลือ: ${license.daysRemaining} วัน\n\n`;
    });

    if (type === '15_days') {
        message += '⚠️ กรุณาดำเนินการต่ออายุทันที!';
    } else if (type === '30_days') {
        message += '📌 ควรเตรียมการต่ออายุ';
    }

    return message.trim();
}

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'กรุณาเข้าสู่ระบบก่อนส่งการแจ้งเตือน' },
                { status: 401 }
            );
        }

        const body: NotificationRequest = await req.json();
        const { licenses = [], force = false } = body;

        if (!licenses || licenses.length === 0) {
            return NextResponse.json(
                { error: 'No licenses provided' },
                { status: 400 }
            );
        }

        // Check quota
        const monthlyCount = await getNotificationCountThisMonth();
        const MONTHLY_LIMIT = 300;

        if (monthlyCount >= MONTHLY_LIMIT && !force) {
            return NextResponse.json(
                {
                    error: 'quota_exceeded',
                    message: 'Monthly quota exceeded (300 messages)',
                    quotaUsed: monthlyCount,
                    quotaLimit: MONTHLY_LIMIT,
                },
                { status: 429 }
            );
        }

        // Filter licenses that need notification (1-90 days only)
        const licensesToNotify = [];
        for (const license of licenses) {
            // Only process licenses with 1-90 days remaining
            if (license.daysRemaining >= 1 && license.daysRemaining <= 90) {
                const notificationType = getNotificationType(license.daysRemaining);
                const wasNotified = await wasNotifiedRecently(license.id, notificationType);

                if (!wasNotified) {
                    licensesToNotify.push({ ...license, notificationType });
                }
            }
        }

        if (licensesToNotify.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No new notifications needed (already sent within 15 days or no licenses in 1-90 day range)',
                licensesNotified: 0,
                messagesSent: 0,
                quotaRemaining: MONTHLY_LIMIT - monthlyCount,
            });
        }

        // Group by notification type
        const grouped: Record<string, any[]> = {};
        licensesToNotify.forEach((license) => {
            const type = license.notificationType;
            if (!grouped[type]) grouped[type] = [];
            grouped[type].push(license);
        });

        // Send notifications
        let messagesSent = 0;
        const logEntries = [];

        for (const [type, typedLicenses] of Object.entries(grouped)) {
            const message = formatMessage(typedLicenses, type);

            // Send to LINE
            const lineResponse = await fetch('https://api.line.me/v2/bot/message/broadcast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
                },
                body: JSON.stringify({
                    messages: [{ type: 'text', text: message }],
                }),
            });

            const success = lineResponse.ok;
            messagesSent += success ? 1 : 0;

            // Log each license
            for (const license of typedLicenses) {
                logEntries.push({
                    license_id: license.id,
                    notification_type: type,
                    status: success ? 'success' : 'failed',
                    message_preview: message.substring(0, 200),
                    error_message: success ? null : await lineResponse.text(),
                });
            }
        }

        // Save logs
        if (logEntries.length > 0) {
            await supabase.from('notification_logs').insert(logEntries);
        }

        return NextResponse.json({
            success: true,
            licensesNotified: licensesToNotify.length,
            messagesSent,
            quotaRemaining: MONTHLY_LIMIT - monthlyCount - messagesSent,
            quotaWarning: monthlyCount + messagesSent > MONTHLY_LIMIT * 0.8,
        });
    } catch (error) {
        console.error('Error sending LINE notification:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
