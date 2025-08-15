import AppLayout from '@/layouts/app-layout';
import { type Account, type BreadcrumbItem, type Category, type Transaction } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import DeleteTransactionDialog from './components/DeleteTransactionDialog';
import MonthlySummaryCards from './components/MonthlySummaryCards';
import TransactionFilters from './components/TransactionFilters';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

interface Props {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    monthlyIncome: number;
    monthlyExpense: number;
    currentMonth: string;
    selectedMonth: number;
    selectedYear: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transactions',
    },
];

export default function Index({ transactions, accounts, categories, monthlyIncome, monthlyExpense, currentMonth, selectedMonth, selectedYear }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
    
    const filteredTransactions = filterType === 'all' 
        ? transactions 
        : transactions.filter(t => t.type === filterType);

    const handleEditTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setEditModalOpen(true);
    };

    const handleDeleteTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setDeleteModalOpen(true);
    };

    const handleCreateTransaction = () => {
        setCreateModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />
            
            <div className="space-y-6 m-4">
                {/* Month Filter and Title */}
                <TransactionFilters
                    currentMonth={currentMonth}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                />

                {/* Monthly Summary Cards */}
                <MonthlySummaryCards
                    monthlyIncome={monthlyIncome}
                    monthlyExpense={monthlyExpense}
                    currentMonth={currentMonth}
                />

                {/* Transaction Type Filter */}
                <div className="flex gap-2 mb-4 overflow-auto">
                    {[
                        { key: 'all', label: 'Semua' },
                        { key: 'income', label: 'Pemasukan' },
                        { key: 'expense', label: 'Pengeluaran' },
                        { key: 'transfer', label: 'Transfer' }
                    ].map((type) => (
                        <button
                            key={type.key}
                            onClick={() => setFilterType(type.key as any)}
                            className={
                                `px-3 py-1 rounded-md text-sm font-medium focus:outline-none ` +
                                (filterType === type.key
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground hover:bg-accent')
                            }
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Transactions List */}
                <TransactionList
                    transactions={filteredTransactions}
                    accounts={accounts}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                    onCreateNew={handleCreateTransaction}
                />

                {/* Create Modal */}
                <TransactionForm
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                    mode="create"
                    accounts={accounts}
                    categories={categories}
                />

                {/* Edit Modal */}
                <TransactionForm
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    mode="edit"
                    transaction={selectedTransaction}
                    accounts={accounts}
                    categories={categories}
                />

                {/* Delete Modal */}
                <DeleteTransactionDialog
                    open={deleteModalOpen}
                    onOpenChange={setDeleteModalOpen}
                    transaction={selectedTransaction}
                />
            </div>
        </AppLayout>
    );
}
