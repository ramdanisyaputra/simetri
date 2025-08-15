import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CategoriesHeaderProps {
    onCreateCategory: () => void;
}

export default function CategoriesHeader({ onCreateCategory }: CategoriesHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kategori</h1>
                <p className="text-muted-foreground">Kelola kategori transaksi Anda</p>
            </div>
            
            <Button onClick={onCreateCategory}>
                <Plus className="mr-2 h-4 w-4" />
                Buat Kategori
            </Button>
        </div>
    );
}
