import { UserInterface } from "./auth.type";
import { ListInterface } from "./list.type";

export interface BoardInterface {
  _id: string;
  title: string;
  description?: string;
  user_id: string;
  users: UserInterface[];
  lists: ListInterface[];
  total_task?: number;
  status: 'ongoing' | 'completed' | 'archived';
  visibility?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBoardInterface {
  title: string;
  description?: string;
  visibility?: string;
}

export interface UpdateBoardInterface {
  title?: string;
  description?: string;
  visibility?: string;
  status?: 'ongoing' | 'completed' | 'archived';
}

export interface BoardListResponse {
  boards: BoardInterface[];
  total: number;
  page: number;
  limit: number;
}

export interface BoardResponse {
  board: BoardInterface;
  message?: string;
} 


export interface BoardFiltersI {
  page?: number;
  limit?: number;
  search?: string;
  board_id?: string;
  list_id?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  due_date?: string;
  created_by?: string;
}