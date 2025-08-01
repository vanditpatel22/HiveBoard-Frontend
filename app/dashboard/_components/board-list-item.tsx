import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Activity, Users } from "lucide-react";
import { BoardInterface } from "@/types/board.type";

interface BoardListItemProps {
  board: BoardInterface;
  progress: number;
  totalTasks: number;
  favoriteProjects: any[];
  toggleFavorite: (id: string) => void;
  handleOpenBoard: (id: string) => void;
  status: string;
}

const BoardListItem: React.FC<BoardListItemProps> = ({
  board,
  progress,
  totalTasks,
  favoriteProjects,
  toggleFavorite,
  handleOpenBoard,
  status,
}) => (
  <Card
    key={board._id}
    className={`group cursor-pointer flex flex-row transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden transform hover:scale-[1.02] ${
      status === "completed"
        ? "border-l-4 border-l-green-500 hover:border-l-green-400"
        : "border-l-4 border-l-orange-500 hover:border-l-orange-400"
    }`}
  >
    <div className="flex-1 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {board.title}
          </h3>
          {board.description && (
            <p className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
              {board.description}
            </p>
          )}
          <div className="flex items-center gap-6 mt-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <Activity className="mr-1 h-4 w-4" />
              {progress}/{totalTasks} tasks
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              {board?.users?.length} members
            </div>
            <Badge variant={status === "completed" ? "default" : "secondary"} className={status === "completed" ? "bg-green-500" : ""}>
              {status === "completed" ? "Completed" : "Ongoing"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={() => handleOpenBoard(board?._id)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              toggleFavorite(board._id);
            }}
            className={favoriteProjects.includes(board._id) ? "text-red-500" : "text-slate-400"}
          >
            <Heart className={`h-4 w-4 ${favoriteProjects.includes(board._id) ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

export default BoardListItem;