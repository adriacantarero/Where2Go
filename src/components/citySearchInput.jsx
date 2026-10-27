import { AutoComplete, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// CitySearch 3rd party component
export function CitySearchInput({ value, loading, error, placeholder, exclude, options, onChange, onFocus, onSelect }) {

    // Filter the API results from props: exclude an already selected city
    const filteredOptions = options?.filter(opt => opt.value !== exclude) || [];
    
    // Determine what to show in the dropdown
    let statusContent = null;
    if (loading) {
        // CASE: API request pending (loading spinner)
        statusContent = (
            <div style={{ display:'flex', justifyContent:'center', padding: 5 }}>
                 <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        );
    } 
    else if (error) {
        // CASE: API request failed (error)
        statusContent = <div style={{ color: 'lightcoral', padding: 5 }}>{error}</div>;
    }
    else if (value && value.length > 2 && filteredOptions.length === 0) {
        // CASE: No results
        statusContent = <div style={{ padding: 5, color: 'spanishgray' }}>No cities found</div>;
    }

    return (
        <AutoComplete
            value={value}
            placeholder={placeholder}
            options={filteredOptions}   // Use transformed options from the model
            notFoundContent={statusContent} // Visual feedback for search status

            // Event handlers
            onFocus={onFocus}
            onChange={onChange}
            onSelect={(val, option) => {onSelect && onSelect(option); }} //we pass the complete object
            
            // Styles to match the other CSS inputs
            variant="borderless"
            style={{ width: '100%' }}
            allowClear // Allow clearing the input
        />
    );
}