"use client";

import React from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { colors } from "@/app/design-system/colors";
import type { Pengguna } from "@/types/models";

interface Props {
  profile: Pengguna;
}

const ChangePasswordPageClient: React.FC<Props> = ({ profile }) => {
    const handleCancel = () => {
        // Handle cancel action - could navigate back to profile
    };

    const handleSubmit = (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
        // Handle form submission
        // Here you would typically call an API to update the password
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: colors.base.lightHover }}>
            <ProfileSidebar
                profile={profile}
                kaiPayBalance={125000}
                railPointBalance={2450}
            />

            {/* Main content with left margin */}
            <div className="flex-1 ml-80 bg-[#f9fafb]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ChangePasswordForm
                        onCancel={handleCancel}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPageClient;