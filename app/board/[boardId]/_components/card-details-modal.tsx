import React, { useState, useRef } from 'react';
import { useStore, type Card, type MediaAttachment } from '@/store/useStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
    Calendar,
    MessageSquare,
    Paperclip,
    Image as ImageIcon,
    Video,
    Send,
    Trash2,
    Edit,
    Save,
    FileX,
    Upload
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from 'sonner';

interface CardDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: Card;
}

export function CardDetailsModal({ isOpen, onClose, card }: CardDetailsModalProps) {
    const {
        currentUser,
        updateCard,
        addComment,
        deleteComment,
        addAttachment,
        removeAttachment
    } = useStore();

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [editedTitle, setEditedTitle] = useState(card.title);
    const [editedDescription, setEditedDescription] = useState(card.description);
    const [newComment, setNewComment] = useState('');
    const [uploadDescription, setUploadDescription] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { uploadFile, validateFile, isUploading, uploadProgress } = useFileUpload({
        onUploadComplete: (attachment) => {
            addAttachment(card.id, attachment);
            setShowUploadForm(false);
            setUploadDescription('');
            toast.success('File uploaded successfully!');
        },
        currentUser: currentUser!,
    });

    const handleSaveTitle = () => {
        if (editedTitle.trim() && editedTitle !== card.title) {
            updateCard(card.id, { title: editedTitle.trim() });
        }
        setIsEditingTitle(false);
        setEditedTitle(card.title);
    };

    const handleSaveDescription = () => {
        if (editedDescription !== card.description) {
            updateCard(card.id, { description: editedDescription });
        }
        setIsEditingDescription(false);
        setEditedDescription(card.description);
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            addComment(card.id, newComment.trim());
            setNewComment('');
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validation = validateFile(file);
        if (!validation.isValid) {
            toast.error(validation.error!);
            return;
        }

        await uploadFile(file, uploadDescription || `Uploaded ${file.name}`);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        setShowUploadForm(true);
    };

    const handleCancelUpload = () => {
        setShowUploadForm(false);
        setUploadDescription('');
    };

    // Update local state when card changes
    React.useEffect(() => {
        setEditedTitle(card.title);
        setEditedDescription(card.description);
    }, [card.title, card.description]);

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

        return date.toLocaleDateString();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-card border-border overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 border-b border-border bg-card">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <DialogTitle className="text-xl text-foreground mb-1">Card Details</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                View and edit card information, comments, and attachments.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Title Section */}
                        <div>
                            {isEditingTitle ? (
                                <div className="space-y-3">
                                    <Input
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className="text-xl border-primary/20 focus:border-primary"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveTitle();
                                            if (e.key === 'Escape') {
                                                setIsEditingTitle(false);
                                                setEditedTitle(card.title);
                                            }
                                        }}
                                    />
                                    <div className="flex space-x-2">
                                        <Button size="sm" onClick={handleSaveTitle}>
                                            <Save className="h-3 w-3 mr-1" />
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditingTitle(false);
                                                setEditedTitle(card.title);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="text-2xl cursor-pointer hover:bg-accent/30 p-3 -m-3 rounded-lg flex items-center group transition-colors"
                                    onClick={() => setIsEditingTitle(true)}
                                >
                                    <span className="flex-1 text-foreground">{card.title}</span>
                                    <Edit className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}

                            <div className="flex items-center text-sm text-muted-foreground mt-3 space-x-6">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Created {formatTimestamp(card.createdAt)}
                                </div>
                                <div className="flex items-center">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    {card.comments.length} comments
                                </div>
                                <div className="flex items-center">
                                    <Paperclip className="h-4 w-4 mr-1" />
                                    {card.attachments.length} attachments
                                </div>
                            </div>
                        </div>

                        {/* Labels and Assigned Users */}
                        {(card.labels.length > 0 || card.assignedUsers.length > 0) && (
                            <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                                {card.labels.length > 0 && (
                                    <div className="mb-4">
                                        <Label className="text-sm mb-3 block text-foreground">Labels</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {card.labels.map((label) => (
                                                <Badge
                                                    key={label.id}
                                                    variant="outline"
                                                    style={{ borderColor: label.color, color: label.color }}
                                                    className="bg-background/50"
                                                >
                                                    {label.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {card.assignedUsers.length > 0 && (
                                    <div>
                                        <Label className="text-sm mb-3 block text-foreground">Assigned Users</Label>
                                        <div className="flex items-center space-x-3">
                                            {card.assignedUsers.map((user) => (
                                                <div key={user.id} className="flex items-center space-x-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="text-xs">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{user.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <Label className="text-sm mb-3 block text-foreground">Description</Label>
                            {isEditingDescription ? (
                                <div className="space-y-3">
                                    <Textarea
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        rows={4}
                                        placeholder="Add a more detailed description..."
                                        className="border-primary/20 focus:border-primary"
                                    />
                                    <div className="flex space-x-2">
                                        <Button size="sm" onClick={handleSaveDescription}>
                                            <Save className="h-3 w-3 mr-1" />
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditingDescription(false);
                                                setEditedDescription(card.description);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="cursor-pointer hover:bg-accent/30 p-4 -m-4 rounded-lg min-h-[80px] flex items-start group transition-colors border border-accent/20"
                                    onClick={() => setIsEditingDescription(true)}
                                >
                                    {card.description ? (
                                        <p className="whitespace-pre-wrap flex-1 text-foreground">{card.description}</p>
                                    ) : (
                                        <p className="text-muted-foreground flex-1">Add a more detailed description...</p>
                                    )}
                                    <Edit className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </div>
                            )}
                        </div>

                        {/* Attachments */}
                        {card.attachments.length > 0 && (
                            <div>
                                <Label className="text-sm mb-4 block text-foreground">Attachments</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {card.attachments.map((attachment) => (
                                        <div key={attachment.id} className="border border-accent/30 rounded-lg p-4 bg-accent/10">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    {attachment.type === 'image' ? (
                                                        <ImageIcon className="h-4 w-4 text-blue-500" />
                                                    ) : (
                                                        <Video className="h-4 w-4 text-green-500" />
                                                    )}
                                                    <span className="text-sm text-foreground">{attachment.type}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeAttachment(card.id, attachment.id)}
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <FileX className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {attachment.type === 'image' ? (
                                                <ImageWithFallback
                                                    src={attachment.url}
                                                    alt={attachment.description}
                                                    className="w-full h-32 object-cover rounded-md mb-3"
                                                />
                                            ) : (
                                                <video
                                                    src={attachment.url}
                                                    controls
                                                    className="w-full h-32 rounded-md mb-3"
                                                />
                                            )}

                                            <p className="text-xs text-muted-foreground mb-2">
                                                {attachment.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                by {attachment.uploadedBy.name} • {formatTimestamp(attachment.uploadedAt)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Comments Section */}
                        <div>
                            <Label className="text-sm mb-4 block text-foreground">Activity</Label>

                            {/* Add Comment */}
                            <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
                                <div className="flex space-x-3">
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarImage src={currentUser?.avatar} />
                                        <AvatarFallback>
                                            {currentUser?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-3">
                                        <Textarea
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            rows={3}
                                            className="border-primary/20 focus:border-primary resize-none"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={handleAddComment}
                                                disabled={!newComment.trim()}
                                            >
                                                <Send className="h-3 w-3 mr-1" />
                                                Comment
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleUploadClick}
                                                disabled={isUploading}
                                            >
                                                <Upload className="h-3 w-3 mr-1" />
                                                Attach File
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* File Upload Form */}
                            {showUploadForm && (
                                <div className="mb-6 p-4 border border-primary/30 rounded-lg bg-primary/5">
                                    <h4 className="text-sm mb-3 text-foreground">Upload File</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <Label htmlFor="upload-description" className="text-xs">
                                                Description (optional)
                                            </Label>
                                            <Input
                                                id="upload-description"
                                                placeholder="Describe this file..."
                                                value={uploadDescription}
                                                onChange={(e) => setUploadDescription(e.target.value)}
                                                className="mt-1 border-primary/20 focus:border-primary"
                                            />
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />

                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                            >
                                                <Paperclip className="h-3 w-3 mr-1" />
                                                Choose File
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCancelUpload}
                                                disabled={isUploading}
                                            >
                                                Cancel
                                            </Button>
                                        </div>

                                        {isUploading && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span>Uploading...</span>
                                                    <span>{uploadProgress}%</span>
                                                </div>
                                                <Progress value={uploadProgress} className="h-2" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Comments List - Fixed with proper scrolling */}
                            {card.comments.length > 0 ? (
                                <div className="border border-accent/20 rounded-lg bg-accent/5">
                                    <div className="p-3 border-b border-accent/20">
                                        <span className="text-sm text-foreground">Comments ({card.comments.length})</span>
                                    </div>
                                    <ScrollArea className="max-h-80">
                                        <div className="p-4 space-y-4">
                                            {card.comments.map((comment) => (
                                                <div key={comment.id} className="flex space-x-3 pb-4 border-b border-accent/10 last:border-b-0 last:pb-0">
                                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                                        <AvatarImage src={comment.author.avatar} />
                                                        <AvatarFallback>
                                                            {comment.author.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="bg-accent/30 rounded-lg p-3 border border-accent/40">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-sm text-foreground">{comment.author.name}</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {formatTimestamp(comment.createdAt)}
                                                                    </span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                                        onClick={() => deleteComment(card.id, comment.id)}
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm whitespace-pre-wrap text-foreground break-words">
                                                                {comment.content}
                                                            </p>

                                                            {comment.media && (
                                                                <div className="mt-3">
                                                                    {comment.media.type === 'image' ? (
                                                                        <ImageWithFallback
                                                                            src={comment.media.url}
                                                                            alt={comment.media.description}
                                                                            className="max-w-xs h-32 object-cover rounded-md"
                                                                        />
                                                                    ) : (
                                                                        <video
                                                                            src={comment.media.url}
                                                                            controls
                                                                            className="max-w-xs h-32 rounded-md"
                                                                        />
                                                                    )}
                                                                    <p className="text-xs text-muted-foreground mt-2">
                                                                        {comment.media.description}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-accent/10 rounded-lg border border-accent/20">
                                    <p className="text-sm text-muted-foreground">
                                        No comments yet. Be the first to add one!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}