import React from "react";
import { colors } from "@/app/design-system/colors";

interface ErrorScreenProps {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ title, message, actionLabel, onAction }) => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.violet.light }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button onClick={onAction} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;
