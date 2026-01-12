import type { OrderConfirmationDetail } from '../../types';

interface ShippingInfoProps {
    order: OrderConfirmationDetail;
}

const ShippingInfo = ({ order }: ShippingInfoProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="font-poppins text-lg font-semibold text-gray-800 mb-6">
                Información de envío
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Persona autorizada */}
                <div>
                    <h3 className="font-poppins text-base font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">Persona autorizada</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide">Nombre</p>
                            <p className="font-poppins text-sm text-gray-900 font-medium">
                                {order.authorizedPersonFirstName} {order.authorizedPersonLastName}
                            </p>
                        </div>
                        <div>
                            <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide">DNI</p>
                            <p className="font-poppins text-sm text-gray-900 font-medium">
                                {order.authorizedPersonDni}
                            </p>
                        </div>
                        <div>
                            <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide">Teléfono</p>
                            <p className="font-poppins text-sm text-gray-900 font-medium">
                                {order.authorizedPersonPhone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dirección */}
                <div>
                    <h3 className="font-poppins text-base font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">Dirección</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide">Dirección</p>
                            <p className="font-poppins text-sm text-gray-900 font-medium">
                                {order.shippingStreet} {order.shippingNumber}
                                {order.shippingFloor && `, Piso ${order.shippingFloor}`}
                                {order.shippingApartment && `, Dto ${order.shippingApartment}`}
                            </p>
                        </div>
                        <div>
                            <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide">Localidad</p>
                            <p className="font-poppins text-sm text-gray-900 font-medium">
                                {order.shippingCity}, {order.shippingProvince}
                            </p>
                        </div>
                        <div>
                            <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide">Código Postal</p>
                            <p className="font-poppins text-sm text-gray-900 font-medium">
                                {order.shippingPostalCode}
                            </p>
                        </div>
                        {order.shippingObservations && (
                            <div>
                                <p className="font-poppins text-xs text-gray-500 uppercase tracking-wide">Observaciones</p>
                                <p className="font-poppins text-sm text-gray-900 font-medium">
                                    {order.shippingObservations}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingInfo;
