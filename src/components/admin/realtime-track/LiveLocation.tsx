export default function LiveLocation() {
    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between border-b pb-3">
                <p className="text-lg font-medium">Peta Real-time & AI Overlay</p>
                <div className="flex gap-2">
                    <span className="px-2 py-1 rounded-sm bg-gray-100 text-sm">Okupansi</span>
                    <span className="px-2 py-1 rounded-sm bg-gray-100 text-sm">OTP</span>
                    <span className="px-2 py-1 rounded-sm bg-gray-100 text-sm">Delay</span>
                </div>
            </div>

            <div className="relative mt-4 rounded-lg overflow-hidden bg-gray-100" style={{ height: 340 }}>
                {/* Real-time Google Maps view */}
                <iframe
                    src="https://share.google/5LYEmWdzheLn3YHY1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                    title="Real-time Train Location"
                ></iframe>

                {/* Legend card in the top-right */}
                <div className="absolute right-6 top-6">
                    <div className="bg-white rounded-lg shadow-lg p-3 w-44">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                                <span className="text-sm">Okupansi &gt;90%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                                <span className="text-sm">Okupansi 60-90%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                                <span className="text-sm">Okupansi &lt;60%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}