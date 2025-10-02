import React from "react";
import { colors } from "@/app/design-system/colors";

interface AuthRequiredScreenProps {
  onLoginClick: () => void;
}

const AuthRequiredScreen: React.FC<AuthRequiredScreenProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.violet.light }}>
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Autentikasi Diperlukan</h2>
        <p className="text-gray-600 mb-4">Silakan login untuk melanjutkan pemesanan Anda</p>
        <button onClick={onLoginClick} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Masuk
        </button>
      </div>
    </div>
  );
};

export default AuthRequiredScreen;
