import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';
import { type Account } from '@/types';

interface AccountCardProps {
    account: Account;
    onEdit: (account: Account) => void;
    onDelete: (account: Account) => void;
}

export default function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
    const accountTypes = [
        { value: 'checking', label: 'Rekening Giro' },
        { value: 'savings', label: 'Tabungan' },
        { value: 'credit', label: 'Kartu Kredit' },
        { value: 'investment', label: 'Investasi' },
        { value: 'cash', label: 'Tunai' },
        { value: 'other', label: 'Lainnya' },
    ];

    const getAccountTypeLabel = (type: string) => {
        const accountType = accountTypes.find(t => t.value === type);
        return accountType ? accountType.label : type;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                    {account.name}
                </CardTitle>
                <div className="flex space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(account)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(account)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="mb-2">
                    {getAccountTypeLabel(account.type)}
                </CardDescription>
                <div className="text-2xl font-bold">
                    {formatCurrency(parseInt(String(account.initial_balance)))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Dibuat {new Date(account.created_at).toLocaleDateString('id-ID')}
                </p>
            </CardContent>
        </Card>
    );
}
