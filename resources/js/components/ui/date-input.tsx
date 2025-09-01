import * as React from "react"
import DatePicker from "react-datepicker"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Calendar } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css"

interface DateInputProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
      value ? new Date(value + 'T12:00:00') : null
    );

    React.useEffect(() => {
      if (value) {
        setSelectedDate(new Date(value + 'T12:00:00'));
      } else {
        setSelectedDate(null);
      }
    }, [value]);

    const handleDateChange = (date: Date | null) => {
      setSelectedDate(date);
      if (onChange && date) {
        // Format date as YYYY-MM-DD avoiding timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        onChange(formattedDate);
      } else if (onChange && !date) {
        onChange('');
      }
    };

    return (
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select date"
          showPopperArrow={false}
          todayButton="Today"
          isClearable
          customInput={
            <Input
              ref={ref}
              className={cn(
                "pr-10", // Add padding for the calendar icon
                className
              )}
              {...props}
            />
          }
          popperClassName="z-50"
          calendarClassName="shadow-lg border rounded-lg"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
        />
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
        />
      </div>
    )
  }
)
DateInput.displayName = "DateInput"

export { DateInput }
