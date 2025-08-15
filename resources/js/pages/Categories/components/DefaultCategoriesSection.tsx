import { Badge } from '@/components/ui/badge';
import { Tag, TrendingDown, TrendingUp } from 'lucide-react';
import { type Category } from '@/types';

interface DefaultCategoriesSectionProps {
    defaultCategories: Category[];
}

export default function DefaultCategoriesSection({ defaultCategories }: DefaultCategoriesSectionProps) {
    const categoryTypes = [
        { value: 'expense', label: 'Expense', icon: TrendingDown, color: 'text-red-600 bg-red-50 border-red-200' },
        { value: 'income', label: 'Income', icon: TrendingUp, color: 'text-green-600 bg-green-50 border-green-200' },
    ];

    const groupCategoriesByType = (categories: Category[]) => {
        return categories.reduce((acc, category) => {
            if (!acc[category.type]) {
                acc[category.type] = [];
            }
            acc[category.type].push(category);
            return acc;
        }, {} as Record<string, Category[]>);
    };

    const groupedDefaultCategories = groupCategoriesByType(defaultCategories);

    return (
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
    );
}
