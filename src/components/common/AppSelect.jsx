/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

/**
 * Reusable AppSelect component.
 * 
 * Props:
 * - name: string
 * - control: object (from react-hook-form)
 * - label: string
 * - options: Array of strings OR objects { value: string, label: string }
 * - defaultValue: string
 * - helperText: string
 * - error: boolean
 */
export function AppSelect({
  name,
  control,
  label,
  options = [],
  defaultValue = '',
  helperText = '',
  error = false,
  ...props
}) {
  const renderMenuItems = () => {
    return options.map((opt, idx) => {
      const val = typeof opt === 'object' ? opt.value : opt;
      const lbl = typeof opt === 'object' ? opt.label : opt;
      return (
        <MenuItem key={idx} value={val}>
          {lbl}
        </MenuItem>
      );
    });
  };

  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error: fieldError } }) => (
          <FormControl
            fullWidth
            margin="normal"
            error={!!fieldError}
            variant="outlined"
            size="medium"
          >
            <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
            <Select
              {...field}
              {...props}
              labelId={`${name}-select-label`}
              label={label}
            >
              {renderMenuItems()}
            </Select>
            {fieldError ? (
              <FormHelperText>{fieldError.message}</FormHelperText>
            ) : helperText ? (
              <FormHelperText>{helperText}</FormHelperText>
            ) : null}
          </FormControl>
        )}
      />
    );
  }

  // Fallback for standard select
  return (
    <FormControl fullWidth margin="normal" error={error} variant="outlined" size="medium">
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        label={label}
        defaultValue={defaultValue}
        {...props}
      >
        {renderMenuItems()}
      </Select>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}

export default AppSelect;
