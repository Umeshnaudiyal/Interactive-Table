import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, X, Loader2 } from 'lucide-react';

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password' | 'email' | 'number';
  showClearButton?: boolean;
  showPasswordToggle?: boolean;
  onClear?: () => void;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  theme?: 'light' | 'dark';
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  value = '',
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  showClearButton = false,
  showPasswordToggle = false,
  onClear,
  className = '',
  id,
  name,
  required = false,
  theme = 'light'
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Size classes
  const sizeClasses = {
    sm: {
      input: 'h-8 px-3 text-sm',
      label: 'text-sm',
      helper: 'text-xs',
      icon: 'w-4 h-4'
    },
    md: {
      input: 'h-10 px-4 text-sm',
      label: 'text-sm',
      helper: 'text-sm',
      icon: 'w-4 h-4'
    },
    lg: {
      input: 'h-12 px-4 text-base',
      label: 'text-base',
      helper: 'text-sm',
      icon: 'w-5 h-5'
    }
  };

  // Theme classes
  const themeClasses = {
    light: {
      label: 'text-gray-700',
      helper: 'text-gray-600',
      error: 'text-red-600',
      icon: 'text-gray-500 hover:text-gray-700'
    },
    dark: {
      label: 'text-gray-300',
      helper: 'text-gray-400',
      error: 'text-red-400',
      icon: 'text-gray-400 hover:text-gray-200'
    }
  };

  // Variant classes
  const getVariantClasses = () => {
    const baseClasses = 'w-full transition-all duration-200 placeholder-gray-500 focus:outline-none';
    
    if (theme === 'dark') {
      switch (variant) {
        case 'filled':
          return `${baseClasses} bg-gray-800 border-0 text-white placeholder-gray-400 focus:bg-gray-700 ${
            invalid ? 'bg-red-900/20 focus:bg-red-900/30' : ''
          } ${disabled ? 'bg-gray-900 text-gray-500' : ''}`;
        case 'ghost':
          return `${baseClasses} bg-transparent border-0 border-b-2 border-gray-700 rounded-none text-white ${
            isFocused ? 'border-blue-500' : ''
          } ${invalid ? 'border-red-500' : ''} ${disabled ? 'text-gray-500 border-gray-800' : ''}`;
        default: // outlined
          return `${baseClasses} bg-gray-900 border-2 border-gray-700 text-white ${
            isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/20' : ''
          } ${invalid ? 'border-red-500 shadow-lg shadow-red-500/20' : ''} ${
            disabled ? 'bg-gray-800 text-gray-500 border-gray-800' : ''
          }`;
      }
    } else {
      switch (variant) {
        case 'filled':
          return `${baseClasses} bg-gray-100 border-0 text-gray-900 focus:bg-white focus:shadow-md ${
            invalid ? 'bg-red-50 focus:bg-red-50' : ''
          } ${disabled ? 'bg-gray-50 text-gray-400' : ''}`;
        case 'ghost':
          return `${baseClasses} bg-transparent border-0 border-b-2 border-gray-300 rounded-none text-gray-900 ${
            isFocused ? 'border-blue-500' : ''
          } ${invalid ? 'border-red-500' : ''} ${disabled ? 'text-gray-400 border-gray-200' : ''}`;
        default: // outlined
          return `${baseClasses} bg-white border-2 border-gray-300 text-gray-900 ${
            isFocused ? 'border-blue-500 shadow-lg shadow-blue-500/10' : ''
          } ${invalid ? 'border-red-500 shadow-lg shadow-red-500/10' : ''} ${
            disabled ? 'bg-gray-50 text-gray-400 border-gray-200' : ''
          }`;
      }
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      const event = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const containerClasses = `${theme === 'dark' ? 'dark' : ''} ${className}`;

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={id}
          className={`block mb-2 font-medium ${sizeClasses[size].label} ${themeClasses[theme].label} ${
            disabled ? 'opacity-50' : ''
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${getVariantClasses()} ${sizeClasses[size].input} ${
            variant === 'ghost' ? '' : 'rounded-lg'
          } ${
            (showClearButton || showPasswordToggle || loading) && value ? 'pr-10' : ''
          }`}
        />
        
        {/* Loading spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className={`animate-spin ${sizeClasses[size].icon} ${themeClasses[theme].icon}`} />
          </div>
        )}
        
        {/* Clear button */}
        {!loading && showClearButton && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses[theme].icon} hover:bg-gray-100 rounded-full p-1 transition-colors`}
          >
            <X className={sizeClasses[size].icon} />
          </button>
        )}
        
        {/* Password toggle */}
        {!loading && showPasswordToggle && type === 'password' && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses[theme].icon} hover:bg-gray-100 rounded-full p-1 transition-colors`}
          >
            {showPassword ? (
              <EyeOff className={sizeClasses[size].icon} />
            ) : (
              <Eye className={sizeClasses[size].icon} />
            )}
          </button>
        )}
      </div>
      
      {/* Helper text or error message */}
      {(helperText || errorMessage) && (
        <p className={`mt-2 ${sizeClasses[size].helper} ${
          errorMessage
            ? themeClasses[theme].error
            : themeClasses[theme].helper
        } ${disabled ? 'opacity-50' : ''}`}>
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;