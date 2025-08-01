"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth.service';
import { CustomToaster } from '@/components/ui/sonner';
import { UserRouteConstant } from '@/constants/routes.constant';



const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        

        try {
            setLoading(true);
            const { res, message, success } = await login(data);

            

            if (success) {
                CustomToaster({
                    title: message,
                    type: "success",
                });
                // If no error and res exists
                router.push(
                    UserRouteConstant.dashboard
                );
                return;
            }
            CustomToaster({
                type: "error",
                title: message,
            });

        } catch (error) {
            console.error("Login Error:", error);
            CustomToaster({
                type: "error",
                title: "Login failed",
            });
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        {...register('password')}
                        className={errors.password ? 'border-destructive' : ''}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign in'
                    )}
                </Button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link
                        href="/signup"
                        className="text-primary hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </>
    )
}

export default LoginForm
