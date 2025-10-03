"use client";

import React, { useCallback, useState } from "react";

type Props = {
  embedUrl?: string;
};

export default function LiveLocation({ embedUrl = "https://share.google/5LYEmWdzheLn3YHY1" }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [key, setKey] = useState(0);

  const onLoad = useCallback(() => {
    setLoaded(true);
    setBlocked(false);
  }, []);

  const onError = useCallback(() => {
    setBlocked(true);
    setLoaded(false);
  }, []);

  const handleRetry = useCallback(() => {
    setBlocked(false);
    setLoaded(false);
    setKey((k) => k + 1);
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between border-b pb-3">
        <p className="text-lg text-gray-800 font-semibold">Peta Real-time & AI Overlay</p>
        <div className="flex gap-2">
          <span className="px-2 py-1 rounded-sm text-gray-800 text-sm">Okupansi</span>
          <span className="px-2 py-1 rounded-sm text-gray-800 text-sm">OTP</span>
          <span className="px-2 py-1 rounded-sm text-gray-800 text-sm">Delay</span>
        </div>
      </div>

      <div className="relative mt-4 rounded-lg overflow-hidden bg-gray-100" style={{ height: 340 }}>
        {!blocked ? (
          <iframe
            key={key}
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
            title="Real-time Train Location"
            onLoad={onLoad}
            onError={onError}
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-sm text-gray-700 mb-2">Embed diblokir atau tidak dapat dimuat di dalam iframe.</p>
              <div className="flex items-center justify-center gap-2">
                <a href={embedUrl} target="_blank" rel="noreferrer noopener" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm">
                  Buka peta di tab baru
                </a>
                <button onClick={handleRetry} className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md text-sm">
                  Coba lagi
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">Jika situs menolak embedding (X-Frame-Options), gunakan tombol 'Buka peta di tab baru'.</p>
            </div>
          </div>
        )}

        <div className="absolute right-6 top-6">
          <div className="bg-white rounded-lg shadow-lg p-3 w-44">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                <span className="text-sm text-gray-800">Okupansi &gt;90%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                <span className="text-sm text-gray-800">Okupansi 60-90%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="text-sm text-gray-800">Okupansi &lt;60%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
