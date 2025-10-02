import React from 'react';
import { colors } from '../../../app/design-system/colors';


interface Step3Props {
  agree: boolean;
  onChange: (field: string, value: any) => void;
}

const Step3: React.FC<Step3Props> = ({ agree, onChange }) => (
  <>
    <div style={{ marginBottom: '16px', textAlign: 'center' }}>
      <p style={{ color: colors.base.dark }}>
        KAI berkomitmen menjaga kerahasiaan data pribadi Anda. Data hanya digunakan untuk keperluan layanan KAI, tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.
      </p>
    </div>
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: colors.base.dark }}>
        <input
          type="checkbox"
          checked={agree}
          onChange={e => onChange('agree', e.target.checked)}
          style={{ accentColor: colors.violet.normal }}
        />
        Saya telah membaca dan menyetujui Syarat & Ketentuan serta Kebijakan Privasi KAI.
      </label>
    </div>
  </>
);

export default Step3;
