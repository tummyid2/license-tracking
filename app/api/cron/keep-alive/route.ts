import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';

/**
 * Keep-Alive Cron Job
 * 
 * ป้องกัน Supabase Free Tier จากการถูก pause
 * โดยจะ ping database ทุก 3 วัน เพื่อให้ project ยังคง active อยู่
 * 
 * Supabase Free Tier จะ pause project หลังจากไม่มีการใช้งาน 7 วัน
 */
export async function GET() {
    try {
        const supabase = getServiceSupabase();
        
        // ทำ simple query เพื่อให้ Supabase รู้ว่ายังมีการใช้งานอยู่
        const { data, error } = await supabase
            .from('licenses')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('[Keep-Alive] Database query failed:', error);
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'Keep-alive ping failed', 
                    error: error.message,
                    timestamp: new Date().toISOString()
                },
                { status: 500 }
            );
        }
        
        console.log('[Keep-Alive] Supabase ping successful at', new Date().toISOString());
        
        return NextResponse.json({
            success: true,
            message: 'Supabase keep-alive ping successful',
            timestamp: new Date().toISOString(),
            recordsChecked: data?.length || 0
        });
        
    } catch (error) {
        console.error('[Keep-Alive] Unexpected error:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Keep-alive failed with unexpected error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
