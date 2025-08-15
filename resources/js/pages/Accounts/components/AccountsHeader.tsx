import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AccountsHeaderProps {
    onCreateAccount: () => void;
}

export default function AccountsHeader({ onCreateAccount }: AccountsHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Akun</h1>
                <p className="text-muted-foreground">Kelola akun keuangan Anda</p>
            </div>
            
            <Button onClick={onCreateAccount}>
                <Plus className="mr-2 h-4 w-4" />
                Buat Akun
            </Button>
        </div>
    );
}
