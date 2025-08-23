import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown, DollarSign, CreditCard, Target, Activity, Plus, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: '/dashboard',
    },
];

interface DashboardSummary {
    totalBalance: number;
    currentMonthIncome: number;
    currentMonthExpense: number;
    currentMonthNet: number;
    incomeGrowth: number;
    expenseGrowth: number;
    savingsRate: number;
    expenseRatio: number;
}

interface Account {
    id: number;
    name: string;
    type: string;
    balance: number;
    created_at: string;
}

interface Transaction {
    id: number;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    description: string;
    transaction_date: string;
    account: {
        name: string;
    };
    category?: {
        name: string;
    };
}

interface TopCategory {
    category: {
        name: string;
    };
    total_amount: number;
}

interface DailySpending {
    date: string;
    amount: number;
}

interface MonthlyTrend {
    month: string;
    income: number;
    expense: number;
    net: number;
}

interface DashboardStats {
    totalAccounts: number;
    totalCategories: number;
    totalTransactions: number;
}

interface DashboardProps {
    summary: DashboardSummary;
    accounts: Account[];
    recentTransactions: Transaction[];
    topCategories: TopCategory[];
    dailySpending: DailySpending[];
    monthlyTrends: MonthlyTrend[];
    stats: DashboardStats;
}

export default function Dashboard({ 
    summary, 
    accounts, 
    recentTransactions, 
    topCategories, 
    dailySpending, 
    monthlyTrends, 
    stats 
}: DashboardProps) {
    const getAccountTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            checking: 'Rekening Giro',
            savings: 'Tabungan',
            credit_card: 'Kartu Kredit',
            investment: 'Investasi',
            cash: 'Tunai',
            loan: 'Pinjaman',
        };
        return types[type] || type;
    };

    const getTransactionTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            income: 'Pemasukan',
            expense: 'Pengeluaran',
            transfer: 'Transfer',
        };
        return types[type] || type;
    };

    const getTransactionTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            income: 'text-green-600 bg-green-50',
            expense: 'text-red-600 bg-red-50',
            transfer: 'text-blue-600 bg-blue-50',
        };
        return colors[type] || 'text-gray-600 bg-gray-50';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dasbor" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Saldo</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.totalBalance)}</div>
                            <p className="text-xs text-muted-foreground">
                                Total saldo dari semua akun
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pemasukan Bulan Ini</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.currentMonthIncome)}</div>
                            <div className="flex items-center text-xs">
                                {summary.incomeGrowth >= 0 ? (
                                    <ArrowUpIcon className="h-3 w-3 text-green-600 mr-1" />
                                ) : (
                                    <ArrowDownIcon className="h-3 w-3 text-red-600 mr-1" />
                                )}
                                <span className={summary.incomeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {Math.abs(summary.incomeGrowth)}%
                                </span>
                                <span className="text-muted-foreground ml-1">dari bulan lalu</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pengeluaran Bulan Ini</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.currentMonthExpense)}</div>
                            <div className="flex items-center text-xs">
                                {summary.expenseGrowth >= 0 ? (
                                    <ArrowUpIcon className="h-3 w-3 text-red-600 mr-1" />
                                ) : (
                                    <ArrowDownIcon className="h-3 w-3 text-green-600 mr-1" />
                                )}
                                <span className={summary.expenseGrowth >= 0 ? 'text-red-600' : 'text-green-600'}>
                                    {Math.abs(summary.expenseGrowth)}%
                                </span>
                                <span className="text-muted-foreground ml-1">dari bulan lalu</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Bersih</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summary.currentMonthNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(summary.currentMonthNet)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tingkat tabungan: {summary.savingsRate}%
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Overview */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Akun Anda</CardTitle>
                                    <CardDescription>
                                        {stats.totalAccounts} akun dengan total saldo {formatCurrency(summary.totalBalance)}
                                    </CardDescription>
                                </div>
                                <Link href="/accounts">
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {accounts.length > 0 ? (
                                    <div className="space-y-3">
                                        {accounts.slice(0, 4).map((account) => (
                                            <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <CreditCard className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{account.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {getAccountTypeLabel(account.type)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrency(account.balance)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {accounts.length > 4 && (
                                            <div className="text-center pt-2">
                                                <Link href="/accounts">
                                                    <Button variant="ghost" size="sm">
                                                        +{accounts.length - 4} akun lainnya
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">Belum ada akun</p>
                                        <Link href="/accounts">
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tambah Akun Pertama
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Transactions */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Transaksi Terbaru</CardTitle>
                                    <CardDescription>
                                        5 transaksi terakhir Anda
                                    </CardDescription>
                                </div>
                                <Link href="/transactions">
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {recentTransactions.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentTransactions.map((transaction) => (
                                            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Badge className={getTransactionTypeColor(transaction.type)}>
                                                        {getTransactionTypeLabel(transaction.type)}
                                                    </Badge>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {transaction.description || 'Tanpa deskripsi'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {transaction.account.name}
                                                            {transaction.category && ` • ${transaction.category.name}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-medium ${
                                                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {transaction.type === 'income' ? '+' : '-'}
                                                        {formatCurrency(transaction.amount)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">Belum ada transaksi</p>
                                        <Link href="/transactions">
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tambah Transaksi Pertama
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="space-y-6">
                        {/* Financial Health */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Kesehatan Keuangan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Tingkat Tabungan</span>
                                        <span className="font-medium">{summary.savingsRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                summary.savingsRate >= 20 ? 'bg-green-500' :
                                                summary.savingsRate >= 10 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${Math.min(Math.max(summary.savingsRate, 0), 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {summary.savingsRate >= 20 ? 'Sangat baik!' : 
                                         summary.savingsRate >= 10 ? 'Cukup baik' : 'Perlu ditingkatkan'}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Rasio Pengeluaran</span>
                                        <span className="font-medium">{summary.expenseRatio}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                summary.expenseRatio <= 50 ? 'bg-green-500' :
                                                summary.expenseRatio <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${Math.min(summary.expenseRatio, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {summary.expenseRatio <= 50 ? 'Sangat baik!' : 
                                         summary.expenseRatio <= 80 ? 'Cukup baik' : 'Terlalu tinggi'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Categories */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Kategori Teratas</CardTitle>
                                <CardDescription>
                                    Pengeluaran terbesar bulan ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {topCategories.length > 0 ? (
                                    <div className="space-y-3">
                                        {topCategories.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <span className="text-sm">{item.category.name}</span>
                                                </div>
                                                <span className="text-sm font-medium text-red-600">
                                                    {formatCurrency(item.total_amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada data kategori
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Statistik Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Akun</span>
                                    <span className="font-medium">{stats.totalAccounts}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Kategori</span>
                                    <span className="font-medium">{stats.totalCategories}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Transaksi Bulan Ini</span>
                                    <span className="font-medium">{stats.totalTransactions}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
