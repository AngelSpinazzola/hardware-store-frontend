import { HiChevronDown } from 'react-icons/hi';

interface MonthOption {
    value: string;
    label: string;
}

interface PeriodDropdownProps {
    months: MonthOption[];
    selectedMonth: string;
    onMonthChange: (month: string) => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
}

export default function PeriodDropdown({
    months,
    selectedMonth,
    onMonthChange,
    showDropdown,
    setShowDropdown
}: PeriodDropdownProps) {
    const selectedLabel = months.find(m => m.value === selectedMonth)?.label || 'Todos los meses';

    const handleMonthSelect = (monthValue: string) => {
        onMonthChange(monthValue);
        setShowDropdown(false);
    };

    return (
        <div className="relative mt-2 sm:mt-0">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 inline-flex items-center"
            >
                {selectedLabel}
                <HiChevronDown className="w-4 h-4 ml-1.5" />
            </button>

            {showDropdown && (
                <>
                    {/* Overlay para cerrar al hacer click fuera */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <ul className="py-2 text-sm text-gray-700 max-h-60 overflow-y-auto">
                            {months.map((month) => (
                                <li key={month.value}>
                                    <button
                                        onClick={() => handleMonthSelect(month.value)}
                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                            selectedMonth === month.value 
                                                ? 'bg-indigo-50 text-indigo-600 font-medium' 
                                                : ''
                                        }`}
                                    >
                                        {month.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}