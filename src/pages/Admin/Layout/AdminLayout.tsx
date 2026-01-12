import { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    sidebarOpen?: boolean;
    setSidebarOpen?: (open: boolean) => void;
}

export default function AdminLayout({
    children
}: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Contenido principal */}
            <main className="p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}