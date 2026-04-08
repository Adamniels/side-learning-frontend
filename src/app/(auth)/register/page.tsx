import React from 'react';
import { RegisterForm } from '@/features/auth/components/RegisterForm/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | SideLearning',
  description: 'Join SideLearning to track and improve your workflow.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
