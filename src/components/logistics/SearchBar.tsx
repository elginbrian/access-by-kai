'use client';

import React from 'react';
import InputField from '@/components/input/InputField';

interface SearchBarProps {
    placeholder?: string;
    label?: string;
    onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    placeholder = "Masukkan kode resi di sini",
    label = "Track Your Package",
    onSearch 
}) => {
    const handleSearch = () => {
        // Implementation for search functionality
        console.log('Search triggered');
        if (onSearch) {
            onSearch(''); // Pass the search value when implemented
        }
    };

    return (
        <div className="max-w-[50rem] mx-auto mt-8 px-4">
            <div className="relative">
                <InputField
                    label={label}
                    type="text"
                    placeholder={placeholder}
                />
                <button 
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
                >
                    <img src="/ic_search.svg" alt="Search" />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;