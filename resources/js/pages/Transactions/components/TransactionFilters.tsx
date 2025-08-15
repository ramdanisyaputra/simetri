import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';

interface TransactionFiltersProps {
    currentMonth: string;
    selectedMonth: number;
    selectedYear: number;
}

export default function TransactionFilters({ 
    currentMonth, 
    selectedMonth, 
    selectedYear
}: TransactionFiltersProps) {
    const handleMonthChange = (month: string) => {
        router.get(route('transactions.index'), { 
            month: month, 
            year: selectedYear 
        }, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    const handleYearChange = (year: string) => {
        router.get(route('transactions.index'), { 
            month: selectedMonth, 
            year: year 
        }, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    const generateMonthOptions = () => {
        const months = [
            { value: '1', label: 'January' },
            { value: '2', label: 'February' },
            { value: '3', label: 'March' },
            { value: '4', label: 'April' },
            { value: '5', label: 'May' },
            { value: '6', label: 'June' },
            { value: '7', label: 'July' },
            { value: '8', label: 'August' },
            { value: '9', label: 'September' },
            { value: '10', label: 'October' },
            { value: '11', label: 'November' },
            { value: '12', label: 'December' },
        ];
        return months;
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        
        // Generate years from 5 years ago to 5 years in the future
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            years.push({ value: String(i), label: String(i) });
        }
        
        return years;
    };

    return (
        <div className="space-y-4">
            {/* Month/Year Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Transactions - {currentMonth}
                    </h1>
                    <p className="text-muted-foreground">Track your income and expenses</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="month-filter" className="text-sm font-medium whitespace-nowrap">
                            Month:
                        </Label>
                        <Select value={String(selectedMonth)} onValueChange={handleMonthChange}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {generateMonthOptions().map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="year-filter" className="text-sm font-medium whitespace-nowrap">
                            Year:
                        </Label>
                        <Select value={String(selectedYear)} onValueChange={handleYearChange}>
                            <SelectTrigger className="w-24">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {generateYearOptions().map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
