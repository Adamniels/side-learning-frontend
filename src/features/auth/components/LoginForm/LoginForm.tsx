'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../api';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card/Card';
import styles from './LoginForm.module.css';

interface ApiValidationError {
  message?: string;
  validationErrors?: Record<string, string[]>;
}

export const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.login({ email, password });
      router.push('/home'); // Predictable route for successful login
    } catch (e) {
      const err = e as ApiValidationError;
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors);
        
        const identityError = err.validationErrors.identity?.[0] || err.validationErrors.Identity?.[0];
        if (identityError) {
          setError(identityError);
        } else {
          setError(err.message || 'An error occurred during login');
        }
      } else {
        setError(err.message || 'An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.container}>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className={styles.formContent}>
          {error && <div className={styles.errorAlert}>{error}</div>}
          <Input
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="john@example.com"
            disabled={isLoading}
            required
            error={validationErrors.Email?.[0] || validationErrors.email?.[0]}
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            disabled={isLoading}
            required
            error={validationErrors.Password?.[0] || validationErrors.password?.[0]}
          />
        </CardContent>
        <CardFooter className={styles.footer}>
          <Button type="submit" isLoading={isLoading} className={styles.submitBtn}>
            Log In
          </Button>
          <div className={styles.registerLink}>
            Don&apos;t have an account? <Button variant="ghost" className={styles.linkBtn} onClick={(e) => { e.preventDefault(); router.push('/register'); }}>Sign up</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
