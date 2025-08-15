import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { type Account } from '@/types';
import AccountCard from './AccountCard';

interface AccountsListProps {
    accounts: Account[];
    onEdit: (account: Account) => void;
    onDelete: (account: Account) => void;
    onCreateNew: () => void;
}

export default function AccountsList({ accounts, onEdit, onDelete, onCreateNew }: AccountsListProps) {
    if (accounts.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="text-center">
                        <h3 className="text-lg font-medium">No accounts yet</h3>
                        <p className="text-muted-foreground mb-4">Get started by creating your first account.</p>
                        <Button onClick={onCreateNew}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
                <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
