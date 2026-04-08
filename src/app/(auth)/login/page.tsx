import React from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In | SideLearning',
  description: 'Log in to your SideLearning account',
};

export default function LoginPage() {
  return <LoginForm />;
}
