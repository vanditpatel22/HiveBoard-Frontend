
import Header from "@/components/header";
import BoardDetails from "./_components/board-details";

async function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {

    const paramsStore = await params;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900/50 dark:to-indigo-950/20 transition-all duration-500">
            {/* <Header /> */}
            <BoardDetails id={paramsStore.boardId} />
        </div>
    )

}

export default BoardPage;