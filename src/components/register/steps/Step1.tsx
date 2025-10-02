import React from "react";
import InputField from "../../input/InputField";
import { colors } from "../../../app/design-system/colors";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { RegisterForm } from "@/lib/validators/auth";

interface Step1Props {
  register: UseFormRegister<RegisterForm>;
  errors: FieldErrors<RegisterForm>;
}

const Step1: React.FC<Step1Props> = ({ register, errors }) => (
  <>
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "medium", color: colors.violet.dark }}>Nama Lengkap</label>
      <InputField
        startIcon={<img src="/ic_person.svg" alt="Person Icon" style={{ width: 16, height: 16 }} />}
        type="text"
        label="Masukkan nama lengkap"
        {...register("nama_lengkap")}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: `1px solid ${errors.nama_lengkap ? "#ef4444" : colors.violet.normal}`,
        }}
      />
      {errors.nama_lengkap && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.nama_lengkap.message}</span>}
    </div>

    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "medium", color: colors.violet.dark }}>Email</label>
      <InputField
        startIcon={<img src="/ic_person.svg" alt="Email Icon" style={{ width: 16, height: 16 }} />}
        type="email"
        label="Masukkan email"
        {...register("email")}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: `1px solid ${errors.email ? "#ef4444" : colors.violet.normal}`,
        }}
      />
      {errors.email && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.email.message}</span>}
    </div>

    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "medium", color: colors.violet.dark }}>Nomor Telepon</label>
      <InputField
        startIcon={<img src="/ic_person.svg" alt="Phone Icon" style={{ width: 16, height: 16 }} />}
        type="tel"
        label="Masukkan nomor telepon"
        {...register("nomor_telepon")}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: `1px solid ${errors.nomor_telepon ? "#ef4444" : colors.violet.normal}`,
        }}
      />
      {errors.nomor_telepon && <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.nomor_telepon.message}</span>}
    </div>
  </>
);

export default Step1;
