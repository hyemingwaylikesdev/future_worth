import React from 'react';
import { UseFormRegister, FieldError, RegisterOptions } from 'react-hook-form';
import styles from '../app/page.module.css';
import { formatKoreanNumber } from '../utils/formatters';

interface FormattedInputProps {
  id: string;
  label: string;
  value?: string;
  numericValue: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<any>;
  name: string;
  validation: RegisterOptions;
  error?: FieldError;
  step?: string;
  min?: string;
  max?: string;
  showKorean?: boolean;
  unit?: string;
}

const FormattedInput: React.FC<FormattedInputProps> = ({
  id,
  label,
  numericValue,
  onChange,
  register,
  name,
  validation,
  error,
  step,
  min,
  max,
  showKorean = true,
  unit = '',
}) => {
  const {
    ref,
    onChange: registerOnChange,
    ...rest
  } = register(name, validation);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    registerOnChange(e);
  };

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type='text'
        step={step}
        min={min}
        max={max}
        ref={ref}
        onChange={handleChange}
        {...rest}
      />
      {showKorean && numericValue > 0 && (
        <div className={styles.koreanAmount}>
          {formatKoreanNumber(numericValue)}
        </div>
      )}
      {error && <div className={styles.errorMessage}>{error.message}</div>}
    </div>
  );
};

export default FormattedInput;
