"use client";

import React from 'react';
import { colors } from '@/app/design-system/colors';

interface ProfilePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const ProfilePagination: React.FC<ProfilePaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: colors.base.darker }}
            >
                ←
            </button>
            
            {getVisiblePages().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                        page === currentPage
                            ? 'text-white shadow-md'
                            : 'border border-gray-200 hover:border-gray-300'
                    } ${page === '...' ? 'cursor-default' : 'cursor-pointer'}`}
                    style={{
                        background: page === currentPage
                            ? `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`
                            : 'transparent',
                        color: page === currentPage ? 'white' : colors.base.darker,
                        boxShadow: page === currentPage ? '0 4px 12px rgba(92, 44, 173, 0.25)' : 'none'
                    }}
                >
                    {page}
                </button>
            ))}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-sm font-medium transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: colors.base.darker }}
            >
                →
            </button>
        </div>
    );
};

export default ProfilePagination;