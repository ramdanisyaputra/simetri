import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Account, type Transaction } from '@/types';
import { Calendar, Plus } from 'lucide-react';
import TransactionCard from './TransactionCard';

interface TransactionListProps {
    transactions: Transaction[];
    accounts: Account[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
    onCreateNew: () => void;
}

export default function TransactionList({ 
    transactions, 
    accounts, 
    onEdit, 
    onDelete, 
    onCreateNew 
}: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-24">
                    <div className="text-center max-w-md">
                        <div className="mx-auto mb-6 p-4 bg-gray-50 rounded-full w-fit">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Belum ada transaksi</h3>
                        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                            Mulai kelola keuangan Anda dengan mencatat transaksi pemasukan atau pengeluaran pertama.
                        </p>
                        <Button onClick={onCreateNew} size="lg">
                            <Plus className="mr-2 h-5 w-5" />
                            Tambah Transaksi Pertama
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {/* Recent Transactions Header with Filter and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Transaksi Terbaru</h2>
                    <p className="text-sm text-muted-foreground">{transactions.length} transaksi</p>
                </div>
                <Button size="sm" onClick={onCreateNew}>
                    <Plus className="mr-1 h-4 w-4" /> Tambah Transaksi
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {transactions.map((transaction) => (
                    <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        accounts={accounts}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </>
    );
}
