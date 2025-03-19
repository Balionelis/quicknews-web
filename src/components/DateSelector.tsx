import React from 'react';
import { DateRange } from '../types';

interface DateSelectorProps {
  onDateChange: (days: number) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
  const dateRanges: DateRange[] = [
    { id: 'today', label: 'Today', value: 1 },
    { id: 'week', label: 'This Week', value: 7 },
    { id: 'month', label: 'This Month', value: 30 },
    { id: 'year', label: 'This Year', value: 365 }
  ];

  return (
    <div className="date-selector">
      <select 
        onChange={(e) => onDateChange(Number(e.target.value))} 
        defaultValue={1}
      >
        {dateRanges.map((range) => (
          <option key={range.id} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;