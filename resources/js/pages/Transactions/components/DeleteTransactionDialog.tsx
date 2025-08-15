import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Transaction } from '@/types';
import { router } from '@inertiajs/react';

interface DeleteTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
    onSuccess?: () => void;
}

export default function DeleteTransactionDialog({ 
    open, 
    onOpenChange, 
    transaction, 
    onSuccess 
}: DeleteTransactionDialogProps) {
    const handleDelete = () => {
        if (transaction) {
            router.delete(route('transactions.destroy', transaction.id), {
                preserveState: false,
                onSuccess: () => {
                    onOpenChange(false);
                    onSuccess?.();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Transaction</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this transaction? This action cannot be undone and will affect your account balance.
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
                        Delete Transaction
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
