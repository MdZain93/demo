/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

/**
 * Reusable AppInput component that integrates with React Hook Form.
 * 
 * Props:
 * - name: string (form field name)
 * - control: object (from react-hook-form's useForm())
 * - label: string
 * - type: string (defaults to 'text')
 * - rules: object (validation rules)
 * - error: boolean (automatically derived from control if integrated, or passed explicitly)
 * - helperText: string
 */
export function AppInput({
  name,
  control,
  label,
  type = 'text',
  defaultValue = '',
  rules = {},
  error = false,
  helperText = '',
  multiline = false,
  rows = 1,
  ...props
}) {
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            {...props}
            type={type}
            label={label}
            fullWidth
            multiline={multiline}
            rows={rows}
            error={!!fieldError}
            helperText={fieldError ? fieldError.message : helperText}
            variant="outlined"
            size="medium"
            margin="normal"
          />
        )}
      />
    );
  }

  // Fallback for standard un-controlled input
  return (
    <TextField
      type={type}
      label={label}
      fullWidth
      error={error}
      helperText={helperText}
      variant="outlined"
      size="medium"
      margin="normal"
      multiline={multiline}
      rows={rows}
      {...props}
    />
  );
}

export default AppInput;
