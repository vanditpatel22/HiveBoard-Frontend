import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from "next";
import LoginForm from '@/app/login/_components/login-form';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Hive Board';


export const metadata: Metadata = {
    title: "Hive Board | Login",
    description: "Hive Board Login with email and password.",
};


const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">

            <Card className="w-full max-w-md mt-20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">{APP_NAME}</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your boards
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;
