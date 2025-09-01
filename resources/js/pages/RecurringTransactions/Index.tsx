import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Plus, Edit, Trash2, ArrowUp, ArrowDown, ArrowRight, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RecurringTransactionForm from './components/RecurringTransactionForm';
import DeleteRecurringTransactionModal from './components/DeleteRecurringTransactionModal';
import AppLayout from '@/layouts/app-layout';

interface Account {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    type: string;
    icon: string | null;
    user_id: number | null;
}

interface RecurringTransaction {
    id: number;
    account_id: number;
    category_id: number | null;
    type: string;
    amount: string;
    description: string | null;
    frequency: string;
    day_of_month: number | null;
    start_date: string;
    end_date: string | null;
    account: Account;
    category?: Category;
}

interface RecurringTransactionsIndexProps {
    recurringTransactions: RecurringTransaction[];
    accounts: Account[];
    categories: Category[];
}

export default function Index({ recurringTransactions, accounts, categories }: RecurringTransactionsIndexProps) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRecurringTransaction, setSelectedRecurringTransaction] = useState<RecurringTransaction | null>(null);
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');

    const filteredTransactions = filterType === 'all' 
        ? recurringTransactions 
        : recurringTransactions.filter(t => t.type === filterType);

    const handleCreateSuccess = () => {
        setCreateModalOpen(false);
        setSelectedRecurringTransaction(null);
    };

    const handleEditSuccess = () => {
        setEditModalOpen(false);
        setSelectedRecurringTransaction(null);
    };

    const handleDeleteSuccess = () => {
        setDeleteModalOpen(false);
        setSelectedRecurringTransaction(null);
    };

    const openEditModal = (recurringTransaction: RecurringTransaction) => {
        setSelectedRecurringTransaction(recurringTransaction);
        setEditModalOpen(true);
    };

    const openDeleteModal = (recurringTransaction: RecurringTransaction) => {
        setSelectedRecurringTransaction(recurringTransaction);
        setDeleteModalOpen(true);
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID');
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'income':
                return <ArrowUp className="h-4 w-4 text-green-600" />;
            case 'expense':
                return <ArrowDown className="h-4 w-4 text-red-600" />;
            case 'transfer':
                return <ArrowRight className="h-4 w-4 text-blue-600" />;
            default:
                return null;
        }
    };

    const getTypeLabel = (type: string) => {
        const types: { [key: string]: string } = {
            income: 'Pemasukan',
            expense: 'Pengeluaran',
            transfer: 'Transfer',
        };
        return types[type] || type;
    };

    const getTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (type) {
            case 'income':
                return 'default';
            case 'expense':
                return 'destructive';
            case 'transfer':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getNextExecutionDate = (transaction: RecurringTransaction) => {
        const startDate = new Date(transaction.start_date);
        const today = new Date();
        
        if (transaction.frequency === 'daily') {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + 1);
            return nextDate;
        }
        
        if (transaction.frequency === 'weekly') {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + (7 - today.getDay()));
            return nextDate;
        }
        
        if (transaction.frequency === 'monthly' && transaction.day_of_month) {
            const nextDate = new Date(today.getFullYear(), today.getMonth(), transaction.day_of_month);
            if (nextDate <= today) {
                nextDate.setMonth(nextDate.getMonth() + 1);
            }
            return nextDate;
        }
        
        if (transaction.frequency === 'yearly' && transaction.day_of_month) {
            const nextDate = new Date(today.getFullYear(), startDate.getMonth(), transaction.day_of_month);
            if (nextDate <= today) {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            }
            return nextDate;
        }
        
        return null;
    };

    const formatNextExecution = (date: Date | null) => {
        if (!date) return 'Tidak diketahui';
        
        const today = new Date();
        const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return 'Besok';
        if (diffDays <= 7) return `${diffDays} hari lagi`;
        
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <AppLayout>
            <Head title="Transaksi Berulang" />
            
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Transaksi Berulang</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            Kelola transaksi yang berjalan secara otomatis
                        </p>
                    </div>
                    <Button onClick={() => setCreateModalOpen(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Tambah Transaksi Berulang</span>
                        <span className="sm:hidden">Tambah Transaksi</span>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Aktif</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{recurringTransactions.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Transaksi berulang yang aktif
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pemasukan Bulanan</CardTitle>
                            <ArrowUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold break-all">
                                {formatAmount(
                                    recurringTransactions
                                        .filter(t => t.type === 'income' && t.frequency === 'monthly')
                                        .reduce((sum, t) => sum + parseInt(t.amount), 0)
                                        .toString()
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Estimasi pemasukan bulanan
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="sm:col-span-2 lg:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pengeluaran Bulanan</CardTitle>
                            <ArrowDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-2xl font-bold break-all">
                                {formatAmount(
                                    recurringTransactions
                                        .filter(t => t.type === 'expense' && t.frequency === 'monthly')
                                        .reduce((sum, t) => sum + parseInt(t.amount), 0)
                                        .toString()
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Estimasi pengeluaran bulanan
                            </p>
                        </CardContent>
                    </Card>
                </div>

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
                                `px-3 py-1 rounded-md text-sm font-medium focus:outline-none whitespace-nowrap ` +
                                (filterType === type.key
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground hover:bg-accent')
                            }
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Transaksi Berulang</CardTitle>
                        <CardDescription>
                            Semua transaksi berulang yang telah Anda atur
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                                <CalendarDays className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {filterType === 'all' 
                                        ? 'Belum ada transaksi berulang' 
                                        : `Belum ada transaksi ${filterType === 'income' ? 'pemasukan' : filterType === 'expense' ? 'pengeluaran' : 'transfer'} berulang`
                                    }
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 px-4 max-w-md">
                                    {filterType === 'all' 
                                        ? 'Mulai dengan menambahkan transaksi berulang pertama Anda'
                                        : `Belum ada transaksi ${filterType === 'income' ? 'pemasukan' : filterType === 'expense' ? 'pengeluaran' : 'transfer'} berulang`
                                    }
                                </p>
                                <Button onClick={() => setCreateModalOpen(true)} className="w-full sm:w-auto">
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Tambah Transaksi Berulang</span>
                                    <span className="sm:hidden">Tambah Transaksi</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredTransactions.map((transaction) => {
                                    const nextExecution = getNextExecutionDate(transaction);
                                    const isActive = !transaction.end_date || new Date(transaction.end_date) > new Date();
                                    
                                    return (
                                    <Card key={transaction.id} className="hover:shadow-sm transition-shadow">
                                        <CardContent className="p-3 sm:p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                {/* Left side - Main info */}
                                                <div className="flex-1 min-w-0">
                                                    {/* Transaction type and status */}
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {getTypeIcon(transaction.type)}
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                            {getTypeLabel(transaction.type)}
                                                        </span>
                                                        {!isActive && (
                                                            <Badge variant="outline" className="text-xs text-gray-500">
                                                                Berakhir
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Amount */}
                                                    <div className="font-bold text-lg sm:text-xl mb-2" 
                                                         style={{ color: transaction.type === 'income' ? '#16a34a' : transaction.type === 'expense' ? '#dc2626' : '#2563eb' }}>
                                                        {formatAmount(transaction.amount)}
                                                    </div>
                                                    
                                                    {/* Account and category - compact */}
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        <div className="truncate">
                                                            <span className="font-medium">{transaction.account.name}</span>
                                                            {transaction.category && (
                                                                <span className="text-gray-500">
                                                                    {' • '}
                                                                    {transaction.category.icon && <span className="mr-1">{transaction.category.icon}</span>}
                                                                    {transaction.category.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Frequency and schedule info - compact badges */}
                                                    <div className="flex flex-wrap gap-1 items-center">
                                                        <Badge variant="outline" className="text-xs">
                                                            {formatFrequency(transaction.frequency)}
                                                        </Badge>
                                                        
                                                        {(transaction.frequency === 'monthly' || transaction.frequency === 'yearly') && transaction.day_of_month && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Tgl {transaction.day_of_month}
                                                            </Badge>
                                                        )}
                                                        
                                                        {isActive && nextExecution && (
                                                            <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                {formatNextExecution(nextExecution)}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Description - only show if exists, compact */}
                                                    {transaction.description && (
                                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic truncate">
                                                            "{transaction.description}"
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Right side - Actions */}
                                                <div className="flex-shrink-0">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Buka menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEditModal(transaction)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                onClick={() => openDeleteModal(transaction)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                            
                                            {/* Period info - at bottom, smaller */}
                                            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(transaction.start_date)} - {transaction.end_date ? formatDate(transaction.end_date) : 'Tidak terbatas'}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            <RecurringTransactionForm
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                mode="create"
                accounts={accounts}
                categories={categories}
                onSuccess={handleCreateSuccess}
            />

            {selectedRecurringTransaction && (
                <RecurringTransactionForm
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    mode="edit"
                    recurringTransaction={selectedRecurringTransaction}
                    accounts={accounts}
                    categories={categories}
                    onSuccess={handleEditSuccess}
                />
            )}

            {selectedRecurringTransaction && (
                <DeleteRecurringTransactionModal
                    open={deleteModalOpen}
                    onOpenChange={setDeleteModalOpen}
                    recurringTransaction={selectedRecurringTransaction}
                    onSuccess={handleDeleteSuccess}
                />
            )}
        </AppLayout>
    );
}
