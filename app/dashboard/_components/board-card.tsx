import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Activity, Users } from "lucide-react";
import { BoardInterface } from "@/types/board.type";

interface BoardCardProps {
  board: BoardInterface;
  progress: any;
  totalTasks: any;
  progressPercent: any;
  favoriteProjects: any;
  toggleFavorite: (id: string) => void;
  handleOpenBoard: (id: string) => void;
  index: number;
}

const BoardCard = ({
  board,
  progress,
  totalTasks,
  progressPercent,
  favoriteProjects,
  toggleFavorite,
  handleOpenBoard,
  index,
} : BoardCardProps) => {
  const status = board?.status ?? "";

  return (
    <Card
      key={board._id}
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden transform hover:scale-[1.02] ${
        status === "completed"
          ? "border-l-4 border-l-green-500 hover:border-l-green-400"
          : "border-l-4 border-l-orange-500 hover:border-l-orange-400"
      }`}
      style={{
        animationName: "fadeInUp",
        animationDuration: "0.6s",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards",
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {board.title}
            </CardTitle>
            {board.description && (
              <CardDescription className="mt-2 line-clamp-2 text-slate-600 dark:text-slate-400">
                {board.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(board?._id ?? "");
              }}
              className={favoriteProjects.includes(board._id) ? "text-red-500" : "text-slate-400"}
            >
              <Heart className={`h-4 w-4 ${favoriteProjects.includes(board._id) ? "fill-current" : ""}`} />
            </Button>
            <Badge variant={status === "completed" ? "default" : "secondary"} className={status === "completed" ? "bg-green-500" : ""}>
              {status === "completed" ? "Completed" : "Ongoing"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className={`font-medium ${status === "completed" ? "text-green-600" : ""}`}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${status === "completed" ? "bg-green-500" : "bg-orange-500"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {progress}/{totalTasks} tasks
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {board?.users?.length} members
            </span>
          </div>
          <Button
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group-hover:shadow-xl"
            onClick={() => handleOpenBoard(board._id)}
          >
            <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            View Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoardCard;