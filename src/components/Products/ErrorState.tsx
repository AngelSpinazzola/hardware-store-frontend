interface ErrorStateProps {
    onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => (
    <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h3 className="text-xl font-light text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-6">No pudimos cargar los productos</p>
        <button
            onClick={onRetry}
            className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
        >
            Intentar de nuevo
        </button>
    </div>
);

export default ErrorState;