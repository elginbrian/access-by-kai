"use client";

import { useState } from "react";
import { PaymentFormData } from "@/components/hotels/payment/PaymentMethodsCard";

export interface UsePaymentFormOptions {
  onSuccess?: (data: PaymentFormData) => void;
  onError?: (error: string) => void;
  validateCard?: boolean;
}

export interface UsePaymentFormReturn {
  // Form data
  activeTab: string;
  formData: PaymentFormData;
  
  // Loading states
  isProcessing: boolean;
  isValidating: boolean;
  
  // Validation
  errors: Partial<PaymentFormData>;
  isValid: boolean;
  
  // Actions
  setActiveTab: (tab: string) => void;
  updateFormData: (field: keyof PaymentFormData, value: string) => void;
  applyPromoCode: () => Promise<boolean>;
  processPayment: () => Promise<boolean>;
  validateForm: () => boolean;
  resetForm: () => void;
}

const usePaymentForm = ({
  onSuccess,
  onError,
  validateCard = true
}: UsePaymentFormOptions = {}): UsePaymentFormReturn => {
  const [activeTab, setActiveTab] = useState<string>("card");
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    promoCode: ""
  });
  
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Update form data and clear errors for that field
  const updateFormData = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate individual fields
  const validateField = (field: keyof PaymentFormData, value: string): string | undefined => {
    switch (field) {
      case 'cardNumber':
        if (!value.trim()) return "Nomor kartu diperlukan";
        if (validateCard && value.replace(/\s/g, "").length < 13) return "Nomor kartu tidak valid";
        return undefined;
      
      case 'cardName':
        if (!value.trim()) return "Nama pemegang kartu diperlukan";
        if (value.trim().length < 2) return "Nama terlalu pendek";
        return undefined;
      
      case 'expiry':
        if (!value.trim()) return "Tanggal kadaluarsa diperlukan";
        if (!/^\d{2}\/\d{2}$/.test(value)) return "Format harus MM/YY";
        const [month, year] = value.split('/').map(Number);
        if (month < 1 || month > 12) return "Bulan tidak valid";
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          return "Kartu sudah kadaluarsa";
        }
        return undefined;
      
      case 'cvv':
        if (!value.trim()) return "CVV diperlukan";
        if (!/^\d{3,4}$/.test(value)) return "CVV harus 3-4 digit";
        return undefined;
      
      case 'promoCode':
        // Promo code is optional, no validation needed
        return undefined;
      
      default:
        return undefined;
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    if (activeTab !== 'card') return true; // Only validate card form
    
    const newErrors: Partial<PaymentFormData> = {};
    let isFormValid = true;

    // Validate required fields
    const requiredFields: (keyof PaymentFormData)[] = ['cardNumber', 'cardName', 'expiry', 'cvv'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  };

  // Apply promo code
  const applyPromoCode = async (): Promise<boolean> => {
    if (!formData.promoCode.trim()) return false;
    
    setIsValidating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate promo code validation
      const validPromoCodes = ['DISCOUNT10', 'SAVE20', 'WELCOME'];
      const isValidPromo = validPromoCodes.includes(formData.promoCode.toUpperCase());
      
      if (!isValidPromo) {
        setErrors(prev => ({ ...prev, promoCode: "Kode promo tidak valid" }));
        return false;
      }
      
      // Success
      setErrors(prev => ({ ...prev, promoCode: undefined }));
      return true;
    } catch (error) {
      setErrors(prev => ({ ...prev, promoCode: "Gagal memvalidasi kode promo" }));
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Process payment
  const processPayment = async (): Promise<boolean> => {
    if (!validateForm()) return false;
    
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        onSuccess?.(formData);
        return true;
      } else {
        const error = "Pembayaran gagal. Silakan coba lagi.";
        onError?.(error);
        return false;
      }
    } catch (error) {
      const errorMessage = "Terjadi kesalahan saat memproses pembayaran";
      onError?.(errorMessage);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
      promoCode: ""
    });
    setErrors({});
    setActiveTab("card");
  };

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 && 
    (activeTab !== 'card' || Boolean(formData.cardNumber && formData.cardName && formData.expiry && formData.cvv));

  return {
    // Form data
    activeTab,
    formData,
    
    // Loading states
    isProcessing,
    isValidating,
    
    // Validation
    errors,
    isValid,
    
    // Actions
    setActiveTab,
    updateFormData,
    applyPromoCode,
    processPayment,
    validateForm,
    resetForm
  };
};

export default usePaymentForm;