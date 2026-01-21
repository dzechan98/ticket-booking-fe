import { ProfileForm } from "@/components/profile/profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  return (
    <main className="flex-1">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Thông tin cá nhân
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Hồ sơ cá nhân</TabsTrigger>
            <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="password">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
