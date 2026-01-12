const ProfileInfo = () => {
    return (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Información sobre tu cuenta</h3>
            <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tu email se usa para el inicio de sesión y no puede ser modificado</li>
                <li>• Los cambios en tu información se reflejarán en futuras órdenes</li>
                <li>• Puedes gestionar múltiples direcciones de envío desde la pestaña "Mis Direcciones"</li>
                <li>• Todos los campos marcados con * son obligatorios</li>
            </ul>
        </div>
    );
};

export default ProfileInfo;
