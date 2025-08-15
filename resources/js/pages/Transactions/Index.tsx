import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateInput } from '@/components/ui/date-input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type Account, type BreadcrumbItem, type Category, type Transaction } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowUpRight, Calendar, Edit, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Props {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    monthlyIncome: number;
    monthlyExpense: number;
    currentMonth: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/transactions',
    },
];

export default function Index({ transactions, accounts, categories, monthlyIncome, monthlyExpense, currentMonth }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        account_id: '',
        category_id: '',
        type: '',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
    });

    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        account_id: '',
        category_id: '',
        type: '',
        amount: '',
        description: '',
        transaction_date: '',
    });

    const transactionTypes = [
        { value: 'income', label: 'Income', icon: TrendingUp, color: 'text-green-600' },
        { value: 'expense', label: 'Expense', icon: TrendingDown, color: 'text-red-600' },
    ];

    // Filter categories based on selected transaction type
    const getFilteredCategories = (type: string) => {
        if (!type) return [];
        return categories.filter(category => category.type === type);
    };

    const formatNumberWithDots = (value: string | number): string => {
        const numStr = String(value).replace(/\D/g, ''); // Remove non-digits
        if (!numStr) return '';
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parseFormattedNumber = (value: string): string => {
        return value.replace(/\./g, '');
    };

    const handleAmountChange = (value: string, setData: any, field: string) => {
        const cleanValue = parseFormattedNumber(value);
        setData(field, cleanValue);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getTransactionTypeInfo = (type: string) => {
        const typeInfo = transactionTypes.find(t => t.value === type);
        return typeInfo || { label: type, icon: TrendingUp, color: 'text-gray-600' };
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('transactions.store'), createData, {
            preserveState: false,
            onSuccess: () => {
                setCreateModalOpen(false);
                resetCreate();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTransaction) {
            router.put(route('transactions.update', selectedTransaction.id), editData, {
                preserveState: false,
                onSuccess: () => {
                    setEditModalOpen(false);
                    setSelectedTransaction(null);
                    resetEdit();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedTransaction) {
            router.delete(route('transactions.destroy', selectedTransaction.id), {
                preserveState: false,
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setSelectedTransaction(null);
                },
            });
        }
    };

    const openEditModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setEditData({
            account_id: String(transaction.account_id),
            category_id: String(transaction.category_id),
            type: transaction.type,
            amount: String(transaction.amount),
            description: transaction.description || '',
            transaction_date: transaction.transaction_date.split('T')[0],
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setDeleteModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            
            <div className="space-y-6 m-4">
                {/* Monthly Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Income This Month</CardTitle>
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                                {formatCurrency(monthlyIncome)}
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-500 mt-1">{currentMonth}</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">Expenses This Month</CardTitle>
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                                {formatCurrency(monthlyExpense)}
                            </div>
                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">{currentMonth}</p>
                        </CardContent>
                    </Card>
                    
                    <Card className={`border-blue-200 dark:border-blue-800 ${monthlyIncome - monthlyExpense >= 0 ? 'bg-blue-50/50 dark:bg-blue-950/30' : 'bg-orange-50/50 dark:bg-orange-950/30'}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Net Income</CardTitle>
                            <div className={`p-2 rounded-full ${monthlyIncome - monthlyExpense >= 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-orange-100 dark:bg-orange-900'}`}>
                                <ArrowUpRight className={`h-4 w-4 ${monthlyIncome - monthlyExpense >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${monthlyIncome - monthlyExpense >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}`}>
                                {formatCurrency(monthlyIncome - monthlyExpense)}
                            </div>
                            <p className={`text-xs mt-1 ${monthlyIncome - monthlyExpense >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-orange-600 dark:text-orange-500'}`}>
                                {currentMonth}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Header with Add Transaction Button */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                        <p className="text-muted-foreground">Track your income and expenses</p>
                    </div>
                    
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add New Transaction</DialogTitle>
                                <DialogDescription>
                                    Record your income, expense, or transfer.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <Label htmlFor="create-type">Transaction Type</Label>
                                    <Select value={createData.type} onValueChange={(value) => {
                                        setCreateData('type', value);
                                        setCreateData('category_id', ''); // Reset category when type changes
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select transaction type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {transactionTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <div className="flex items-center">
                                                        <type.icon className={`mr-2 h-4 w-4 ${type.color}`} />
                                                        {type.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createErrors.type && <p className="text-sm text-red-600">{createErrors.type}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="create-account">Account</Label>
                                    <Select value={createData.account_id} onValueChange={(value) => setCreateData('account_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.map((account) => (
                                                <SelectItem key={account.id} value={String(account.id)}>
                                                    {account.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createErrors.account_id && <p className="text-sm text-red-600">{createErrors.account_id}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="create-category">Category</Label>
                                    <Select 
                                        value={createData.category_id} 
                                        onValueChange={(value) => setCreateData('category_id', value)}
                                        disabled={!createData.type}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={
                                                !createData.type 
                                                    ? "Select transaction type first" 
                                                    : "Select category"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getFilteredCategories(createData.type).map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    <div className="flex items-center gap-2">
                                                        {category.icon && <span>{category.icon}</span>}
                                                        {category.name}
                                                        {category.user_id !== null && (
                                                            <Badge variant="outline" className="text-xs ml-2">Custom Category</Badge>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createErrors.category_id && <p className="text-sm text-red-600">{createErrors.category_id}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="create-amount">Amount</Label>
                                    <Input
                                        id="create-amount"
                                        type="text"
                                        onChange={(e) => handleAmountChange(e.target.value, setCreateData, 'amount')}
                                        placeholder="0"
                                    />
                                    {createErrors.amount && <p className="text-sm text-red-600">{createErrors.amount}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="create-date">Date</Label>
                                    <DateInput
                                        id="create-date"
                                        value={createData.transaction_date}
                                        onChange={(value) => setCreateData('transaction_date', value)}
                                    />
                                    {createErrors.transaction_date && <p className="text-sm text-red-600">{createErrors.transaction_date}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="create-description">Description</Label>
                                    <Textarea
                                        id="create-description"
                                        value={createData.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCreateData('description', e.target.value)}
                                        placeholder="Optional description..."
                                        rows={3}
                                    />
                                    {createErrors.description && <p className="text-sm text-red-600">{createErrors.description}</p>}
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCreateModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={createProcessing}>
                                        {createProcessing ? 'Adding...' : 'Add Transaction'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Transactions List */}
                {transactions.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-24">
                            <div className="text-center max-w-md">
                                <div className="mx-auto mb-6 p-4 bg-gray-50 rounded-full w-fit">
                                    <Calendar className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
                                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                                    Start tracking your finances by recording your first income or expense transaction.
                                </p>
                                <Button onClick={() => setCreateModalOpen(true)} size="lg">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Add Your First Transaction
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h2>
                            <p className="text-sm text-muted-foreground">{transactions.length} transactions</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {transactions.map((transaction) => {
                                const typeInfo = getTransactionTypeInfo(transaction.type);
                                const TypeIcon = typeInfo.icon;
                            
                            return (
                                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        {/* Mobile-First Layout */}
                                        <div className="space-y-3">
                                            {/* Top Row: Icon, Category, Badge, Actions */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <div className={`p-2 rounded-full bg-muted flex-shrink-0`}>
                                                        <TypeIcon className={`h-4 w-4 ${typeInfo.color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                                                                {transaction.category?.name}
                                                            </h3>
                                                            <Badge variant="outline" className={`${typeInfo.color} text-xs`}>
                                                                {typeInfo.label}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Action Buttons - Hidden on small screens, shown on larger */}
                                                <div className="hidden sm:flex space-x-1 flex-shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(transaction)}
                                                        className="h-8 w-8 p-0 hover:bg-blue-50"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(transaction)}
                                                        className="h-8 w-8 p-0 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="pl-11">
                                                <div className={`text-xl font-bold ${typeInfo.color}`}>
                                                    {transaction.type === 'expense' ? '-' : '+'}
                                                    {formatCurrency(transaction.amount)}
                                                </div>
                                            </div>

                                            {/* Account */}
                                            <div className="pl-11">
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {transaction.account?.name}
                                                </p>
                                            </div>

                                            {/* Description (if exists) */}
                                            {transaction.description && (
                                                <div className="pl-11">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded border-l-2 border-gray-300 dark:border-gray-600">
                                                        {transaction.description}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Date and Mobile Actions */}
                                            <div className="flex items-center justify-between pl-11">
                                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(transaction.transaction_date).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                
                                                {/* Action Buttons - Shown on small screens only */}
                                                <div className="flex sm:hidden space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditModal(transaction)}
                                                        className="h-8 w-8 p-0 hover:bg-blue-50"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(transaction)}
                                                        className="h-8 w-8 p-0 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Transaction</DialogTitle>
                            <DialogDescription>
                                Update your transaction information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-type">Transaction Type</Label>
                                <Select value={editData.type} onValueChange={(value) => {
                                    setEditData('type', value);
                                    setEditData('category_id', ''); // Reset category when type changes
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select transaction type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {transactionTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div className="flex items-center">
                                                    <type.icon className={`mr-2 h-4 w-4 ${type.color}`} />
                                                    {type.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.type && <p className="text-sm text-red-600">{editErrors.type}</p>}
                            </div>

                            <div>
                                <Label htmlFor="edit-account">Account</Label>
                                <Select value={editData.account_id} onValueChange={(value) => setEditData('account_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem key={account.id} value={String(account.id)}>
                                                {account.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.account_id && <p className="text-sm text-red-600">{editErrors.account_id}</p>}
                            </div>

                            <div>
                                <Label htmlFor="edit-category">Category</Label>
                                <Select 
                                    value={editData.category_id} 
                                    onValueChange={(value) => setEditData('category_id', value)}
                                    disabled={!editData.type}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={
                                            !editData.type 
                                                ? "Select transaction type first" 
                                                : "Select category"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getFilteredCategories(editData.type).map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>
                                                <div className="flex items-center gap-2">
                                                    {category.icon && <span>{category.icon}</span>}
                                                    {category.name}
                                                    {category.user_id !== null && (
                                                        <Badge variant="outline" className="text-xs ml-2">Custom Category</Badge>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.category_id && <p className="text-sm text-red-600">{editErrors.category_id}</p>}
                            </div>

                            <div>
                                <Label htmlFor="edit-amount">Amount</Label>
                                <Input
                                    id="edit-amount"
                                    type="text"
                                    value={formatNumberWithDots(editData.amount)}
                                    onChange={(e) => handleAmountChange(e.target.value, setEditData, 'amount')}
                                    placeholder="0"
                                />
                                {editErrors.amount && <p className="text-sm text-red-600">{editErrors.amount}</p>}
                            </div>

                            <div>
                                <Label htmlFor="edit-date">Date</Label>
                                <DateInput
                                    id="edit-date"
                                    value={editData.transaction_date}
                                    onChange={(value) => setEditData('transaction_date', value)}
                                />
                                {editErrors.transaction_date && <p className="text-sm text-red-600">{editErrors.transaction_date}</p>}
                            </div>

                            <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditData('description', e.target.value)}
                                    placeholder="Optional description..."
                                    rows={3}
                                />
                                {editErrors.description && <p className="text-sm text-red-600">{editErrors.description}</p>}
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editProcessing}>
                                    {editProcessing ? 'Updating...' : 'Update Transaction'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Modal */}
                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
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
                                onClick={() => setDeleteModalOpen(false)}
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
            </div>
        </AppLayout>
    );
}
