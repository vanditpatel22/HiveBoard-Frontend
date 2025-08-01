"use client"

import React, { useState, useEffect } from 'react';
import { useBoardStore } from '@/store/boardStore'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Eye,
  Activity,
  Target,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBoard, deleteBoard } from '@/services/board.service';
import { AuthRouteConstant, UserRouteConstant } from '@/constants/routes.constant';
import useDebounce from "@/hooks/use-debounce";
import BoardList from './board-list';
import Header from '@/components/header';

const Board = () => {
  const router = useRouter();
  const {
    getBoards,
    setFilters,
    boards,
    filters,
    loadingBoard,
    error,
    currentPage,
    totalPages,
    totalBoard,
  } = useBoardStore()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>(['1']); // Mock favorite project IDs
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Simulate loading state
  useEffect(() => {
    getBoards({})

    return () => {
      setFilters('search', '');
      setFilters('page', '1');
    };

  }, []);


  useEffect(() => {
    getBoards(filters)
  }, [filters]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      setFilters("search", debouncedSearch.trim())
    } else {
      setFilters("search", "")
    }
  }, [debouncedSearch]);


  const toggleFavorite = (projectId: string) => {
    setFavoriteProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleOpenBoard = (_id: string) => {
    console.log(`handleOpenBoard Clicked`);

    router.push(
      `${UserRouteConstant.BoardDetails}/${_id}`
    );

  }


  const handleCreateBoard = async () => {
    if (newBoardTitle.trim()) {
      setIsCreating(true);
      try {

        const { res, success, message } = await createBoard({
          title: newBoardTitle,
          description: newBoardDescription,
        });

        setNewBoardTitle('');
        setNewBoardDescription('');
        setIsCreateDialogOpen(false);
      } catch (error) {
        console.error('Error creating board:', error);
      } finally {
        setIsCreating(false);
        getBoards({})
      }
    }
  };



  const handleDeleteBoard = (boardId: string) => {
    deleteBoard(boardId);
  };



  return (
    <>

      {/* Main Content */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Project Overview
              {!loadingBoard && (
                <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {totalBoard}
                </Badge>
              )}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Track progress and manage project deliverables
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25">
                  <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  Create Board
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">Create New Board</DialogTitle>
                  <DialogDescription className="text-slate-600 dark:text-slate-400">
                    Create a new board to organize your tasks and collaborate with your team.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">Board Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Project Alpha"
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      className="border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      disabled={isCreating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this board is for..."
                      value={newBoardDescription}
                      onChange={(e) => setNewBoardDescription(e.target.value)}
                      className="border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 min-h-[80px]"
                      disabled={isCreating}
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <Button
                      onClick={handleCreateBoard}
                      disabled={!newBoardTitle.trim() || isCreating}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                    >
                      {isCreating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Board
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isCreating}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Enhanced Search and Filter Bar */}
        {(
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">

            {/* Left Section - Search */}
            <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 max-w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); }}
                  className="pl-12 pr-4 py-3 h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 rounded-xl hover:shadow-md focus:shadow-lg"
                />
              </div>


            </div>

            {/* Right Section - View Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>View:</span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-10 px-4 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium hidden sm:inline">Grid</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-10 px-4 rounded-lg transition-all duration-200 ${viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  <List className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium hidden sm:inline">List</span>
                </Button>
              </div>

            </div>
          </div>
        )}




        <div className="space-y-6">
          {/* Project Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="group bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{totalBoard ?? 0}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Active Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="group bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-green-500/10 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">0 </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="group bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-yellow-500/10 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50 transition-colors duration-300">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">{(totalBoard ?? 0)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="group bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-300">
                    <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">{totalBoard ?? 0} </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Listing with Grid/List View */}
          <div className="space-y-6">
            {loadingBoard ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-md" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className={`grid gap-6 transition-all duration-300 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>

                {totalBoard > 0 && boards ? (

                  <BoardList
                    boards={boards}
                    favoriteProjects={favoriteProjects}
                    toggleFavorite={toggleFavorite}
                    handleOpenBoard={handleOpenBoard}
                    viewMode={viewMode}
                  />

                ) : (
                  <div className="flex flex-col col-start-2 items-center justify-center text-center w-full">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No board yet</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
                        Create your first board to get started with organizing your tasks and collaborating with your team.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
                      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Board
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      <Button variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Eye className="mr-2 h-4 w-4" />
                        View Demo
                      </Button>
                    </div>
                  </div>


                )}

              </div>
            )}


          </div>


        </div>



      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 group"
            >
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

    </>
  )
}

export default Board;
