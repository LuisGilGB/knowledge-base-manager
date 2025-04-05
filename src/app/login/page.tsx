import { LoginForm } from '@/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TestackAI - Login',
  description: 'Login to your account',
};

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
