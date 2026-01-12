import Pagination from '../components/Common/Pagination';
import NavBar from '../components/Common/NavBar';
import EmptyOrders from '../components/Orders/EmptyOrders';
import OrderCard from '../components/Orders/OrderCard';
import { useMyOrders } from '../hooks/useMyOrders';

const MyOrders = () => {
  const {
    paginatedOrders,
    loading,
    error,
    pagination,
    totalPages,
    handlePageChange,
    handleCancelOrder,
    loadMyOrders,
    orders
  } = useMyOrders();

  return (
    <div className="min-h-screen bg-white pt-16">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-poppins text-xl sm:text-2xl font-semibold text-gray-800">Mis ordenes</h1>
          <div className="h-px bg-gray-300 w-full mt-2 mb-3"></div>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Historial completo de tus compras y estados de envío
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-poppins text-sm font-medium text-red-800">Error</h3>
                <p className="font-poppins text-sm text-red-700 mt-1 leading-relaxed">{error}</p>
                <button
                  onClick={loadMyOrders}
                  className="mt-2 font-poppins text-sm text-red-600 hover:text-red-500 font-medium"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de órdenes */}
        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <EmptyOrders />
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onCancelOrder={handleCancelOrder}
                    />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center sm:mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      showPages={5}
                      size="normal"
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
