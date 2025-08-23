import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';

interface MonthlySummaryCardsProps {
    monthlyIncome: number;
    monthlyExpense: number;
    currentMonth: string;
}

export default function MonthlySummaryCards({ monthlyIncome, monthlyExpense, currentMonth }: MonthlySummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Pemasukan Bulan Ini</CardTitle>
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {formatCurrency(monthlyIncome)}
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1">{currentMonth}</p>
                </CardContent>
            </Card>
            
            <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">Pengeluaran Bulan Ini</CardTitle>
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                        {formatCurrency(monthlyExpense)}
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-500 mt-1">{currentMonth}</p>
                </CardContent>
            </Card>
            
            <Card className={`border-blue-200 dark:border-blue-800 ${monthlyIncome - monthlyExpense >= 0 ? 'bg-blue-50/50 dark:bg-blue-950/30' : 'bg-orange-50/50 dark:bg-orange-950/30'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Pendapatan Bersih</CardTitle>
                    <div className={`p-2 rounded-full ${monthlyIncome - monthlyExpense >= 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-orange-100 dark:bg-orange-900'}`}>
                        <ArrowUpRight className={`h-4 w-4 ${monthlyIncome - monthlyExpense >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${monthlyIncome - monthlyExpense >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}`}>
                        {formatCurrency(monthlyIncome - monthlyExpense)}
                    </div>
                    <p className={`text-xs mt-1 ${monthlyIncome - monthlyExpense >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-orange-600 dark:text-orange-500'}`}>
                        {currentMonth}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
