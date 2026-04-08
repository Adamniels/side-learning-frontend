'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../api';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card/Card';
import styles from './RegisterForm.module.css';

export const RegisterForm = () => {
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
    const displayName = formData.get('displayName') as string;

    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.register({ email, password, displayName: displayName || undefined });
      router.push('/dashboard'); // Route for successful registration flow
    } catch (err: any) {
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors);
        
        // If there is an 'identity' error, show it as the main error message, 
        // fallback to err.message otherwise.
        const identityError = err.validationErrors.identity?.[0] || err.validationErrors.Identity?.[0];
        if (identityError) {
          setError(identityError);
        } else {
          setError(err.message || 'An error occurred during registration');
        }
      } else {
        setError(err.message || 'An error occurred during registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.container}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Join SideLearning to track and improve your workflow.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className={styles.formContent}>
          {error && <div className={styles.errorAlert}>{error}</div>}
          <Input
            id="displayName"
            name="displayName"
            type="text"
            label="Display Name (optional)"
            placeholder="John Doe"
            disabled={isLoading}
            error={validationErrors.DisplayName?.[0] || validationErrors.displayName?.[0]}
          />
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
            minLength={6}
            error={validationErrors.Password?.[0] || validationErrors.password?.[0]}
          />
        </CardContent>
        <CardFooter className={styles.footer}>
          <Button type="submit" isLoading={isLoading} className={styles.submitBtn}>
            Register
          </Button>
          <div className={styles.loginLink}>
            Already have an account? <Button variant="ghost" className={styles.linkBtn} onClick={(e) => { e.preventDefault(); router.push('/login'); }}>Log in</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
