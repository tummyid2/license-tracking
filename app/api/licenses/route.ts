import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ComputedLicenseData } from '@/types';
import { formatDate } from '@/utils/dateUtils';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('licenses')
            .select(`
        *,
        companies (id, name),
        tags (id, name),
        scopes (id, standard_code, description)
      `)
            .order('valid_until', { ascending: true });

        if (error) throw error;

        // Transform data to match ComputedLicenseData interface
        const computedData: ComputedLicenseData[] = (data as any[]).map((license) => {
            const validUntil = new Date(license.valid_until);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const daysRemaining = Math.ceil((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            let computedStatus: 'Active' | 'Expiring Soon' | 'Expired' = 'Active';
            if (daysRemaining < 0) computedStatus = 'Expired';
            else if (daysRemaining <= 90) computedStatus = 'Expiring Soon';

            return {
                id: license.id,
                registrationNo: license.registration_no,
                company: license.companies?.name || license.company || 'Unknown',
                tag: license.tags?.name || license.tag || '-',
                standardScope: license.scopes?.standard_code || license.standard_scope || '-',
                criteriaScope: license.scopes?.description || license.criteria_scope || '-',
                certificationAuthority: license.certification_authority || '-',
                effectiveDate: formatDate(license.effective_date),
                validUntil: formatDate(license.valid_until),
                status: license.status || computedStatus,
                daysRemaining,
                computedStatus,

                // Include IDs for editing
                companyId: license.companies?.id,
                tagId: license.tags?.id,
                scopeId: license.scopes?.id
            };
        });

        return NextResponse.json(computedData);
    } catch (error) {
        console.error('Error fetching licenses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
