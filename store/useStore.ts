import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video';
  url: string;
  description: string;
  uploadedAt: Date;
  uploadedBy: User;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  media?: MediaAttachment;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  labels: Label[];
  assignedUsers: User[];
  createdAt: Date;
  comments: Comment[];
  attachments: MediaAttachment[];
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  boardId: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  lists: List[];
  members: User[];
  createdAt: Date;
}

export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
  reason: string;
}

type Page = 'login' | 'signup' | 'boards' | 'board';

interface AppState {
  // Navigation
  currentPage: Page;
  currentBoardId: string | null;
  selectedCardId: string | null;
  
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Data
  boards: Board[];
  
  // UI State
  isLoading: boolean;
  
  // Actions
  setCurrentPage: (page: Page) => void;
  setCurrentBoardId: (boardId: string | null) => void;
  setSelectedCardId: (cardId: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Board actions
  createBoard: (title: string, description: string) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  
  // List actions
  createList: (boardId: string, title: string) => void;
  updateList: (listId: string, updates: Partial<List>) => void;
  deleteList: (listId: string) => void;
  
  // Card actions
  createCard: (listId: string, title: string, description: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (result: DragResult) => void;
  
  // Comment actions
  addComment: (cardId: string, content: string, media?: MediaAttachment) => void;
  deleteComment: (cardId: string, commentId: string) => void;
  
  // Media actions
  addAttachment: (cardId: string, attachment: MediaAttachment) => void;
  removeAttachment: (cardId: string, attachmentId: string) => void;
}

// Mock data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
};

const mockLabels: Label[] = [
  { id: '1', name: 'Bug', color: '#ef4444' },
  { id: '2', name: 'Feature', color: '#3b82f6' },
  { id: '3', name: 'Enhancement', color: '#10b981' },
  { id: '4', name: 'Documentation', color: '#f59e0b' },
];

const mockBoards: Board[] = [
  {
    id: '1',
    title: 'Project Alpha',
    description: 'Main development project',
    members: [mockUser],
    createdAt: new Date(),
    lists: [
      {
        id: '1',
        title: 'To Do',
        boardId: '1',
        cards: [
          {
            id: '1',
            title: 'Setup project structure',
            description: 'Initialize the project with proper folder structure',
            labels: [mockLabels[1]],
            assignedUsers: [mockUser],
            createdAt: new Date(),
            comments: [
              {
                id: '1',
                content: 'Started working on this task. Will update the progress soon.',
                author: mockUser,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
              },
              {
                id: '2',
                content: 'Great progress! The folder structure looks clean and organized.',
                author: mockUser,
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
              },
              {
                id: '3',
                content: 'Added the necessary configuration files and documentation.',
                author: mockUser,
                createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
              },
              {
                id: '4',
                content: 'Ready for review! Please check the implementation and let me know if any changes are needed.',
                author: mockUser,
                createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
              },
              {
                id: '5',
                content: 'This is looking fantastic! The structure is well-organized and follows best practices.',
                author: mockUser,
                createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
              }
            ],
            attachments: [],
          },
          {
            id: '2',
            title: 'Design database schema',
            description: 'Create the database schema for the application',
            labels: [mockLabels[1], mockLabels[3]],
            assignedUsers: [mockUser],
            createdAt: new Date(),
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: '2',
        title: 'In Progress',
        boardId: '1',
        cards: [
          {
            id: '3',
            title: 'Implement authentication',
            description: 'Add user login and registration functionality',
            labels: [mockLabels[1]],
            assignedUsers: [mockUser],
            createdAt: new Date(),
            comments: [
              {
                id: '2',
                content: 'Working on the login form validation.',
                author: mockUser,
                createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
              }
            ],
            attachments: [],
          },
        ],
      },
      {
        id: '3',
        title: 'Done',
        boardId: '1',
        cards: [
          {
            id: '4',
            title: 'Setup development environment',
            description: 'Configure development tools and environment',
            labels: [mockLabels[2]],
            assignedUsers: [mockUser],
            createdAt: new Date(),
            comments: [
              {
                id: '3',
                content: 'Development environment is now fully configured and ready to use!',
                author: mockUser,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
              }
            ],
            attachments: [],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Marketing Campaign',
    description: 'Q1 marketing initiatives',
    members: [mockUser],
    createdAt: new Date(),
    lists: [
      {
        id: '4',
        title: 'Ideas',
        boardId: '2',
        cards: [
          {
            id: '5',
            title: 'Social media strategy',
            description: 'Develop comprehensive social media approach',
            labels: [mockLabels[1]],
            assignedUsers: [mockUser],
            createdAt: new Date(),
            comments: [],
            attachments: [],
          },
        ],
      },
      {
        id: '5',
        title: 'In Review',
        boardId: '2',
        cards: [],
      },
      {
        id: '6',
        title: 'Published',
        boardId: '2',
        cards: [],
      },
    ],
  },
];

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  currentPage: 'login',
  currentBoardId: null,
  selectedCardId: null,
  currentUser: null,
  isAuthenticated: false,
  boards: [],
  isLoading: false,
  
  // Navigation actions
  setCurrentPage: (page) => set({ currentPage: page }),
  setCurrentBoardId: (boardId) => set({ currentBoardId: boardId }),
  setSelectedCardId: (cardId) => set({ selectedCardId: cardId }),
  
  // Authentication actions
  login: async (email, password) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ 
      currentUser: mockUser, 
      isAuthenticated: true, 
      boards: mockBoards,
      currentPage: 'boards',
      isLoading: false 
    });
  },
  
  signup: async (name, email, password) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = { ...mockUser, name, email };
    set({ 
      currentUser: newUser, 
      isAuthenticated: true,
      boards: mockBoards,
      currentPage: 'boards',
      isLoading: false 
    });
  },
  
  logout: () => {
    set({ 
      currentUser: null, 
      isAuthenticated: false, 
      boards: [],
      currentPage: 'login',
      currentBoardId: null,
      selectedCardId: null 
    });
  },
  
  // Board actions
  createBoard: (title, description) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title,
      description,
      lists: [],
      members: [get().currentUser!],
      createdAt: new Date(),
    };
    set(state => ({ boards: [...state.boards, newBoard] }));
  },
  
  updateBoard: (boardId, updates) => {
    set(state => ({
      boards: state.boards.map(board => 
        board.id === boardId ? { ...board, ...updates } : board
      )
    }));
  },
  
  deleteBoard: (boardId) => {
    set(state => ({ 
      boards: state.boards.filter(board => board.id !== boardId),
      currentBoardId: state.currentBoardId === boardId ? null : state.currentBoardId
    }));
  },
  
  // List actions
  createList: (boardId, title) => {
    const newList: List = {
      id: Date.now().toString(),
      title,
      cards: [],
      boardId,
    };
    set(state => ({
      boards: state.boards.map(board => 
        board.id === boardId 
          ? { ...board, lists: [...board.lists, newList] }
          : board
      )
    }));
  },
  
  updateList: (listId, updates) => {
    set(state => ({
      boards: state.boards.map(board => ({
        ...board,
        lists: board.lists.map(list => 
          list.id === listId ? { ...list, ...updates } : list
        )
      }))
    }));
  },
  
  deleteList: (listId) => {
    set(state => ({
      boards: state.boards.map(board => ({
        ...board,
        lists: board.lists.filter(list => list.id !== listId)
      }))
    }));
  },
  
  // Card actions
  createCard: (listId, title, description) => {
    const newCard: Card = {
      id: Date.now().toString(),
      title,
      description,
      labels: [],
      assignedUsers: [],
      createdAt: new Date(),
      comments: [],
      attachments: [],
    };
    set(state => ({
      boards: state.boards.map(board => ({
        ...board,
        lists: board.lists.map(list => 
          list.id === listId 
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      }))
    }));
  },
  
  updateCard: (cardId, updates) => {
    set(state => ({
      boards: state.boards.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => 
            card.id === cardId ? { ...card, ...updates } : card
          )
        }))
      }))
    }));
  },
  
  deleteCard: (cardId) => {
    set(state => ({
      boards: state.boards.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.filter(card => card.id !== cardId)
        }))
      }))
    }));
  },
  
  // Comment actions
  addComment: (cardId, content, media) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: get().currentUser!,
      createdAt: new Date(),
      media,
    };
    
    set(state => ({
      boards: state.boards.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => 
            card.id === cardId 
              ? { ...card, comments: [...card.comments, newComment] }
              : card
          )
        }))
      }))
    }));
  },
  
  deleteComment: (cardId, commentId) => {
    set(state => ({
      boards: state.boards.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => 
            card.id === cardId 
              ? { ...card, comments: card.comments.filter(comment => comment.id !== commentId) }
              : card
          )
        }))
      }))
    }));
  },
  
  // Media actions
  addAttachment: (cardId, attachment) => {
    set(state => ({
      boards: state.boards.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => 
            card.id === cardId 
              ? { ...card, attachments: [...card.attachments, attachment] }
              : card
          )
        }))
      }))
    }));
  },
  
  removeAttachment: (cardId, attachmentId) => {
    set(state => ({
      boards: state.boards.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => 
            card.id === cardId 
              ? { ...card, attachments: card.attachments.filter(att => att.id !== attachmentId) }
              : card
          )
        }))
      }))
    }));
  },
  
  // Drag and drop
  moveCard: (result) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination, return early
    if (!destination) return;
    
    // If dropped in the same position, return early
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    set(state => {
      // Create a deep copy of boards to avoid mutations
      const newBoards = state.boards.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: [...list.cards]
        }))
      }));
      
      // Find the board that contains the lists
      const board = newBoards.find(b => 
        b.lists.some(l => l.id === source.droppableId || l.id === destination.droppableId)
      );
      
      if (!board) return { boards: state.boards };
      
      const sourceList = board.lists.find(l => l.id === source.droppableId);
      const destList = board.lists.find(l => l.id === destination.droppableId);
      
      if (!sourceList || !destList) return { boards: state.boards };
      
      // Find the card being moved
      const draggedCard = sourceList.cards.find(card => card.id === draggableId);
      
      if (!draggedCard) return { boards: state.boards };
      
      // Remove card from source list
      sourceList.cards.splice(source.index, 1);
      
      // Add card to destination list
      destList.cards.splice(destination.index, 0, draggedCard);
      
      return { boards: newBoards };
    });
  },
}));