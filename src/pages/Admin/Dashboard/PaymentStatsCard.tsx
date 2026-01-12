import { Card, Badge } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiDocumentText } from 'react-icons/hi';

interface PaymentStatsCardProps {
    approved: number;
    pending: number;
    rejected: number;
}

export default function PaymentStatsCard({ approved, pending, rejected }: PaymentStatsCardProps) {
    const total = approved + pending + rejected;

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Estado de Pagos
                </h3>
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <HiDocumentText className="w-6 h-6 text-indigo-600" />
                </div>
            </div>

            <div className="space-y-3">
                {/* Aprobados */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-700">Aprobados</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge color="success" size="sm">
                            {total > 0 ? Math.round((approved / total) * 100) : 0}%
                        </Badge>
                        <span className="text-lg font-bold text-green-700">{approved}</span>
                    </div>
                </div>

                {/* Pendientes */}
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-700">Pendientes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge color="warning" size="sm">
                            {total > 0 ? Math.round((pending / total) * 100) : 0}%
                        </Badge>
                        <span className="text-lg font-bold text-yellow-700">{pending}</span>
                    </div>
                </div>

                {/* Rechazados */}
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-700">Rechazados</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge color="failure" size="sm">
                            {total > 0 ? Math.round((rejected / total) * 100) : 0}%
                        </Badge>
                        <span className="text-lg font-bold text-red-700">{rejected}</span>
                    </div>
                </div>
            </div>

            {/* CTA Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                    to="/admin/orders/pending-review"
                    className="w-full block text-center bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors"
                >
                    Gestionar Pagos
                </Link>
            </div>
        </Card>
    );
}