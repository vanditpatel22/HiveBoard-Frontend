
import React from 'react'
import Board from './_components/board';
import Header from '@/components/header';

const BoardPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900/50 dark:to-indigo-950/20 transition-all duration-500">
            {/* Enhanced Header */}
            <Header />
            <Board />
        </div>
    )
}

export default BoardPage;
