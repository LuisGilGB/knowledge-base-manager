
'use client';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ConnectionsSidebar from "@/components/ConnectionsSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthService } from "@/lib/api/services";
import { usePathname } from "next/navigation";

const PrivateLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = AuthService.isAuthenticated();
      setIsAuthenticated(isLoggedIn);

      if (!isLoggedIn) {
        // Use the URL and other related apis to build the redirect path
        const loginUrl = new URL('/login', window.location.origin);
        if (pathname !== '/') {
          loginUrl.searchParams.set('redirect_to', pathname);
        }
        router.push(loginUrl.toString());
      }
    };

    checkAuth();
  }, [router, pathname]);

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
      <main className="relative flex-1 p-4 pt-10 overflow-x-hidden">
        <div className="absolute top-2 left-2">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}

export default PrivateLayout;
