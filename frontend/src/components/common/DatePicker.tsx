import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: Date;
  className?: string;
}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(({
  value,
  onChange,
  minDate,
  className = '',
}, ref) => {
  return (
    <div ref={ref} className={className}>
      <ReactDatePicker
        selected={value ? new Date(value) : null}
        onChange={(date: Date | null) => date && onChange(date.toISOString())}
        minDate={minDate}
        dateFormat="MMMM d, yyyy"
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
      />
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker; 