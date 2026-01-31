'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface AirportSearchProps {
  label: string;
  placeholder?: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  className?: string;
}

export default function AirportSearch({
  label,
  placeholder = 'Enter city or airport code',
  value,
  onChange,
  className = ''
}: AirportSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    // Don't search if an airport is already selected
    if (value) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/airports/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.airports || []);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, value]);

  // Update input when value changes externally
  useEffect(() => {
    if (value) {
      setQuery(`${value.city} (${value.iata.toUpperCase()})`);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((airport: Airport) => {
    onChange(airport);
    setQuery(`${airport.city} (${airport.iata.toUpperCase()})`);
    setIsOpen(false);
    setResults([]);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;

    // If there was a selected value and user is editing, clear the selection
    if (value) {
      const selectedText = `${value.city} (${value.iata.toUpperCase()})`;
      if (newQuery !== selectedText) {
        onChange(null);
        // If user is adding characters after selection, extract just the new part
        if (newQuery.startsWith(selectedText)) {
          // User typed after the selection - clear and use only new chars
          setQuery(newQuery.slice(selectedText.length).trim());
          return;
        }
      }
    }

    setQuery(newQuery);
  };

  const handleClear = () => {
    setQuery('');
    onChange(null);
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-11 px-3 pr-9 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                     placeholder:text-slate-400 transition-colors cursor-text"
          autoComplete="off"
        />
        {(query || value) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {isLoading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto"
        >
          {results.map((airport, index) => (
            <button
              key={airport.iata}
              type="button"
              onClick={() => handleSelect(airport)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full px-3 py-2.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer
                ${highlightedIndex === index ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <span className="flex-shrink-0 w-11 h-7 flex items-center justify-center bg-blue-100 text-blue-700 font-semibold text-xs rounded">
                {airport.iata.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 text-sm truncate">
                  {airport.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {airport.city}, {airport.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-center text-slate-500 text-sm">
          No airports found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
