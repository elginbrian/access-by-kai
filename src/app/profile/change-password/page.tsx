import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { colors } from "@/app/design-system/colors";

const ChangePasswordPage = () => {
    const handleCancel = () => {
        // Handle cancel action - could navigate back to profile
        console.log('Cancel clicked');
    };

    const handleSubmit = (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
        // Handle form submission
        console.log('Password change data:', data);
        // Here you would typically call an API to update the password
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: colors.base.lightHover }}>
            <ProfileSidebar />

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
}

export default ChangePasswordPage;
