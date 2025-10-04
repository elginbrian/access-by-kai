import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key-change-in-production";

export class SecureStorage {
  private static encrypt(text: string): string {
    try {
      return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  private static decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        throw new Error("Failed to decrypt data");
      }

      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt data");
    }
  }

  static setItem(key: string, value: any): void {
    try {
      const stringValue = JSON.stringify(value);
      const encryptedValue = this.encrypt(stringValue);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error("SecureStorage setItem error:", error);
      throw new Error(`Failed to store ${key}`);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const encryptedValue = localStorage.getItem(key);

      if (!encryptedValue) {
        return null;
      }

      const decryptedValue = this.decrypt(encryptedValue);
      return JSON.parse(decryptedValue) as T;
    } catch (error) {
      console.error("SecureStorage getItem error:", error);

      localStorage.removeItem(key);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("SecureStorage removeItem error:", error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("SecureStorage clear error:", error);
    }
  }

  static hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error("SecureStorage hasItem error:", error);
      return false;
    }
  }

  static getAllKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error("SecureStorage getAllKeys error:", error);
      return [];
    }
  }
}

export class BookingSecureStorage {
  private static readonly BOOKING_DATA_KEY = "central-booking-data";
  private static readonly FORM_DATA_KEY = "booking-form-data";
  private static readonly SEAT_SELECTION_KEY = "seat-selection-data";

  static setBookingData(data: any): void {
    SecureStorage.setItem(this.BOOKING_DATA_KEY, {
      ...data,
      timestamp: Date.now(),
      version: "1.0",
    });
  }

  static getBookingData(): any | null {
    const data = SecureStorage.getItem<any>(this.BOOKING_DATA_KEY);

    if (!data) {
      return null;
    }

    const maxAge = 6 * 60 * 1000;
    if (data.timestamp && Date.now() - data.timestamp > maxAge) {
      this.clearBookingData();
      return null;
    }

    return data;
  }

  static setFormData(data: any): void {
    SecureStorage.setItem(this.FORM_DATA_KEY, {
      ...data,
      timestamp: Date.now(),
    });
  }

  static getFormData(): any | null {
    return SecureStorage.getItem<any>(this.FORM_DATA_KEY);
  }

  static setSeatData(data: any): void {
    SecureStorage.setItem(this.SEAT_SELECTION_KEY, {
      ...data,
      timestamp: Date.now(),
    });
  }

  static getSeatData(): any | null {
    const data = SecureStorage.getItem<any>(this.SEAT_SELECTION_KEY);
    if (!data) return null;

    // expire seat selection data after 6 minutes as well
    const maxAge = 6 * 60 * 1000;
    if (data.timestamp && Date.now() - data.timestamp > maxAge) {
      SecureStorage.removeItem(this.SEAT_SELECTION_KEY);
      return null;
    }

    return data;
  }

  static clearBookingData(): void {
    SecureStorage.removeItem(this.BOOKING_DATA_KEY);
    SecureStorage.removeItem(this.FORM_DATA_KEY);
    SecureStorage.removeItem(this.SEAT_SELECTION_KEY);
  }

  static hasValidBookingData(): boolean {
    const data = this.getBookingData();
    return data !== null && data.journey && data.booker;
  }
}

export function useSecureStorage() {
  const setSecureItem = (key: string, value: any) => {
    try {
      SecureStorage.setItem(key, value);
    } catch (error) {
      console.error("useSecureStorage setItem error:", error);
    }
  };

  const getSecureItem = <T>(key: string): T | null => {
    try {
      return SecureStorage.getItem<T>(key);
    } catch (error) {
      console.error("useSecureStorage getItem error:", error);
      return null;
    }
  };

  const removeSecureItem = (key: string) => {
    try {
      SecureStorage.removeItem(key);
    } catch (error) {
      console.error("useSecureStorage removeItem error:", error);
    }
  };

  return {
    setSecureItem,
    getSecureItem,
    removeSecureItem,
  };
}

export default SecureStorage;
