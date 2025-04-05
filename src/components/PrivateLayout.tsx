
'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthService } from "@/lib/api/services";
import { usePathname } from "next/navigation";

const PrivateLayout = ({
  children,
  header
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = AuthService.isAuthenticated();

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

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {header}
      <main className="relative flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export default PrivateLayout;
