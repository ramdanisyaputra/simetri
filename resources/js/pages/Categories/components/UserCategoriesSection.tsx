import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Plus, Tag, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { type Category } from '@/types';

interface UserCategoriesSectionProps {
    userCategories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onCreateNew: () => void;
}

export default function UserCategoriesSection({ userCategories, onEdit, onDelete, onCreateNew }: UserCategoriesSectionProps) {
    const categoryTypes = [
        { value: 'expense', label: 'Pengeluaran', icon: TrendingDown, color: 'text-red-600 bg-red-50 border-red-200' },
        { value: 'income', label: 'Pemasukan', icon: TrendingUp, color: 'text-green-600 bg-green-50 border-green-200' },
    ];

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

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Kategori Anda</h2>
            </div>
            
            {userCategories.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="text-center">
                            <h3 className="text-lg font-medium">Belum ada kategori kustom</h3>
                            <p className="text-muted-foreground mb-4">Buat kategori Anda sendiri untuk mengatur transaksi dengan lebih baik.</p>
                            <Button onClick={onCreateNew}>
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Kategori
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
                                        {categories.length} kategori
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
                                                        onClick={() => onEdit(category)}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDelete(category)}
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
    );
}
