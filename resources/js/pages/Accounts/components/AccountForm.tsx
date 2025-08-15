import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { type Account } from '@/types';

interface AccountFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    account?: Account | null;
}

export default function AccountForm({ open, onOpenChange, mode, account }: AccountFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        type: '',
        initial_balance: '',
        description: '',
    });

    const accountTypes = [
        { value: 'checking', label: 'Rekening Giro' },
        { value: 'savings', label: 'Tabungan' },
        { value: 'credit', label: 'Kartu Kredit' },
        { value: 'investment', label: 'Investasi' },
        { value: 'cash', label: 'Tunai' },
        { value: 'other', label: 'Lainnya' },
    ];

    // Reset form when opening/closing modal or changing mode
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && account) {
                setData({
                    name: account.name,
                    type: account.type,
                    initial_balance: String(account.initial_balance),
                    description: '',
                });
            } else {
                reset();
            }
        }
    }, [open, mode, account]);

    const formatNumberWithDots = (value: string | number): string => {
        const numStr = String(value).replace(/\D/g, ''); // Remove non-digits
        if (!numStr) return '';
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parseFormattedNumber = (value: string): string => {
        return value.replace(/\./g, '');
    };

    const handleBalanceChange = (value: string) => {
        const cleanValue = parseFormattedNumber(value);
        setData('initial_balance', cleanValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post(route('accounts.store'), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else if (mode === 'edit' && account) {
            put(route('accounts.update', account.id), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Buat Akun Baru' : 'Edit Akun'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create' 
                            ? 'Tambahkan akun keuangan baru untuk melacak uang Anda.' 
                            : 'Perbarui informasi akun Anda.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nama Akun</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="mis. BCA Tabungan"
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>
                    
                    <div>
                        <Label htmlFor="type">Jenis Akun</Label>
                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis akun" />
                            </SelectTrigger>
                            <SelectContent>
                                {accountTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                    </div>
                    
                    <div>
                        <Label htmlFor="balance">Saldo Awal</Label>
                        <Input
                            id="balance"
                            type="text"
                            value={formatNumberWithDots(data.initial_balance)}
                            onChange={(e) => handleBalanceChange(e.target.value)}
                            placeholder="0"
                        />
                        {errors.initial_balance && <p className="text-sm text-red-600">{errors.initial_balance}</p>}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing 
                                ? (mode === 'create' ? 'Membuat...' : 'Memperbarui...') 
                                : (mode === 'create' ? 'Buat Akun' : 'Perbarui Akun')
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
