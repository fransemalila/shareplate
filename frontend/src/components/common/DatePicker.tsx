import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: Date;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  className = '',
}) => {
  return (
    <div className={className}>
      <ReactDatePicker
        selected={value ? new Date(value) : null}
        onChange={(date: Date) => onChange(date.toISOString())}
        minDate={minDate}
        dateFormat="MMMM d, yyyy"
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
      />
    </div>
  );
};

export default DatePicker; 