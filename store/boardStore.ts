import { create } from "zustand";
import { BoardInterface, BoardFiltersI } from "@/types/board.type";
import { getBoards } from "@/services/board.service";
import { PER_PAGE_LIMIT } from "@/constants/global";

interface BoardStateI {
    loadingBoard: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    totalBoard: number;
    boards: BoardInterface[];
    filters: BoardFiltersI;
    setFilters: (item: keyof BoardFiltersI, value: any) => void;
    getBoards: (filters: BoardFiltersI) => Promise<void>;
}

export const useBoardStore = create<BoardStateI>((set) => ({
    loadingBoard: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalBoard: 1,
    boards: [],
    filters: { page: 1, limit: PER_PAGE_LIMIT, search: "" },
    setFilters: (item, value) =>
        set((state) => ({ filters: { ...state.filters, [item]: value } })),
    getBoards: async (filters) => {
        set({ loadingBoard: true, error: null });
        console.log('filters::===>',filters );
        const { res, success, message }: any = await getBoards(filters);



        if (success) {
            set({
                boards: res?.data,
                totalPages: res?.total_pages,
                currentPage: res?.page,
                totalBoard: res?.total,
                loadingBoard: false,
            });
            return;
        }
        set({ error: message, loadingBoard: false });
    },
}));