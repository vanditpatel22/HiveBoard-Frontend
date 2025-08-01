'use server';

import { ENDPOINTS } from '@/constants/endpoints';
import axiosInstance from '@/services/axiosInstance';
import {
    CreateBoardInterface,
    UpdateBoardInterface,
    BoardListResponse,
    BoardResponse,
    BoardInterface,
} from '@/types/board.type';

interface ApiResponse<T = any> {
    res?: T;
    success: boolean;
    message: string;
}

/**
 * Creates a new board.
 *
 * Makes a POST request to /boards with the board data.
 * Returns the created board data.
 *
 * @param {CreateBoardInterface} data - Board creation data
 * @returns {Promise<ApiResponse<BoardResponse>>}
 */
export const createBoard = async (data: CreateBoardInterface): Promise<ApiResponse<BoardResponse>> => {
    try {
        const res = await axiosInstance.post(ENDPOINTS.boards.create, {
            ...data,
        });

        console.log('Create Board :: res ==>', res);
        return {
            res: res?.data?.data,
            success: true,
            message: res?.data?.message || "Board created successfully"
        };
    } catch (error: any) {
        console.log('Create Board :: error ==>', error.response?.data || error.response);
        return {
            message: error.response?.data?.detail || error.response?.data?.message || "Something went wrong!",
            success: false
        };
    }
};

/**
 * Gets a list of boards.
 *
 * Makes a GET request to /boards with optional query parameters.
 * Returns the list of boards with pagination info.
 *
 * @param {Object} params - Query parameters (page, limit, search, etc.)
 * @returns {Promise<ApiResponse<BoardListResponse>>}
 */
export const getBoards = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}): Promise<ApiResponse<BoardListResponse>> => {
    try {

        const res = await axiosInstance.get(ENDPOINTS.boards.list, { params });

        return {
            res: res?.data?.data,
            success: true,
            message: res?.data?.message || "Boards retrieved successfully"
        };
    } catch (error: any) {
        console.log('Get Boards :: error ==>', error.response?.data || error.response);
        return {
            message: error.response?.data?.detail || error.response?.data?.message || "Something went wrong!",
            success: false
        };
    }
};

/**
 * Gets a board by ID.
 *
 * Makes a GET request to /boards/{id}.
 * Returns the specific board data.
 *
 * @param {string} id - Board ID
 * @returns {Promise<ApiResponse<BoardResponse>>}
 */
export const getBoardById = async (id: string): Promise<ApiResponse<BoardInterface>> => {
    try {
        const res = await axiosInstance.get(`${ENDPOINTS.boards.details}/${id}`);

        return {
            res: res?.data?.data,
            success: true,
            message: res?.data?.message || "Board retrieved successfully"
        };
    } catch (error: any) {
        console.log('Get Board by ID :: error ==>', error.response?.data || error.response);
        return {
            message: error.response?.data?.detail || error.response?.data?.message || "Something went wrong!",
            success: false
        };
    }
};

/**
 * Updates a board.
 *
 * Makes a PATCH request to /boards/{id} with the updated data.
 * Returns the updated board data.
 *
 * @param {string} id - Board ID
 * @param {UpdateBoardInterface} data - Board update data
 * @returns {Promise<ApiResponse<BoardResponse>>}
 */
export const updateBoard = async (id: string, data: UpdateBoardInterface): Promise<ApiResponse<BoardResponse>> => {
    try {
        const res = await axiosInstance.patch(
            `${ENDPOINTS.boards.update}/${id}`,
            data
        );

        return {
            res: res?.data?.data,
            success: true,
            message: res?.data?.message || "Board updated successfully"
        };
    } catch (error: any) {
        console.log('Update Board :: error ==>', error.response?.data || error.response);
        return {
            message: error.response?.data?.detail || error.response?.data?.message || "Something went wrong!",
            success: false
        };
    }
};

/**
 * Deletes a board.
 *
 * Makes a DELETE request to /boards/{id}.
 * Returns success message.
 *
 * @param {string} id - Board ID
 * @returns {Promise<ApiResponse>}
 */
export const deleteBoard = async (id: string): Promise<ApiResponse> => {
    try {
        const res = await axiosInstance.delete(
            `${ENDPOINTS.boards.delete}/${id}`
        );

        return {
            res: res?.data?.data,
            success: true,
            message: res?.data?.message || "Board deleted successfully"
        };
    } catch (error: any) {
        console.log('Delete Board :: error ==>', error.response?.data || error.response);
        return {
            message: error.response?.data?.detail || error.response?.data?.message || "Something went wrong!",
            success: false
        };
    }
}; 