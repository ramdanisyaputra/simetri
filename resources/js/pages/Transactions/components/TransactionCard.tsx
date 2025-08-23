import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Account, type Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Edit, Trash2, TrendingDown, TrendingUp, ArrowRightLeft } from 'lucide-react';

interface TransactionCardProps {
    transaction: Transaction;
    accounts: Account[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
}

export default function TransactionCard({ transaction, accounts, onEdit, onDelete }: TransactionCardProps) {
    const getTransactionTypeInfo = (type: string) => {
        const transactionTypes = [
            { value: 'income', label: 'Pemasukan', icon: TrendingUp, color: 'text-green-600' },
            { value: 'expense', label: 'Pengeluaran', icon: TrendingDown, color: 'text-red-600' },
            { value: 'transfer', label: 'Transfer', icon: ArrowRightLeft, color: 'text-blue-600' },
        ];
        
        const typeInfo = transactionTypes.find(t => t.value === type);
        return typeInfo || { label: type, icon: TrendingUp, color: 'text-gray-600' };
    };

    const typeInfo = getTransactionTypeInfo(transaction.type);
    const TypeIcon = typeInfo.icon;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                {/* Mobile-First Layout */}
                <div className="space-y-3">
                    {/* Top Row: Icon, Category, Badge, Actions */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-full bg-muted flex-shrink-0`}>
                                <TypeIcon className={`h-4 w-4 ${typeInfo.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                                        {transaction.category?.name || 'Transfer'}
                                    </h3>
                                    <Badge variant="outline" className={`${typeInfo.color} text-xs`}>
                                        {typeInfo.label}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons - Hidden on small screens, shown on larger */}
                        <div className="hidden sm:flex space-x-1 flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(transaction)}
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(transaction)}
                                className="h-8 w-8 p-0 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="pl-11">
                        <div className={`text-xl font-bold ${typeInfo.color}`}>
                            {transaction.type === 'expense' ? '-' : transaction.type === 'income' ? '+' : ''}
                            {formatCurrency(transaction.amount)}
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="pl-11">
                        {transaction.type === 'transfer' ? (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Dari: <span className="font-medium">{transaction.account?.name}</span>
                                {transaction.destination_account_id && (
                                    <> → Ke: <span className="font-medium">{accounts.find(acc => acc.id === transaction.destination_account_id)?.name}</span></>
                                )}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {transaction.account?.name}
                            </p>
                        )}
                    </div>

                    {/* Description (if exists) */}
                    {transaction.description && (
                        <div className="pl-11">
                            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded border-l-2 border-gray-300 dark:border-gray-600">
                                {transaction.description}
                            </p>
                        </div>
                    )}

                    {/* Date and Mobile Actions */}
                    <div className="flex items-center justify-between pl-11">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {new Date(transaction.transaction_date).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        
                        {/* Action Buttons - Shown on small screens only */}
                        <div className="flex sm:hidden space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(transaction)}
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(transaction)}
                                className="h-8 w-8 p-0 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
