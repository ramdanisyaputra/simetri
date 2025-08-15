import AppLayout from '@/layouts/app-layout';
import { type Category, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import CategoriesHeader from './components/CategoriesHeader';
import UserCategoriesSection from './components/UserCategoriesSection';
import DefaultCategoriesSection from './components/DefaultCategoriesSection';
import CategoryForm from './components/CategoryForm';
import DeleteCategoryDialog from './components/DeleteCategoryDialog';

interface Props {
    userCategories: Category[];
    defaultCategories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori',
        href: '/categories',
    },
];

export default function Index({ userCategories, defaultCategories }: Props) {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setEditModalOpen(true);
    };

    const handleDeleteCategory = (category: Category) => {
        setSelectedCategory(category);
        setDeleteModalOpen(true);
    };

    const handleCreateCategory = () => {
        setCreateModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori" />
            
            <div className="space-y-6 m-4">
                {/* Header */}
                <CategoriesHeader onCreateCategory={handleCreateCategory} />

                {/* User Categories Section */}
                <UserCategoriesSection
                    userCategories={userCategories}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    onCreateNew={handleCreateCategory}
                />

                {/* Default Categories Section */}
                <DefaultCategoriesSection
                    defaultCategories={defaultCategories}
                />

                {/* Create Modal */}
                <CategoryForm
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                    mode="create"
                />

                {/* Edit Modal */}
                <CategoryForm
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    mode="edit"
                    category={selectedCategory}
                />

                {/* Delete Modal */}
                <DeleteCategoryDialog
                    open={deleteModalOpen}
                    onOpenChange={setDeleteModalOpen}
                    category={selectedCategory}
                />
            </div>
        </AppLayout>
    );
}
