
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface addListProps {
    isCreateListDialogOpen: boolean
    setIsCreateListDialogOpen: (value: boolean) => void
    handleCreateList: () => void
    newListTitle: string,
    setNewListTitle: (value: string) => void
}

const AddListModel: React.FC<addListProps> = ({
    isCreateListDialogOpen,
    setIsCreateListDialogOpen,
    handleCreateList,
    newListTitle,
    setNewListTitle
}) => {
    return (
        <>
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
        </>
    )
}

export default AddListModel;
