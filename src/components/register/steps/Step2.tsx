import React from "react";
import InputField from "../../input/InputField";
import { colors } from "../../../app/design-system/colors";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RegisterForm } from "@/lib/validators/auth";

interface Step2Props {
  register: UseFormRegister<RegisterForm>;
  errors: FieldErrors<RegisterForm>;
}

const Step2: React.FC<Step2Props> = ({ register, errors }) => (
  <>
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "medium", color: colors.violet.dark }}>Password</label>
      <InputField
        startIcon={<img src="/ic_key_lock.svg" alt="Password Icon" style={{ width: 16, height: 16 }} />}
        type="password"
        label="Masukkan password"
        {...register("password")}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: `1px solid ${errors.password ? "#ef4444" : colors.violet.normal}`,
        }}
      />
      {errors.password && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.password.message}</span>}
    </div>

    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "medium", color: colors.violet.dark }}>Konfirmasi Password</label>
      <InputField
        startIcon={<img src="/ic_key_lock.svg" alt="Confirm Password Icon" style={{ width: 16, height: 16 }} />}
        type="password"
        label="Konfirmasi password"
        {...register("confirmPassword")}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: `1px solid ${errors.confirmPassword ? "#ef4444" : colors.violet.normal}`,
        }}
      />
      {errors.confirmPassword && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.confirmPassword.message}</span>}
    </div>
  </>
);

export default Step2;
