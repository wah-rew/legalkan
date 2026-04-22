'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { INDONESIA_REGIONS, IndonesiaRegion } from '@/lib/indonesia-regions';

interface CitySearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function CitySearch({
  value,
  onChange,
  placeholder = 'Cari kota atau kabupaten...',
  required,
}: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // value prop holds the label string (e.g. "Kota Jakarta Selatan")
  // so the display is just `value` when not in search mode
  const inputDisplay = open ? query : value;

  const filtered = query.trim()
    ? INDONESIA_REGIONS.filter((r) =>
        r.label.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, 8)
    : [];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      if (item) item.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleSelect = useCallback(
    (region: IndonesiaRegion) => {
      // Pass the label (display name) as the stored value for document generation
      onChange(region.label);
      setQuery('');
      setOpen(false);
      setActiveIndex(-1);
    },
    [onChange]
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && e.key !== 'ArrowDown' && e.key !== 'Enter') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
      setActiveIndex(-1);
    }
  };

  const hasValue = Boolean(value);
  const showDropdown = open && query.trim().length > 0;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 1rem',
    borderRadius: '12px',
    border: hasValue ? '2px solid #FF4D6D' : '2px solid rgba(13,27,62,0.1)',
    fontSize: '0.9rem',
    color: '#0D1B3E',
    background: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input + clear button wrapper */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputDisplay}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          style={inputStyle}
          onChange={handleInputChange}
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />

        {/* Clear button */}
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            tabIndex={-1}
            style={{
              position: 'absolute',
              right: '0.6rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(13,27,62,0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '1.4rem',
              height: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.75rem',
              color: '#6B7FA8',
              lineHeight: 1,
            }}
            aria-label="Hapus pilihan"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <ul
          ref={listRef}
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 999,
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(13,27,62,0.14)',
            border: '1px solid rgba(13,27,62,0.08)',
            maxHeight: '16rem',
            overflowY: 'auto',
            margin: 0,
            padding: '0.375rem',
            listStyle: 'none',
          }}
        >
          {filtered.length === 0 ? (
            <li
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                color: '#9BA3C4',
                textAlign: 'center',
              }}
            >
              Kota/kabupaten tidak ditemukan
            </li>
          ) : (
            filtered.map((region, idx) => {
              const isActive = idx === activeIndex;
              return (
                <li
                  key={region.value}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(region);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  style={{
                    padding: '0.625rem 0.875rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: isActive
                      ? 'rgba(255,77,109,0.08)'
                      : 'transparent',
                    transition: 'background 0.1s',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: isActive ? '#FF4D6D' : '#0D1B3E',
                      lineHeight: 1.3,
                    }}
                  >
                    {region.label}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#9BA3C4',
                      marginTop: '1px',
                    }}
                  >
                    {region.province}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
