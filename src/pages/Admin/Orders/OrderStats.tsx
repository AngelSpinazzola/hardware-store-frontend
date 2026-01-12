import { HiClipboardList, HiClock, HiCheckCircle, HiXCircle, HiCurrencyDollar } from 'react-icons/hi';

interface OrderStatsProps {
  totalOrders: number;
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
  totalRevenue: number;
}

export default function OrderStats({
  totalOrders,
  pendingPayments,
  approvedPayments,
  rejectedPayments,
  totalRevenue
}: OrderStatsProps) {
  const stats = [
    {
      title: 'Total Órdenes',
      value: totalOrders,
      icon: HiClipboardList,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Pagos Pendientes',
      value: pendingPayments,
      icon: HiClock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgLight: 'bg-yellow-50'
    },
    {
      title: 'Pagos Aprobados',
      value: approvedPayments,
      icon: HiCheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Pagos Rechazados',
      value: rejectedPayments,
      icon: HiXCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50'
    },
    {
      title: 'Ingresos Totales',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: HiCurrencyDollar,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgLight} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}