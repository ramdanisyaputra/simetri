import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DateInput } from '@/components/ui/date-input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Account, type Category, type Transaction } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { ArrowRightLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

interface TransactionFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    transaction?: Transaction | null;
    accounts: Account[];
    categories: Category[];
    onSuccess?: () => void;
}

export default function TransactionForm({
    open,
    onOpenChange,
    mode,
    transaction,
    accounts,
    categories,
    onSuccess
}: TransactionFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        account_id: '',
        category_id: '',
        type: '',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
        destination_account_id: '',
    });

    const transactionTypes = [
        { value: 'income', label: 'Income', icon: TrendingUp, color: 'text-green-600' },
        { value: 'expense', label: 'Expense', icon: TrendingDown, color: 'text-red-600' },
        { value: 'transfer', label: 'Transfer', icon: ArrowRightLeft, color: 'text-blue-600' },
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

    const handleAmountChange = (value: string) => {
        const cleanValue = parseFormattedNumber(value);
        setData('amount', cleanValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            router.post(route('transactions.store'), data, {
                preserveState: false,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        } else if (mode === 'edit' && transaction) {
            router.put(route('transactions.update', transaction.id), data, {
                preserveState: false,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        }
    };

    // Load transaction data when editing
    useEffect(() => {
        if (mode === 'edit' && transaction && open) {
            setData({
                account_id: String(transaction.account_id),
                category_id: String(transaction.category_id || ''),
                type: transaction.type,
                amount: String(transaction.amount),
                description: transaction.description || '',
                transaction_date: transaction.transaction_date.split('T')[0],
                destination_account_id: String(transaction.destination_account_id || ''),
            });
        } else if (mode === 'create' && open) {
            reset();
        }
    }, [mode, transaction, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Add New Transaction' : 'Edit Transaction'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create' 
                            ? 'Record your income, expense, or transfer.' 
                            : 'Update your transaction information.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="type">Transaction Type</Label>
                        <Select value={data.type} onValueChange={(value) => {
                            setData('type', value);
                            setData('category_id', ''); // Reset category when type changes
                            setData('destination_account_id', ''); // Reset destination account when type changes
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
                        {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                    </div>

                    <div>
                        <Label htmlFor="account">From Account</Label>
                        <Select value={data.account_id} onValueChange={(value) => setData('account_id', value)}>
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
                        {errors.account_id && <p className="text-sm text-red-600">{errors.account_id}</p>}
                    </div>

                    {data.type === 'transfer' && (
                        <div>
                            <Label htmlFor="destination-account">To Account</Label>
                            <Select value={data.destination_account_id} onValueChange={(value) => setData('destination_account_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select destination account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.filter(account => String(account.id) !== data.account_id).map((account) => (
                                        <SelectItem key={account.id} value={String(account.id)}>
                                            {account.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.destination_account_id && <p className="text-sm text-red-600">{errors.destination_account_id}</p>}
                        </div>
                    )}

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select 
                            value={data.category_id} 
                            onValueChange={(value) => setData('category_id', value)}
                            disabled={data.type === 'transfer' || !data.type}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={
                                    data.type === 'transfer'
                                        ? "Transfers don't require a category"
                                        : !data.type 
                                            ? "Select transaction type first" 
                                            : "Select category"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {getFilteredCategories(data.type).map((category) => (
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
                        {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                    </div>

                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="text"
                            value={formatNumberWithDots(data.amount)}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            placeholder="0"
                        />
                        {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                    </div>

                    <div>
                        <Label htmlFor="date">Date</Label>
                        <DateInput
                            id="date"
                            value={data.transaction_date}
                            onChange={(value) => setData('transaction_date', value)}
                        />
                        {errors.transaction_date && <p className="text-sm text-red-600">{errors.transaction_date}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                            placeholder="Optional description..."
                            rows={3}
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing 
                                ? (mode === 'create' ? 'Adding...' : 'Updating...') 
                                : (mode === 'create' ? 'Add Transaction' : 'Update Transaction')
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
