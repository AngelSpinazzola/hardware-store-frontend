import { orderService } from "../../services/orderService";
import type { TimelineStep } from "../../utils/orderTimeline";

interface OrderTimelineProps {
    steps: TimelineStep[];
}

const OrderTimeline = ({ steps }: OrderTimelineProps) => {
    // Encontrar el índice del paso actual
    const currentStepIndex = steps.findIndex((step) => step.current);
    const currentStep = steps[currentStepIndex];
    const stepNumber = currentStepIndex + 1;
    const totalSteps = steps.length;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="font-poppins text-lg font-semibold text-gray-900 mb-6">
                Estado de la orden
            </h2>

            {/* Desktop Timeline - Horizontal */}
            <div className="hidden md:block">
                <div className="relative">
                    <div className="flex justify-between">
                        {steps.map((step, index) => (
                            <div
                                key={step.key}
                                className="flex flex-col items-center text-center relative flex-1"
                            >
                                <div
                                    className={`
                                    relative w-10 h-10 rounded-full border-2 flex items-center justify-center z-10
                                    ${
                                        step.completed
                                            ? "bg-green-100 text-green-600 border-green-200"
                                            : step.current
                                            ? "bg-indigo-100 text-indigo-600 border-indigo-200"
                                            : "bg-gray-100 text-gray-400 border-gray-200"
                                    }
                                `}
                                >
                                    {step.icon}
                                </div>

                                {index < steps.length - 1 && (
                                    <div
                                        className={`
                                        absolute top-5 left-1/2 w-full h-0.5 -z-0
                                        ${
                                            step.completed
                                                ? "bg-green-200"
                                                : "bg-gray-200"
                                        }
                                    `}
                                        style={{ transform: "translateX(50%)" }}
                                    />
                                )}

                                <div className="mt-3 max-w-28">
                                    <p
                                        className={`font-poppins text-sm font-medium ${
                                            step.completed
                                                ? "text-green-700"
                                                : step.current
                                                ? "text-indigo-700"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {step.title}
                                    </p>
                                    <p
                                        className={`font-poppins text-xs mt-1 ${
                                            step.completed
                                                ? "text-green-600"
                                                : step.current
                                                ? "text-indigo-600"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {step.description}
                                    </p>
                                    {step.date && (
                                        <p className="font-poppins text-xs text-gray-500 mt-1">
                                            Actualizado {orderService.formatDate(step.date)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                </div>
            </div>

            {/* Mobile Timeline - Contador compacto estilo minimalista */}
            <div className="md:hidden">
                {currentStep && (
                    <div className="relative">
                        {/* Contenido */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-poppins text-lg font-semibold text-gray-700 mb-1">
                                    {currentStep.title}
                                </h4>
                                <p className="font-poppins text-sm text-gray-700">
                                    {currentStep.description}
                                </p>
                                {currentStep.date && (
                                    <p className="font-poppins text-xs text-gray-700 mt-2">
                                        Actualizado {orderService.formatDate(
                                            currentStep.date
                                        )}
                                    </p>
                                )}
                            </div>

                            {/* Contador circular */}
                            <div className="ml-4 flex-shrink-0">
                                <div className="relative w-14 h-14">
                                    {/* Círculo de fondo */}
                                    <svg className="w-14 h-14 -rotate-90">
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            stroke="#e5e7eb"
                                            strokeWidth="3"
                                            fill="none"
                                        />
                                        {/* Círculo de progreso */}
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            stroke="#22c55e"
                                            strokeWidth="3"
                                            fill="none"
                                            strokeDasharray={`${
                                                2 * Math.PI * 24
                                            }`}
                                            strokeDashoffset={`${
                                                2 *
                                                Math.PI *
                                                24 *
                                                (1 - stepNumber / totalSteps)
                                            }`}
                                            className="transition-all duration-300"
                                        />
                                    </svg>
                                    {/* Texto del contador */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="font-poppins text-sm font-semibold text-gray-900">
                                            {stepNumber}/{totalSteps}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default OrderTimeline;
