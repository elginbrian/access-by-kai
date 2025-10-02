import React from "react";
import { colors } from "@/app/design-system/colors";

interface LoadingScreenProps {
  message: string;
  submessage?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message, submessage }) => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.violet.light }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">{message}</p>
        {submessage && <p className="text-sm text-gray-500">{submessage}</p>}
      </div>
    </div>
  );
};

export default LoadingScreen;
