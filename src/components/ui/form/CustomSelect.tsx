import React, { useState, useRef, useEffect } from "react";
import { colors } from "@/app/design-system";
import Icon from "@/components/ui/Icon";

export interface SelectOption {
  value: string | number;
  label: string;
  city?: string;
  province?: string;
  code?: string;
  type?: "station" | "city" | "separator";
  stationIds?: number[];
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  className?: string;
  error?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = "Pilih option", disabled = false, loading = false, searchable = true, className = "", error = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = searchable
    ? options.filter(
        (option) =>
          option.type === "separator" || // Always show separators
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (option.code && option.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (option.city && option.city.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  const handleOptionClick = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled || loading) return;

    switch (event.key) {
      case "Enter":
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        }
        break;
    }
  };

  const getBorderColor = () => {
    if (error) return "#ee160c";
    if (isOpen) return colors.violet.normal;
    return colors.base.darkActive;
  };

  const getDisplayText = () => {
    if (loading) return "Memuat...";
    if (selectedOption) {
      if (selectedOption.type === "city") {
        return `${selectedOption.city}`;
      }
      return `${selectedOption.label}${selectedOption.code ? ` (${selectedOption.code})` : ""}`;
    }
    return placeholder;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="w-full px-4 py-3 bg-white border-2 rounded-xl font-medium cursor-pointer transition-all duration-200 flex items-center justify-between focus:outline-none"
        style={{
          borderColor: getBorderColor(),
          color: selectedOption ? colors.base.darker : colors.base.darkHover,
          opacity: disabled ? 0.6 : 1,
        }}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">{getDisplayText()}</span>

        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 ml-2" style={{ borderColor: colors.violet.normal }} />
        ) : (
          <Icon name="chevDown" className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>

      {isOpen && !disabled && !loading && (
        <div
          className="absolute z-50 w-full mt-2 bg-white border-2 rounded-xl shadow-xl max-h-64 overflow-y-auto"
          style={{
            borderColor: colors.violet.light,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          }}
          role="listbox"
        >
          {searchable && (
            <div className="sticky top-0 bg-white border-b p-3" style={{ borderColor: colors.base.lightHover }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                placeholder="Cari stasiun..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.base.darkActive,
                  color: colors.base.darker,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.violet.normal;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.violet.light}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.base.darkActive;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          )}

          <div className="py-2">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-center" style={{ color: colors.base.darkHover }}>
                Tidak ada stasiun yang ditemukan
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`px-4 py-3 cursor-pointer transition-colors flex flex-col ${highlightedIndex === index ? "bg-opacity-20" : ""}`}
                  style={{
                    backgroundColor: value === option.value ? colors.violet.light : highlightedIndex === index ? colors.violet.lightHover : "transparent",
                    color: colors.base.darker,
                  }}
                  onClick={() => handleOptionClick(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {option.type === "city" && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.violet.normal} strokeWidth="2" className="mr-2">
                          <path d="M3 21h18M5 21V7l4-4h10v18M9 9h1v1H9V9zm0 4h1v1H9v-1zm4-4h1v1h-1V9zm0 4h1v1h-1v-1z" />
                        </svg>
                      )}
                      <span
                        className={`${option.type === "city" ? "font-semibold" : "font-medium"}`}
                        style={{
                          color: option.type === "city" ? colors.violet.normal : colors.base.darker,
                        }}
                      >
                        {option.label}
                      </span>
                    </div>
                    {option.code && (
                      <span
                        className="text-sm font-mono"
                        style={{
                          color: option.type === "city" ? colors.violet.normalHover : colors.base.darkHover,
                        }}
                      >
                        {option.code}
                      </span>
                    )}
                  </div>
                  {option.city && option.type !== "city" && (
                    <span className="text-xs mt-1" style={{ color: colors.base.darkHover }}>
                      {option.city}
                      {option.province ? `, ${option.province}` : ""}
                    </span>
                  )}
                  {option.type === "city" && option.province && (
                    <span className="text-xs mt-1" style={{ color: colors.violet.normalHover }}>
                      {option.province}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
