'use client'
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Plus, MoreVertical, Users, MessageSquare, Paperclip } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CardDetailsModal } from '@/app/board/[boardId]/_components/card-details-modal';
import type { Card as CardType } from '@/store/useStore';
import { getBoardById } from '@/services/board.service';
import { BoardInterface, BoardResponse } from '@/types/board.type';
import { ListInterface } from '@/types/list.type';

const BoardDetails = ({ id }: { id: string }) => {


    const {
        boards,
        currentBoardId,
        selectedCardId,
        setCurrentPage,
        setCurrentBoardId,
        setSelectedCardId,
        createList,
        createCard,
        deleteList,
        deleteCard,
        moveCard
    } = useStore();

    const [isCreateListDialogOpen, setIsCreateListDialogOpen] = useState(false);
    const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] = useState(false);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [newListTitle, setNewListTitle] = useState('');
    const [newCardTitle, setNewCardTitle] = useState('');
    const [newCardDescription, setNewCardDescription] = useState('');

    const [cardDetails, setCardDetails] = useState<BoardInterface | null>(null);

    const currentBoard = boards.find(board => board.id === currentBoardId);

    useEffect(() => {
        const fetchBoard = async () => {
            const { res, message, success } = await getBoardById(id);
            if (res) {
                setCardDetails(res);
            } else {
                setCardDetails(null);
                // Optionally, you could handle error or show a message here
            }
        }
        fetchBoard()
    }, [id])

    if (!cardDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2>Board not found</h2>
                    <Button onClick={() => setCurrentPage('boards')} className="mt-4">
                        Back to Boards
                    </Button>
                </div>
            </div>
        );
    }

    const handleCreateList = () => {
        if (newListTitle.trim()) {
            createList(currentBoard?.id ?? "", newListTitle);
            setNewListTitle('');
            setIsCreateListDialogOpen(false);
        }
    };

    const handleCreateCard = () => {
        if (newCardTitle.trim() && selectedListId) {
            createCard(selectedListId, newCardTitle, newCardDescription);
            setNewCardTitle('');
            setNewCardDescription('');
            setIsCreateCardDialogOpen(false);
            setSelectedListId(null);
        }
    };

    const handleBackToBoards = () => {
        setCurrentBoardId(null);
        setCurrentPage('boards');
    };

    const handleOpenCreateCard = (listId: string) => {
        setSelectedListId(listId);
        setIsCreateCardDialogOpen(true);
    };

    const onDragEnd = (result: DropResult) => {
        moveCard(result);
    };

    const handleCardClick = (cardId: string) => {
        setSelectedCardId(cardId);
    };

    const handleCloseCardModal = () => {
        setSelectedCardId(null);
    };

    const handleCloseCreateCard = () => {
        setIsCreateCardDialogOpen(false);
        setSelectedListId(null);
        setNewCardTitle('');
        setNewCardDescription('');
    };

    // Find the selected card across all boards
    const selectedCard = selectedCardId
        ? boards
            .flatMap(board => board.lists)
            .flatMap(list => list.cards)
            .find(card => card.id === selectedCardId)
        : null;


    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
            {/* Header */}
            <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
                <div className="flex items-center justify-between p-4 max-w-none mx-auto">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBackToBoards}
                            className="hover:bg-accent/50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Boards
                        </Button>
                        <div>
                            <h1 className="text-foreground">{currentBoard?.title}</h1>
                            {currentBoard?.description && (
                                <p className="text-sm text-muted-foreground">{currentBoard?.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div className="flex -space-x-1">
                                {currentBoard?.members.map((member) => (
                                    <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                        </div>

                        <Dialog open={isCreateListDialogOpen} onOpenChange={setIsCreateListDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="hover:bg-accent/50">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add List
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card">
                                <DialogHeader>
                                    <DialogTitle>Create New List</DialogTitle>
                                    <DialogDescription>
                                        Add a new list to organize your cards.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="listTitle">List Title</Label>
                                        <Input
                                            id="listTitle"
                                            placeholder="e.g., To Do, In Progress, Done"
                                            value={newListTitle}
                                            onChange={(e) => setNewListTitle(e.target.value)}
                                            className="border-primary/20 focus:border-primary"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button onClick={handleCreateList} disabled={!newListTitle.trim()}>
                                            Create List
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsCreateListDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            {/* Board Content */}
            <div className="p-6 overflow-x-auto board-scroll">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex space-x-6 min-h-[calc(100vh-120px)]">
                        {cardDetails && cardDetails?.lists.map((list: ListInterface) => (
                            <div key={list?._id} className="flex-shrink-0 w-80 relative z-10">
                                <Card className="h-fit bg-card/80 backdrop-blur-sm border-accent/30 shadow-lg">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base text-foreground">{list.title}</CardTitle>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="secondary" className="text-xs bg-accent/50">
                                                    {list.cards.length}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-accent/50">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-card z-50">
                                                        <DropdownMenuItem onClick={() => handleOpenCreateCard(list._id)}>
                                                            Add Card
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => deleteList(list._id)}
                                                        >
                                                            Delete List
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <Droppable droppableId={list._id} type="CARD">
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className={`space-y-3 min-h-[200px] rounded-lg p-3 transition-all duration-200 ${snapshot.isDraggingOver
                                                        ? 'bg-primary/10 border-2 border-dashed border-primary/50 ring-2 ring-primary/20'
                                                        : ''
                                                        }`}
                                                >
                                                    {list?.cards?.map((card: any, index) => (
                                                        <CardItem
                                                            key={card._id}
                                                            card={card}
                                                            index={index}
                                                            onDelete={() => deleteCard(card._id)}
                                                            onClick={() => handleCardClick(card._id)}
                                                        />
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>

                                        <Button
                                            variant="ghost"
                                            className="w-full mt-3 justify-start text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
                                            onClick={() => handleOpenCreateCard(list._id)}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add a card
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>

            {/* Create Card Dialog - Fixed to remove any potential duplicate close buttons */}
            <Dialog open={isCreateCardDialogOpen} onOpenChange={handleCloseCreateCard}>
                <DialogContent className="bg-card sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Card</DialogTitle>
                        <DialogDescription>
                            Add a new card to track a task or idea.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cardTitle">Card Title</Label>
                            <Input
                                id="cardTitle"
                                placeholder="e.g., Setup project structure"
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                className="border-primary/20 focus:border-primary"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && newCardTitle.trim()) {
                                        handleCreateCard();
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cardDescription">Description (Optional)</Label>
                            <Textarea
                                id="cardDescription"
                                placeholder="Add more details about this task..."
                                value={newCardDescription}
                                onChange={(e) => setNewCardDescription(e.target.value)}
                                className="border-primary/20 focus:border-primary"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={handleCloseCreateCard}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateCard} disabled={!newCardTitle.trim()}>
                                Create Card
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Card Details Modal */}
            {selectedCard && (
                <CardDetailsModal
                    isOpen={!!selectedCardId}
                    onClose={handleCloseCardModal}
                    card={selectedCard}
                />
            )}
        </div>
    )
}

interface CardItemProps {
    card: CardType;
    index: number;
    onDelete: () => void;
    onClick: () => void;
}

function CardItem({ card, index, onDelete, onClick }: CardItemProps) {
    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`cursor-pointer transition-all duration-200 group bg-card/90 border-accent/30 ${snapshot.isDragging
                        ? 'shadow-2xl scale-105 bg-card border-primary/50 z-[9999] rotate-0 transform-gpu'
                        : 'hover:shadow-lg hover:scale-[1.02] hover:bg-card'
                        }`}
                    style={{
                        ...provided.draggableProps.style,
                        ...(snapshot.isDragging && {
                            transform: `${provided.draggableProps.style?.transform} rotate(0deg)`,
                            zIndex: 9999,
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                        })
                    }}
                    onClick={(e) => {
                        // Only trigger card click if not dragging and not clicking on dropdown menu
                        if (!snapshot.isDragging && !(e.target as Element).closest('[data-dropdown-trigger]')) {
                            onClick();
                        }
                    }}
                >
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm mb-2 truncate text-foreground">{card.title}</h4>
                                {card.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                        {card.description}
                                    </p>
                                )}

                                {card.labels.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {card.labels.map((label) => (
                                            <Badge
                                                key={label.id}
                                                variant="outline"
                                                className="text-xs bg-background/50"
                                                style={{ borderColor: label.color, color: label.color }}
                                            >
                                                {label.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Card Stats */}
                                <div className="flex items-center space-x-4 mb-3">
                                    {card.comments.length > 0 && (
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <MessageSquare className="h-3 w-3 mr-1" />
                                            {card.comments.length}
                                        </div>
                                    )}
                                    {card.attachments.length > 0 && (
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Paperclip className="h-3 w-3 mr-1" />
                                            {card.attachments.length}
                                        </div>
                                    )}
                                </div>

                                {card.assignedUsers.length > 0 && (
                                    <div className="flex -space-x-1">
                                        {card.assignedUsers.slice(0, 3).map((user) => (
                                            <Avatar key={user.id} className="h-6 w-6 border border-background">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="text-xs">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {card.assignedUsers.length > 3 && (
                                            <div className="h-6 w-6 rounded-full bg-muted border border-background flex items-center justify-center">
                                                <span className="text-xs">+{card.assignedUsers.length - 3}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent/50"
                                        data-dropdown-trigger
                                    >
                                        <MoreVertical className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card z-50">
                                    <DropdownMenuItem onClick={onClick}>
                                        Open Card
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={onDelete}
                                    >
                                        Delete Card
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );
}

export default BoardDetails
