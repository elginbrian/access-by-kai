"use client";

import React from "react";

const FileUploadCard: React.FC = () => {
  return (
    <div className="shadow-lg border p-4 rounded-xl bg-gray-50 mt-2">
      <div className="mt-2 flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
        <input id="fileInput" type="file" className="hidden" />
        <img src="/ic_upload_cloud.svg" alt="Upload" className="h-12 w-12" />
        <p className="mt-2 text-sm text-gray-600">Seret dan lepas berkas atau klik untuk mengunggah</p>
      </div>
    </div>
  );
};

export default FileUploadCard;
