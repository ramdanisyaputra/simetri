import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type Category, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Trash2, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface Props {
    userCategories: Category[];
    defaultCategories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function Index({ userCategories, defaultCategories }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const { data: createData, setData: setCreateData, post: createPost, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        type: '',
        icon: '',
    });

    const { data: editData, setData: setEditData, put: editPut, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        type: '',
        icon: '',
    });

    const categoryTypes = [
        { value: 'expense', label: 'Expense', icon: TrendingDown, color: 'text-red-600 bg-red-50 border-red-200' },
        { value: 'income', label: 'Income', icon: TrendingUp, color: 'text-green-600 bg-green-50 border-green-200' },
    ];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createPost(route('categories.store'), {
            onSuccess: () => {
                setCreateModalOpen(false);
                resetCreate();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCategory) {
            editPut(route('categories.update', selectedCategory.id), {
                onSuccess: () => {
                    setEditModalOpen(false);
                    setSelectedCategory(null);
                    resetEdit();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedCategory) {
            router.delete(route('categories.destroy', selectedCategory.id), {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setSelectedCategory(null);
                },
            });
        }
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setEditData({
            name: category.name,
            type: category.type,
            icon: category.icon || '',
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setDeleteModalOpen(true);
    };

    const getCategoryTypeInfo = (type: string) => {
        return categoryTypes.find(t => t.value === type) || categoryTypes[0];
    };

    const groupCategoriesByType = (categories: Category[]) => {
        return categories.reduce((acc, category) => {
            if (!acc[category.type]) {
                acc[category.type] = [];
            }
            acc[category.type].push(category);
            return acc;
        }, {} as Record<string, Category[]>);
    };

    const groupedUserCategories = groupCategoriesByType(userCategories);
    const groupedDefaultCategories = groupCategoriesByType(defaultCategories);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            
            <div className="space-y-6 m-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground">Manage your transaction categories</p>
                    </div>
                    
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Category</DialogTitle>
                                <DialogDescription>
                                    Add a new category to organize your transactions.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <Label htmlFor="create-name">Category Name</Label>
                                    <Input
                                        id="create-name"
                                        value={createData.name}
                                        onChange={(e) => setCreateData('name', e.target.value)}
                                        placeholder="e.g., Groceries, Salary"
                                    />
                                    {createErrors.name && <p className="text-sm text-red-600">{createErrors.name}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="create-type">Category Type</Label>
                                    <Select value={createData.type} onValueChange={(value) => setCreateData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category type" />
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
                                    {createErrors.type && <p className="text-sm text-red-600">{createErrors.type}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="create-icon">Icon (optional)</Label>
                                    <Input
                                        id="create-icon"
                                        value={createData.icon}
                                        onChange={(e) => setCreateData('icon', e.target.value)}
                                        placeholder="e.g., 🛒, 💰, 🎬"
                                    />
                                    {createErrors.icon && <p className="text-sm text-red-600">{createErrors.icon}</p>}
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
                                        {createProcessing ? 'Creating...' : 'Create Category'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* User Categories Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">Your Categories</h2>
                    </div>
                    
                    {userCategories.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium">No custom categories yet</h3>
                                    <p className="text-muted-foreground mb-4">Create your own categories to better organize your transactions.</p>
                                    <Button onClick={() => setCreateModalOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Category
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {categoryTypes.map((typeInfo) => {
                                const categories = groupedUserCategories[typeInfo.value] || [];
                                if (categories.length === 0) return null;
                                return (
                                    <div key={typeInfo.value}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <typeInfo.icon className="h-4 w-4" />
                                            <h3 className="text-lg font-medium">{typeInfo.label}</h3>
                                            <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${typeInfo.color}`}>
                                                {categories.length} categories
                                            </div>
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {categories.map((category) => (
                                                <Card key={category.id}>
                                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                            {category.icon && <span className="text-lg">{category.icon}</span>}
                                                            {category.name}
                                                        </CardTitle>
                                                        <div className="flex space-x-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openEditModal(category)}
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openDeleteModal(category)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${typeInfo.color}`}>
                                                            {typeInfo.label}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Default Categories Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">Default Categories</h2>
                        <Badge variant="secondary">System</Badge>
                    </div>
                    
                    <div className="space-y-6">
                        {categoryTypes.map((typeInfo) => {
                            const categories = groupedDefaultCategories[typeInfo.value] || [];
                            if (categories.length === 0) return null;
                            
                            return (
                                <div key={typeInfo.value}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <typeInfo.icon className="h-4 w-4" />
                                        <h3 className="text-lg font-medium">{typeInfo.label}</h3>
                                        <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${typeInfo.color}`}>
                                            {categories.length} categories
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center gap-2 rounded border px-2 py-1 bg-muted/50 text-sm"
                                            >
                                                {category.icon && <span className="text-base">{category.icon}</span>}
                                                <span>{category.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Edit Modal */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                                Update your category information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Category Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    placeholder="e.g., Groceries, Salary"
                                />
                                {editErrors.name && <p className="text-sm text-red-600">{editErrors.name}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="edit-type">Category Type</Label>
                                <Select value={editData.type} onValueChange={(value) => setEditData('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category type" />
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
                                {editErrors.type && <p className="text-sm text-red-600">{editErrors.type}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="edit-icon">Icon (optional)</Label>
                                <Input
                                    id="edit-icon"
                                    value={editData.icon}
                                    onChange={(e) => setEditData('icon', e.target.value)}
                                    placeholder="e.g., 🛒, 💰, 🎬"
                                />
                                {editErrors.icon && <p className="text-sm text-red-600">{editErrors.icon}</p>}
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
                                    {editProcessing ? 'Updating...' : 'Update Category'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Modal */}
                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Delete Category</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
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
                                Delete Category
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
