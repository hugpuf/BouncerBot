import { AppNavbar } from "@/components/AppNavbar";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
