import { DatePicker } from 'antd';
import dayjs from 'dayjs';

// Picker for departure date
export function DepartDatePicker({ value, onChange, placeholder }) {
    return (
        <DatePicker 
            placeholder={placeholder|| "Departure Date"}
            value={value ? dayjs(value) : null}
            onChange={onChange}
            // Disable dates before today
            disabledDate={current => current && current < dayjs().startOf('day')} 
            variant="borderless"
            style={{ width: '100%' }}
        />
    );
}

// Picker for return date
export function ReturnDatePicker({ value, onChange, departDate }) {
    return (
        <DatePicker 
            placeholder={departDate ? "Return Date" : "Select Departure First"}
            value={value ? dayjs(value) : null}
            onChange={onChange}
            disabled={!departDate}
            // Disable dates before the selected Departure date
            disabledDate={current => departDate && current < dayjs(departDate)} 
            variant="borderless"
            style={{ width: '100%' }}
        />
    );
}