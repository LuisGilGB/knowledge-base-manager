
'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import ConnectionsSidebar from "@/components/ConnectionsSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthService } from "@/lib/api/services";

const PrivateLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = AuthService.isAuthenticated();
      setIsAuthenticated(isLoggedIn);

      if (!isLoggedIn) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <ConnectionsSidebar />
      <main className="flex-1 p-4 overflow-x-hidden">{children}</main>
    </SidebarProvider>
  );
}

export default PrivateLayout;
