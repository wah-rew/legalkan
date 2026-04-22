'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { INDONESIA_BANKS, BANK_CATEGORIES, Bank } from '@/lib/indonesia-banks'

interface BankSearchProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  required?: boolean
  label?: string
}

const MAX_RESULTS = 10

export default function BankSearch({
  value,
  onChange,
  placeholder = 'Cari nama bank...',
  required,
  label,
}: BankSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // When not actively searching, display the selected value
  const inputDisplay = open ? query : value

  // Filter and group results
  const filtered: Bank[] = query.trim()
    ? INDONESIA_BANKS.filter(
        (b) =>
          b.name.toLowerCase().includes(query.trim().toLowerCase()) ||
          b.shortName.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, MAX_RESULTS)
    : []

  // Group by category (preserving order)
  const grouped: { category: string; banks: Bank[] }[] = []
  for (const category of BANK_CATEGORIES) {
    const banks = filtered.filter((b) => b.category === category)
    if (banks.length > 0) grouped.push({ category, banks })
  }

  // Flat list for keyboard navigation indexing
  const flatFiltered = grouped.flatMap((g) => g.banks)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
        setQuery('')
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]')
      const item = items[activeIndex] as HTMLElement
      if (item) item.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const handleSelect = useCallback(
    (bank: Bank) => {
      onChange(bank.shortName)
      setQuery('')
      setOpen(false)
      setActiveIndex(-1)
    },
    [onChange]
  )

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setQuery('')
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && e.key !== 'ArrowDown' && e.key !== 'Enter') return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && flatFiltered[activeIndex]) {
        handleSelect(flatFiltered[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
      setActiveIndex(-1)
    }
  }

  const hasValue = Boolean(value)
  const showDropdown = open && query.trim().length > 0

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
  }

  let flatIndex = 0

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '0.375rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#3D4F7C',
          }}
        >
          {label}
        </label>
      )}

      {/* Input + clear button wrapper */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputDisplay}
          placeholder={placeholder}
          required={required && !hasValue}
          autoComplete="off"
          style={inputStyle}
          onChange={handleInputChange}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />

        {/* Hidden native input to satisfy form required validation */}
        {required && (
          <input
            type="text"
            value={value}
            required
            readOnly
            tabIndex={-1}
            style={{
              position: 'absolute',
              opacity: 0,
              pointerEvents: 'none',
              width: 0,
              height: 0,
            }}
          />
        )}

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
          {flatFiltered.length === 0 ? (
            <li
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                color: '#9BA3C4',
                textAlign: 'center',
              }}
            >
              Bank tidak ditemukan
            </li>
          ) : (
            grouped.map(({ category, banks }) => (
              <li key={category}>
                {/* Category header */}
                <div
                  style={{
                    padding: '0.4rem 0.875rem 0.2rem',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: '#9BA3C4',
                  }}
                >
                  {category}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {banks.map((bank) => {
                    const idx = flatIndex++
                    const isActive = idx === activeIndex
                    return (
                      <li
                        key={bank.id}
                        role="option"
                        aria-selected={isActive}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleSelect(bank)
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        style={{
                          padding: '0.5rem 0.875rem',
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
                          {bank.name}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#9BA3C4',
                            marginTop: '1px',
                          }}
                        >
                          {bank.category}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
