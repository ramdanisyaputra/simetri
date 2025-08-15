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
                    <DialogTitle>Hapus Akun</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus "{account?.name}"? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Hapus Akun
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
