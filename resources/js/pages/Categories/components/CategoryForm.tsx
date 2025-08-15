import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
import { type Category } from '@/types';

interface CategoryFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    category?: Category | null;
}

export default function CategoryForm({ open, onOpenChange, mode, category }: CategoryFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        type: '',
        icon: '',
    });

    const categoryTypes = [
        { value: 'expense', label: 'Pengeluaran', icon: TrendingDown, color: 'text-red-600 bg-red-50 border-red-200' },
        { value: 'income', label: 'Pemasukan', icon: TrendingUp, color: 'text-green-600 bg-green-50 border-green-200' },
    ];

    // Reset form when opening/closing modal or changing mode
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && category) {
                setData({
                    name: category.name,
                    type: category.type,
                    icon: category.icon || '',
                });
            } else {
                reset();
            }
        }
    }, [open, mode, category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post(route('categories.store'), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else if (mode === 'edit' && category) {
            put(route('categories.update', category.id), {
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
                        {mode === 'create' ? 'Buat Kategori Baru' : 'Edit Kategori'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create' 
                            ? 'Tambahkan kategori baru untuk mengatur transaksi Anda.' 
                            : 'Perbarui informasi kategori Anda.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nama Kategori</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="mis. Belanja, Gaji"
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>
                    
                    <div>
                        <Label htmlFor="type">Jenis Kategori</Label>
                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                            <type.icon className="h-4 w-4" />
                                            {type.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
                    </div>
                    
                    <div>
                        <Label htmlFor="icon">Ikon (opsional)</Label>
                        <Input
                            id="icon"
                            value={data.icon}
                            onChange={(e) => setData('icon', e.target.value)}
                            placeholder="mis. 🛒, 💰, 🎬"
                        />
                        {errors.icon && <p className="text-sm text-red-600">{errors.icon}</p>}
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
                                : (mode === 'create' ? 'Buat Kategori' : 'Perbarui Kategori')
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
