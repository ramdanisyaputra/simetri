import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateInput } from '@/components/ui/date-input';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';

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
}

interface RecurringTransactionFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    recurringTransaction?: RecurringTransaction;
    accounts: Account[];
    categories: Category[];
    onSuccess?: () => void;
}

export default function RecurringTransactionForm({
    open,
    onOpenChange,
    mode,
    recurringTransaction,
    accounts,
    categories,
    onSuccess,
}: RecurringTransactionFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        account_id: '',
        category_id: '',
        type: '',
        amount: '',
        description: '',
        frequency: '',
        day_of_month: '',
        start_date: '',
        end_date: '',
    });

    const transactionTypes = [
        { value: 'income', label: 'Pemasukan', icon: ArrowUp, color: 'text-green-600' },
        { value: 'expense', label: 'Pengeluaran', icon: ArrowDown, color: 'text-red-600' },
        { value: 'transfer', label: 'Transfer', icon: ArrowRight, color: 'text-blue-600' },
    ];

    const frequencies = [
        { value: 'daily', label: 'Harian' },
        { value: 'weekly', label: 'Mingguan' },
        { value: 'monthly', label: 'Bulanan' },
        { value: 'yearly', label: 'Tahunan' },
    ];

    const getFilteredCategories = (type: string) => {
        if (!type) return [];
        return categories.filter(category => category.type === type);
    };

    const formatNumberWithDots = (value: string | number): string => {
        // Simple formatting for Indonesian rupiah - no cents needed
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
            post(route('recurring-transactions.store'), {
                onSuccess: () => {
                    onOpenChange(false);
                    onSuccess?.();
                },
                onError: () => {
                    // Keep the modal open to show validation errors
                },
            });
        } else if (mode === 'edit' && recurringTransaction) {
            put(route('recurring-transactions.update', recurringTransaction.id), {
                onSuccess: () => {
                    onOpenChange(false);
                    onSuccess?.();
                },
                onError: () => {
                    // Keep the modal open to show validation errors
                },
            });
        }
    };

    // Load recurring transaction data when editing or reset when creating
    useEffect(() => {
        if (mode === 'edit' && recurringTransaction && open) {
            // For Indonesian rupiah, just use the amount as-is (no cents conversion)
            // Database stores 500000.00 → Frontend shows 500.000
            const amount = String(recurringTransaction.amount).replace('.00', '');
            
            // Fix date parsing to avoid timezone issues
            const parseDate = (dateString: string) => {
                if (!dateString) return '';
                // Simply extract the date part without any timezone conversion
                // If it's already in YYYY-MM-DD format, use it as-is
                // If it's ISO format like 2025-09-01T00:00:00.000Z, just take the date part
                return dateString.split('T')[0];
            };
            
            setData({
                account_id: String(recurringTransaction.account_id),
                category_id: String(recurringTransaction.category_id || ''),
                type: recurringTransaction.type,
                amount: amount,
                description: recurringTransaction.description || '',
                frequency: recurringTransaction.frequency,
                day_of_month: String(recurringTransaction.day_of_month || ''),
                start_date: parseDate(recurringTransaction.start_date),
                end_date: recurringTransaction.end_date ? parseDate(recurringTransaction.end_date) : '',
            });
        } else if (mode === 'create' && open) {
            reset();
        }
    }, [mode, recurringTransaction, open]);

    // Reset form when modal is closed
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto mx-4 w-[calc(100vw-2rem)] sm:w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                        {mode === 'create' ? 'Tambah Transaksi Berulang Baru' : 'Edit Transaksi Berulang'}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {mode === 'create' 
                            ? 'Atur transaksi yang akan berjalan secara otomatis sesuai jadwal.' 
                            : 'Perbarui informasi transaksi berulang Anda.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="type">Jenis Transaksi</Label>
                        <Select value={data.type} onValueChange={(value) => {
                            setData('type', value);
                            setData('category_id', ''); // Reset category when type changes
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis transaksi" />
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
                        <Label htmlFor="account">Akun</Label>
                        <Select value={data.account_id} onValueChange={(value) => setData('account_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih akun" />
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

                    <div>
                        <Label htmlFor="category">Kategori</Label>
                        <Select 
                            value={data.category_id} 
                            onValueChange={(value) => setData('category_id', value)}
                            disabled={data.type === 'transfer' || !data.type}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={
                                    data.type === 'transfer'
                                        ? "Transfer tidak memerlukan kategori"
                                        : !data.type 
                                            ? "Pilih jenis transaksi terlebih dahulu" 
                                            : "Pilih kategori"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {getFilteredCategories(data.type).map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        <div className="flex items-center gap-2">
                                            {category.icon && <span>{category.icon}</span>}
                                            {category.name}
                                            {category.user_id !== null && (
                                                <Badge variant="outline" className="text-xs ml-2">Kategori Kustom</Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                    </div>

                    <div>
                        <Label htmlFor="amount">Jumlah</Label>
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
                        <Label htmlFor="frequency">Frekuensi</Label>
                        <Select value={data.frequency} onValueChange={(value) => setData('frequency', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih frekuensi" />
                            </SelectTrigger>
                            <SelectContent>
                                {frequencies.map((freq) => (
                                    <SelectItem key={freq.value} value={freq.value}>
                                        {freq.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.frequency && <p className="text-sm text-red-600">{errors.frequency}</p>}
                    </div>

                    {(data.frequency === 'monthly' || data.frequency === 'yearly') && (
                        <div>
                            <Label htmlFor="day_of_month">Tanggal dalam Bulan</Label>
                            <Input
                                id="day_of_month"
                                type="number"
                                min="1"
                                max="31"
                                value={data.day_of_month}
                                onChange={(e) => setData('day_of_month', e.target.value)}
                                placeholder="1-31"
                            />
                            {errors.day_of_month && <p className="text-sm text-red-600">{errors.day_of_month}</p>}
                        </div>
                    )}

                    <div>
                        <Label htmlFor="start_date">Tanggal Mulai</Label>
                        <DateInput
                            id="start_date"
                            value={data.start_date}
                            onChange={(value) => setData('start_date', value)}
                        />
                        {errors.start_date && <p className="text-sm text-red-600">{errors.start_date}</p>}
                    </div>

                    <div>
                        <Label htmlFor="end_date">Tanggal Berakhir (Opsional)</Label>
                        <DateInput
                            id="end_date"
                            value={data.end_date}
                            onChange={(value) => setData('end_date', value)}
                        />
                        <p className="text-sm text-gray-500 mt-1">Kosongkan jika tidak ada batas waktu</p>
                        {errors.end_date && <p className="text-sm text-red-600">{errors.end_date}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Keterangan</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                            placeholder="Keterangan opsional..."
                            rows={3}
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto"
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing 
                                ? (mode === 'create' ? 'Menambahkan...' : 'Memperbarui...') 
                                : (mode === 'create' ? 'Tambah Transaksi Berulang' : 'Perbarui Transaksi Berulang')
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
