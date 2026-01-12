import { Card } from "flowbite-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    onClick?: () => void;
    icon?: React.ReactNode;
}

export default function StatsCard({
    title,
    value,
    onClick,
    icon
}: StatsCardProps) {
    return (
        <Card
            className="bg-white cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                        {title}
                    </p>
                    <p className="text-2xl sm:text-2xl font-normal text-gray-900">
                        {value}
                    </p>
                </div>
                {icon && (
                    <div className="w-8 h-8 text-blue-500">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}
