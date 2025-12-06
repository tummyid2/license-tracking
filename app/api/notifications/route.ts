import { NextRequest, NextResponse } from 'next/server';
import { createClient, getServiceSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        const { data, count, error } = await supabase
            .from('notification_logs')
            .select('*', { count: 'exact' })
            .order('sent_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({
            data,
            metadata: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching notification logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest) {
    try {
        const supabase = getServiceSupabase();

        // Use a always-true condition for timestamp to delete all logs
        const { error } = await supabase
            .from('notification_logs')
            .delete()
            .gte('sent_at', '2000-01-01');

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error clearing logs:', error);
        return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
    }
}
