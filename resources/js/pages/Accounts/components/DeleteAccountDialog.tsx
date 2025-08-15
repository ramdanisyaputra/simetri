import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { type Account } from '@/types';

interface DeleteAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: Account | null;
}

export default function DeleteAccountDialog({ open, onOpenChange, account }: DeleteAccountDialogProps) {
    const handleDelete = () => {
        if (account) {
            router.delete(route('accounts.destroy', account.id), {
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
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{account?.name}"? This action cannot be undone.
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
                        Delete Account
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
