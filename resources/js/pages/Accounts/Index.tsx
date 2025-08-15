import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type Account, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

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

    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        type: '',
        initial_balance: '',
        description: '',
    });

    // Reset create form when opening create modal
    useEffect(() => {
        if (createModalOpen) {
            resetCreate();
        }
    }, [createModalOpen]);

    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        type: '',
        initial_balance: '',
        description: '',
    });

    const accountTypes = [
        { value: 'checking', label: 'Checking' },
        { value: 'savings', label: 'Savings' },
        { value: 'credit', label: 'Credit Card' },
        { value: 'investment', label: 'Investment' },
        { value: 'cash', label: 'Cash' },
        { value: 'other', label: 'Other' },
    ];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createPost(route('accounts.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                resetCreate();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedAccount) {
            editPut(route('accounts.update', selectedAccount.id), {
                onSuccess: () => {
                    setEditModalOpen(false);
                    setSelectedAccount(null);
                    resetEdit();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedAccount) {
            router.delete(route('accounts.destroy', selectedAccount.id), {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setSelectedAccount(null);
                },
            });
        }
    };

    const openEditModal = (account: Account) => {
        setSelectedAccount(account);
        setEditData({
            name: account.name,
            type: account.type,
            initial_balance: String(account.initial_balance),
            description: '',
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (account: Account) => {
        setSelectedAccount(account);
        setDeleteModalOpen(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getAccountTypeLabel = (type: string) => {
        const accountType = accountTypes.find(t => t.value === type);
        return accountType ? accountType.label : type;
    };

    const formatNumberWithDots = (value: string | number): string => {
        const numStr = String(value).replace(/\D/g, ''); // Remove non-digits
        if (!numStr) return '';
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parseFormattedNumber = (value: string): string => {
        return value.replace(/\./g, '');
    };

    const handleBalanceChange = (value: string, setData: any, field: string) => {
        const cleanValue = parseFormattedNumber(value);
        setData(field, cleanValue);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />
            
            <div className="space-y-6 m-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                        <p className="text-muted-foreground">Manage your financial accounts</p>
                    </div>
                    
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Account</DialogTitle>
                                <DialogDescription>
                                    Add a new financial account to track your money.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <Label htmlFor="create-name">Account Name</Label>
                                    <Input
                                        id="create-name"
                                        value={createData.name}
                                        onChange={(e) => setCreateData('name', e.target.value)}
                                        placeholder="e.g., Chase Checking"
                                    />
                                    {createErrors.name && <p className="text-sm text-red-600">{createErrors.name}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="create-type">Account Type</Label>
                                    <Select value={createData.type} onValueChange={(value) => setCreateData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select account type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accountTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createErrors.type && <p className="text-sm text-red-600">{createErrors.type}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="create-balance">Initial Balance</Label>
                                    <Input
                                        id="create-balance"
                                        type="text"
                                        value={formatNumberWithDots(createData.initial_balance)}
                                        onChange={(e) => handleBalanceChange(e.target.value, setCreateData, 'initial_balance')}
                                        placeholder="0"
                                    />
                                    {createErrors.initial_balance && <p className="text-sm text-red-600">{createErrors.initial_balance}</p>}
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
                                        {createProcessing ? 'Creating...' : 'Create Account'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {accounts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="text-center">
                                <h3 className="text-lg font-medium">No accounts yet</h3>
                                <p className="text-muted-foreground mb-4">Get started by creating your first account.</p>
                                <Button onClick={() => setCreateModalOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {accounts.map((account) => (
                            <Card key={account.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-medium">
                                        {account.name}
                                    </CardTitle>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditModal(account)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openDeleteModal(account)}
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
                                        Created {new Date(account.created_at).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Account</DialogTitle>
                            <DialogDescription>
                                Update your account information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Account Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    placeholder="e.g., Chase Checking"
                                />
                                {editErrors.name && <p className="text-sm text-red-600">{editErrors.name}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="edit-type">Account Type</Label>
                                <Select value={editData.type} onValueChange={(value) => setEditData('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accountTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.type && <p className="text-sm text-red-600">{editErrors.type}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="edit-balance">Initial Balance</Label>
                                <Input
                                    id="edit-balance"
                                    type="text"
                                    value={formatNumberWithDots(editData.initial_balance)}
                                    onChange={(e) => handleBalanceChange(e.target.value, setEditData, 'initial_balance')}
                                    placeholder="0"
                                />
                                {editErrors.initial_balance && <p className="text-sm text-red-600">{editErrors.initial_balance}</p>}
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
                                    {editProcessing ? 'Updating...' : 'Update Account'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{selectedAccount?.name}"? This action cannot be undone.
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
                                Delete Account
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
