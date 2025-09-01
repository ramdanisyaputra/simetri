import React from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RecurringTransaction {
    id: number;
    type: string;
    amount: string;
    description: string | null;
    frequency: string;
    start_date: string;
    end_date: string | null;
    account: {
        name: string;
    };
    category?: {
        name: string;
    };
}

interface DeleteRecurringTransactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recurringTransaction: RecurringTransaction;
    onSuccess?: () => void;
}

export default function DeleteRecurringTransactionModal({
    open,
    onOpenChange,
    recurringTransaction,
    onSuccess,
}: DeleteRecurringTransactionModalProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('recurring-transactions.destroy', recurringTransaction.id), {
            preserveState: false,
            onSuccess: () => {
                onOpenChange(false);
                onSuccess?.();
            },
        });
    };

    const formatAmount = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(parseInt(amount));
    };

    const formatFrequency = (frequency: string) => {
        const frequencies: { [key: string]: string } = {
            daily: 'Harian',
            weekly: 'Mingguan',
            monthly: 'Bulanan',
            yearly: 'Tahunan',
        };
        return frequencies[frequency] || frequency;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md mx-4 w-[calc(100vw-2rem)] sm:w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Hapus Transaksi Berulang</DialogTitle>
                    <DialogDescription className="text-sm">
                        Apakah Anda yakin ingin menghapus transaksi berulang ini? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Jumlah:</span>
                        <span className="font-medium">{formatAmount(recurringTransaction.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Frekuensi:</span>
                        <span className="font-medium">{formatFrequency(recurringTransaction.frequency)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Akun:</span>
                        <span className="font-medium">{recurringTransaction.account.name}</span>
                    </div>
                    {recurringTransaction.category && (
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Kategori:</span>
                            <span className="font-medium">{recurringTransaction.category.name}</span>
                        </div>
                    )}
                    {recurringTransaction.description && (
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Keterangan:</span>
                            <span className="font-medium">{recurringTransaction.description}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                        className="w-full sm:w-auto"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                        className="w-full sm:w-auto"
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
