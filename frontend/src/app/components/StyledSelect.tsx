import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface StyledSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}

export default function StyledSelect({
  options,
  value,
  onChange,
  placeholder = '-- Select --',
  required = false,
  disabled = false,
  id,
}: StyledSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }} id={id}>
      {/* Hidden native select for form validation */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: 'absolute',
          opacity: 0,
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <option value="" />
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px 36px 10px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-input)',
          border: open
            ? '1px solid rgba(124,58,237,0.52)'
            : '1px solid var(--border-medium)',
          boxShadow: open ? '0 0 0 3px rgba(124,58,237,0.09)' : 'none',
          color: selected ? 'var(--text-primary)' : 'var(--text-placeholder)',
          fontFamily: 'Inter, sans-serif',
          fontSize: 13.5,
          fontWeight: 500,
          textAlign: 'left',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.16s, box-shadow 0.16s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          opacity: disabled ? 0.5 : 1,
          outline: 'none',
          position: 'relative',
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          style={{
            width: 15,
            height: 15,
            color: 'var(--text-muted)',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 999,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 4px 16px rgba(124,58,237,0.10)',
            overflow: 'hidden',
            animation: 'fadeDown 0.18s ease forwards',
            maxHeight: 240,
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          {options.length === 0 ? (
            <div style={{
              padding: '12px 14px',
              fontSize: 13,
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}>
              No options available
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isSelected
                      ? 'rgba(124,58,237,0.08)'
                      : 'transparent',
                    color: isSelected
                      ? 'var(--brand-primary)'
                      : 'var(--text-primary)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13.5,
                    fontWeight: isSelected ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    transition: 'background 0.12s, color 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-layer1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <Check style={{ width: 13, height: 13, color: 'var(--brand-primary)', flexShrink: 0 }} />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
