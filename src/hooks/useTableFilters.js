/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';

export function useTableFilters(initialData = [], searchFields = ['name']) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleRequestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...initialData];

    // 1. Text Search Filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(lowerSearch);
        })
      );
    }

    // 2. Select Filters (matching exact value, or 'All')
    Object.keys(filters).forEach((key) => {
      const filterVal = filters[key];
      if (filterVal && filterVal !== 'All' && filterVal !== '') {
        result = result.filter((item) => String(item[key]) === String(filterVal));
      }
    });

    // 3. Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;

        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [initialData, searchTerm, filters, sortConfig, searchFields]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSortConfig({ key: '', direction: 'asc' });
  };

  return {
    searchTerm,
    filters,
    sortConfig,
    handleSearchChange,
    handleFilterChange,
    handleRequestSort,
    filteredData: filteredAndSortedData,
    resetFilters
  };
}

export default useTableFilters;
