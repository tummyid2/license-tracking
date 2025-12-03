import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard - License Tracking System',
    description: 'Manage and track your licenses',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            noarchive: true,
            nosnippet: true,
        },
    },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
