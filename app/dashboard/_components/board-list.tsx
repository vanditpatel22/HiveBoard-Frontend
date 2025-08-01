import { BoardInterface } from "@/types/board.type";
import BoardCard from "./board-card";
import BoardListItem from "./board-list-item";

interface BoardListProps {
    boards: BoardInterface[];
    favoriteProjects: any;
    toggleFavorite: (boardId: string) => void;
    handleOpenBoard: (boardId: string) => void;
    viewMode: string;
}

const BoardList: React.FC<BoardListProps> = ({
    boards,
    favoriteProjects,
    toggleFavorite,
    handleOpenBoard,
    viewMode,
}) => (
    console.log('BoardList :: boards ==>', boards),
    <>
        {boards.map((board, index) => {
            const status = board?.status;
            const progress = board?.lists?.reduce((acc: number, list: any) => {
                const completedTasks = list?.cards?.filter((card: any) =>
                    list.title.toLowerCase().includes("done") ||
                    list.title.toLowerCase().includes("completed")
                ).length;
                return acc + completedTasks;
            }, 0);
            const totalTasks = board?.lists?.reduce((acc: number, list: any) => acc + (list.cards?.length ?? 0), 0) ?? 0;
            const progressPercent = totalTasks > 0 ? ((progress ?? 0) / totalTasks) * 100 : 0;

            return viewMode === "grid" ? (
                <BoardCard
                    key={board._id}
                    board={board}
                    progress={progress}
                    totalTasks={totalTasks}
                    progressPercent={progressPercent}
                    favoriteProjects={favoriteProjects}
                    toggleFavorite={toggleFavorite}
                    handleOpenBoard={handleOpenBoard}
                    index={index}
                />
            ) : (
                <BoardListItem
                    key={board._id}
                    board={board}
                    progress={progress ?? 0}
                    totalTasks={totalTasks}
                    favoriteProjects={favoriteProjects}
                    toggleFavorite={toggleFavorite}
                    handleOpenBoard={handleOpenBoard}
                    status={status}
                />
            );
        })}
    </>
);

export default BoardList;