import AppLayout from '@/layouts/app-layout';
import { type Account, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AccountsHeader from './components/AccountsHeader';
import AccountsList from './components/AccountsList';
import AccountForm from './components/AccountForm';
import DeleteAccountDialog from './components/DeleteAccountDialog';

interface Props {
    accounts: Account[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: '/accounts',
    },
];

export default function Index({ accounts }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const handleEditAccount = (account: Account) => {
        setSelectedAccount(account);
        setEditModalOpen(true);
    };

    const handleDeleteAccount = (account: Account) => {
        setSelectedAccount(account);
        setDeleteModalOpen(true);
    };

    const handleCreateAccount = () => {
        setCreateModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />
            
            <div className="space-y-6 m-4">
                {/* Header */}
                <AccountsHeader onCreateAccount={handleCreateAccount} />

                {/* Accounts List */}
                <AccountsList
                    accounts={accounts}
                    onEdit={handleEditAccount}
                    onDelete={handleDeleteAccount}
                    onCreateNew={handleCreateAccount}
                />

                {/* Create Modal */}
                <AccountForm
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                    mode="create"
                />

                {/* Edit Modal */}
                <AccountForm
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    mode="edit"
                    account={selectedAccount}
                />

                {/* Delete Modal */}
                <DeleteAccountDialog
                    open={deleteModalOpen}
                    onOpenChange={setDeleteModalOpen}
                    account={selectedAccount}
                />
            </div>
        </AppLayout>
    );
}
