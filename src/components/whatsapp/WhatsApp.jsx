import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsApp = () => {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* button */}
            <button
                onClick={togglePopup}
                className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
            >
                <FaWhatsapp size={30} />
            </button>

            {/* pop up */}
            {showPopup && (
                <div className="absolute bottom-14 right-0 bg-white p-3 shadow-lg rounded-lg w-64">
                    <p className="text-sm text-gray-700">Konsultasi ke WhatsApp</p>
                    <a
                        href="https://wa.me/62882003826565"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 bg-green-500 text-white py-2 px-4 text-center rounded-lg hover:bg-green-600"
                    >
                        Buka WhatsApp
                    </a>
                </div>
            )}
        </div>
    );
};

export default WhatsApp;