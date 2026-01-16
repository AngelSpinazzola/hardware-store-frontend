import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';

interface TopProductCardProps {
    rank: 1 | 2 | 3;
    productName: string;
    totalSold: number;
}

const cardConfig = {
    1: {
        icon: FaTrophy,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        badge: 'ORO',
        badgeBg: 'bg-yellow-100',
        badgeColor: 'text-yellow-700',
        rankColor: 'text-yellow-600'
    },
    2: {
        icon: FaMedal,
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        badge: 'PLATA',
        badgeBg: 'bg-gray-100',
        badgeColor: 'text-gray-700',
        rankColor: 'text-gray-600'
    },
    3: {
        icon: FaAward,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        badge: 'BRONCE',
        badgeBg: 'bg-orange-100',
        badgeColor: 'text-orange-700',
        rankColor: 'text-orange-600'
    }
};

export default function TopProductCard({ rank, productName, totalSold }: TopProductCardProps) {
    const config = cardConfig[rank];
    const Icon = config.icon;

    return (
        <div className={`bg-white rounded-lg p-4 sm:p-6 shadow-md h-full min-h-[160px] flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${config.iconBg}`}>
                        <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>
                    <span className={`text-base font-bold ${config.rankColor}`}>
                        #{rank}
                    </span>
                </div>
                <span className={`text-xs font-semibold ${config.badgeColor} ${config.badgeBg} px-2 py-1 rounded`}>
                    {config.badge}
                </span>
            </div>
            <p 
                className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 flex-1" 
                title={productName}
            >
                {productName || 'N/A'}
            </p>
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                    {totalSold.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">unidades vendidas</span>
            </div>
        </div>
    );
}