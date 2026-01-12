import novatechLogo from "../../assets/nova-tech.png";
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import {
    FaFacebook,
    FaInstagram,
    FaYoutube,
    FaTwitter,
    FaWhatsapp,
} from "react-icons/fa";

export const Footer = () => {
    return (
        <div>
            {/* Footer */}
            <footer className="nova-bg-primary relative overflow-hidden">
                <div className="relative z-10">
                    {/* Contenido principal */}
                    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:py-12">
                        {/* Grid principal con más espacio entre columnas */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 mb-12">
                            {/* Logo y descripción */}
                            <div className="md:col-span-4 text-left">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 flex items-center justify-center">
                                        <img
                                            src={novatechLogo}
                                            alt="Logo NOVATECH"
                                            className="w-10 h-10 object-contain"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xl tracking-tight text-white font-bold drop-shadow-lg">
                                            <span className="font-semibold">
                                                NOVA
                                            </span>{" "}
                                            <span className="font-semibold text-orange-400">
                                                TECH
                                            </span>
                                        </div>
                                        <div className="text-xs font-normal text-white tracking-wider uppercase drop-shadow-sm -mt-1">
                                            HARDWARE STORE
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-100 text-sm leading-relaxed max-w-xs">
                                    Tu tienda especializada en hardware gaming
                                    de alta gama. Construimos el futuro del
                                    gaming en Argentina.
                                </p>
                            </div>
                            {/* Contacto - ocupa 4 columnas, empujado a la derecha */}
                            <div className="md:col-span-4 text-left md:pl-20">
                                <h3 className="text-white font-bold text-lg mb-4">
                                    Contacto
                                </h3>
                                <ul className="space-y-3 text-gray-300 text-sm">
                                    <li className="flex items-start space-x-3">
                                        <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
                                        <span className="text-left text-gray-300">
                                            Av. Corrientes 1234, CABA
                                            <br />
                                            Buenos Aires, Argentina
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <PhoneIcon className="w-5 h-5 flex-shrink-0 text-white" />
                                        <a
                                            href="tel:+541112345678"
                                            className="hover:text-white transition-colors text-gray-300"
                                        >
                                            +54 11 1234-5678
                                        </a>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <FaWhatsapp className="w-5 h-5 flex-shrink-0 text-white" />
                                        <a
                                            href="https://wa.me/541112345678"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-white transition-colors text-gray-300"
                                        >
                                            +54 11 1234-5678
                                        </a>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <EnvelopeIcon className="w-5 h-5 flex-shrink-0 text-white" />
                                        <a
                                            href="mailto:info@novatech.com.ar"
                                            className="hover:text-white transition-colors text-gray-300"
                                        >
                                            info@novatech.com.ar
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Horarios - ocupa 4 columnas, empujado a la derecha */}
                            <div className="md:col-span-4 text-left md:pl-20">
                                <h3 className="text-white font-bold text-lg mb-4">
                                    Horarios de Atención
                                </h3>
                                <ul className="space-y-3 text-gray-300 text-sm">
                                    <li className="flex items-start space-x-3">
                                        <ClockIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-200">
                                                Lunes a Viernes
                                            </p>
                                            <p className="text-gray-300">
                                                9:00 - 19:00 hs
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <ClockIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-200">
                                                Sábados
                                            </p>
                                            <p className="text-gray-300">
                                                10:00 - 14:00 hs
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <ClockIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-white opacity-50" />
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-200">
                                                Domingos
                                            </p>
                                            <p className="text-gray-300">
                                                Cerrado
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Separador */}
                        <hr className="my-8 border-gray-700" />

                        {/* Bottom section */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <span className="text-sm text-gray-300 text-center sm:text-left">
                                © 2025{" "}
                                <span className="font-semibold">
                                    <span className="text-white">NOVA</span>
                                    <span className="nova-text-orange">
                                        TECH
                                    </span>
                                </span>
                                . Todos los derechos reservados.
                            </span>

                            {/* Redes sociales */}
                            <div className="flex space-x-4">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-110"
                                    aria-label="Facebook"
                                >
                                    <FaFacebook className="w-5 h-5" />
                                </a>

                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-pink-500 transition-colors transform hover:scale-110"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram className="w-5 h-5" />
                                </a>

                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110"
                                    aria-label="Twitter"
                                >
                                    <FaTwitter className="w-5 h-5" />
                                </a>

                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-red-500 transition-colors transform hover:scale-110"
                                    aria-label="YouTube"
                                >
                                    <FaYoutube className="w-5 h-5" />
                                </a>

                                <a
                                    href="https://wa.me/541112345678"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-green-500 transition-colors transform hover:scale-110"
                                    aria-label="WhatsApp"
                                >
                                    <FaWhatsapp className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
