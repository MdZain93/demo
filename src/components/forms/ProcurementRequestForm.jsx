/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';


// Core Common
import AppInput from '../common/AppInput';
import AppSelect from '../common/AppSelect';
import AppButton from '../common/AppButton';
import { procurementRequestSchema } from '../../utils/validationSchemas';
import { CATEGORIES, PRIORITIES, DEPARTMENTS } from '../../utils/constants';

// Services
import { getVendors } from '../../services/vendorService';
import { supabase } from '../../lib/supabaseClient';


export function ProcurementRequestForm({ onSubmit, loading, initialData = null }) {
  const [vendors, setVendors] = useState([]);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState('');

  // Fetch onboarded vendors for selection
  useEffect(() => {
    const fetchVendorsList = async () => {
      try {
        const vendorList = await getVendors();
        setVendors(vendorList);
      } catch (err) {
        console.error('Failed to load vendors', err);
      }
    };
    fetchVendorsList();
  }, []);

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(procurementRequestSchema),
    defaultValues: initialData || {
      title: '',
      vendor: '',
      category: '',
      amount: '',
      priority: 'Medium',
      requiredDate: new Date().toISOString().split('T')[0],
      description: '',
      attachment: ''
    }
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileNameUnique = `${Date.now()}_${safeName}`;
        const filePath = `procurements/${fileNameUnique}`;

        const { data, error } = await supabase.storage
          .from('E-GREP')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        setUploadedPath(filePath);
        setFileName(file.name);
        setValue('attachment', filePath);
      } catch (err) {
        console.error('Upload failed:', err);
        alert(`File upload failed: ${err.message || err}\n\nPlease check that your 'E-GREP' bucket policies are set to allow anonymous uploads!`);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit((data) => onSubmit(data, uploadedPath || fileName))} noValidate>

      <Grid container spacing={3}>
        
        {/* Title */}
        <Grid size={{ xs: 12 }}>
          <AppInput
            name="title"
            control={control}
            label="Request Title"
            placeholder="e.g. Bulk Server Hardware Upgrade Q3"
          />
        </Grid>

        {/* Vendor */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppSelect
            name="vendor"
            control={control}
            label="Target Vendor"
            options={vendors.map((v) => ({ value: v.name, label: v.name }))}
            helperText="Only certified platform vendors are shown."
          />
        </Grid>

        {/* Category */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppSelect
            name="category"
            control={control}
            label="Expenditure Category"
            options={CATEGORIES}
          />
        </Grid>

        {/* Amount */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppInput
            name="amount"
            control={control}
            label="Total Amount ($ USD)"
            type="number"
            placeholder="0.00"
          />
        </Grid>

        {/* Priority */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppSelect
            name="priority"
            control={control}
            label="Severity Priority"
            options={PRIORITIES}
          />
        </Grid>

        {/* Required Date */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppInput
            name="requiredDate"
            control={control}
            label="Required Fulfillment Date"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        {/* File attachment upload to Supabase */}
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Button
            component="label"
            variant="outlined"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            sx={{ height: '56px', mt: '8px', borderStyle: 'dashed', borderRadius: '12px' }}
          >
            {uploading ? 'Uploading to Supabase...' : 'Upload Proposal / Quote'}
            <input
              type="file"
              hidden
              disabled={uploading}
              accept=".pdf,.docx,.xlsx,.png"
              onChange={handleFileUpload}
            />
          </Button>
          {fileName ? (
            <Typography variant="body2" color="success.main" fontWeight={600} mt={1} align="center">
              File uploaded: {fileName}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.disabled" mt={1} align="center">
              Optional. Max size 10MB (.pdf, .docx, .xlsx, .png)
            </Typography>
          )}
        </Grid>

        {/* Description / Justification */}
        <Grid size={{ xs: 12 }}>
          <AppInput
            name="description"
            control={control}
            label="Business Justification & Detail"
            multiline
            rows={4}
            placeholder="Please detail why this expenditure is required, and outline ROI benefits."
          />
        </Grid>

        {/* Actions Submit */}
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <AppButton type="submit" loading={loading} sx={{ px: 4 }}>
            Submit Request
          </AppButton>
        </Grid>

      </Grid>
    </Box>
  );
}

export default ProcurementRequestForm;
