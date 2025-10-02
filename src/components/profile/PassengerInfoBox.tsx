"use client";

import React from 'react';

const PassengerInfoBox: React.FC = () => {
    return (
        <div className="rounded-2xl p-6 bg-blue-50">
            <div className="flex items-start gap-4">
                <img src="/ic_info_blue.svg" alt="Info" className="w-6 h-6" />

                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-3 text-black">
                        Informasi Penting
                    </h3>

                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0"></span>
                            <span className="text-sm leading-relaxed text-gray-700">Data penumpang harus sesuai dengan identitas resmi</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0"></span>
                            <span className="text-sm leading-relaxed text-gray-700">Penumpang utama tidak dapat dihapus</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0"></span>
                            <span className="text-sm leading-relaxed text-gray-700">Maksimal 8 penumpang per akun</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0"></span>
                            <span className="text-sm leading-relaxed text-gray-700">Data bayi memerlukan akta kelahiran</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerInfoBox;