import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

export interface UserFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  title: string;
  passengerName: string;
  idType: string;
  idNumber: string;
}

export function useBookingFormData() {
  const { user } = useAuth();

  const [userData, setUserData] = useState<UserFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    title: "Bapak",
    passengerName: "",
    idType: "KTP",
    idNumber: "",
  });

  useEffect(() => {
    if (user?.profile) {
      setUserData((prev) => ({
        ...prev,
        fullName: user.profile?.nama_lengkap || "",
        phoneNumber: user.profile?.nomor_telepon || "",
        email: user.email || "",
        passengerName: user.profile?.nama_lengkap || "",
        idType: user.profile?.tipe_identitas || "KTP",
        idNumber: "",
      }));
    }
  }, [user]);

  const updateBookerData = (data: Partial<Pick<UserFormData, "fullName" | "phoneNumber" | "email">>) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const updatePassengerData = (data: Partial<Pick<UserFormData, "title" | "passengerName" | "idType" | "idNumber">>) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const getBookerData = () => ({
    fullName: userData.fullName,
    phoneNumber: userData.phoneNumber,
    email: userData.email,
  });

  const getPassengerData = () => ({
    title: userData.title,
    passengerName: userData.passengerName,
    idType: userData.idType,
    idNumber: userData.idNumber,
  });

  return {
    userData,
    setUserData,
    updateBookerData,
    updatePassengerData,
    getBookerData,
    getPassengerData,
  };
}
