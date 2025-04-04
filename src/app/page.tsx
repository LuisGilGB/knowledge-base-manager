'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileExplorer from "@/components/FileExplorer";
import { AuthService } from '@/lib/api/services';

const Home = () => {
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

  // If authenticated, show the FileExplorer
  return (
    <div className="min-h-screen">
      <FileExplorer />
    </div>
  );
};

export default Home;
