import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { type Category } from '@/types';

interface DeleteCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
}

export default function DeleteCategoryDialog({ open, onOpenChange, category }: DeleteCategoryDialogProps) {
    const handleDelete = () => {
        if (category) {
            router.delete(route('categories.destroy', category.id), {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{category?.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Delete Category
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
