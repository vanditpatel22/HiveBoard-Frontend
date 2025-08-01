"use client";
import React, { useState } from 'react'
import {
    Users,
    LogOut,
    Eye,
    Settings,
    Menu,
    X,
    Zap
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { AuthRouteConstant } from '@/constants/routes.constant';

const Header = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const router = useRouter();

    const logout = () => {
        router.push(AuthRouteConstant.login)
    }

    return (
        <header className="relative border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-white via-slate-50/80 to-white dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-950 backdrop-blur-2xl sticky top-0 z-50 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/50 transition-all duration-500">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10" />


            <div className="relative flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                {/* Left Section - Brand & Navigation */}
                <div className="flex items-center space-x-8">
                    {/* Brand Logo */}
                    <div className="flex items-center space-x-4 group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/40 group-hover:scale-105">
                                <Zap className="h-5 w-5 text-white" />
                            </div>

                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-600 group-hover:to-indigo-600">
                                Hive Board
                            </h1>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                                Project Management
                            </span>
                        </div>
                    </div>



                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>



                {/* Right Section - User & Actions */}
                <div className="flex items-center space-x-4">

                    {/* User Profile Section with Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-lg p-2 transition-all duration-200">
                                <div className="relative group">
                                    <Avatar className="h-10 w-10 ring-2 ring-blue-200/50 dark:ring-blue-800/50 transition-all duration-300 group-hover:ring-blue-300 dark:group-hover:ring-blue-700">
                                        <AvatarImage src={""} className="object-cover" />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white font-bold text-sm">
                                            {"Vandit"}
                                        </AvatarFallback>
                                    </Avatar>

                                </div>

                                <div className="hidden sm:block">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            "Vandit"
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            {/* <div className="w-2 h-2 bg-green-500 rounded-full" /> */}
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                Administrator
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
                            {/* Profile Header */}
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={""} className="object-cover" />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white font-bold">
                                            "Vandit"
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                                            Vandit
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                            {'admin@hiveboard.com'}
                                        </p>

                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                <DropdownMenuItem className="hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2">
                                    <Eye className="mr-3 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">View Profile</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2">
                                    <Settings className="mr-3 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Account Settings</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2">
                                    <Users className="mr-3 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Team Management</span>

                                    </div>
                                </DropdownMenuItem>
                            </div>

                            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

                            <div className="py-2">
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 focus:bg-red-50 dark:focus:bg-red-950/20 px-4 py-2"
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Sign Out</span>
                                    </div>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>


        </header>
    )
}

export default Header;
