/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import supabase from '../lib/supabaseClient';

const mapVendor = (v) => ({
  id: v.id,
  name: v.name,
  category: v.category,
  country: v.country,
  riskLevel: v.risk_level,
  complianceStatus: v.compliance_status,
  status: v.status,
  lastReviewDate: v.last_review_date,
  contact: v.contact || {},
  documents: v.documents || [],
  history: v.history || [],
});

export const getVendors = async () => {
  const { data, error } = await supabase.from('vendors').select('*');
  if (error) throw new Error('Failed to load vendors from database.');
  return data.map(mapVendor);
};

export const getVendorById = async (id) => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) throw new Error('Vendor not found');
  return mapVendor(data);
};

export const onboardVendor = async (vendorData) => {
  const { data: existing } = await supabase
    .from('vendors')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  const lastNum = existing && existing.length > 0
    ? parseInt(existing[0].id.replace('V-', ''), 10)
    : 1000;

  const newId = `V-${lastNum + 1}`;

  const newVendor = {
    id: newId,
    name: vendorData.name,
    category: vendorData.category,
    country: vendorData.country,
    risk_level: vendorData.riskLevel || 'Medium',
    compliance_status: 'Under Review',
    status: 'Pending',
    last_review_date: new Date().toISOString().split('T')[0],
    contact: {
      name: vendorData.contactName,
      email: vendorData.contactEmail,
      phone: vendorData.contactPhone,
    },
    documents: [
      { name: 'Tax Registration Certificate', expiryDate: vendorData.taxExpiry || '2027-12-31', status: 'Valid' },
      { name: 'Compliance Declaration', expiryDate: '2027-06-30', status: 'Valid' },
    ],
    history: [],
  };

  const { data, error } = await supabase
    .from('vendors')
    .insert(newVendor)
    .select()
    .single();

  if (error) throw new Error('Failed to onboard vendor in database.');
  return mapVendor(data);
};

export const updateVendorDocument = async (vendorId, docName, expiryDate, status) => {
  const { data: vendor, error: fetchErr } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .single();

  if (fetchErr || !vendor) throw new Error('Vendor not found');

  let newDocs = [...(vendor.documents || [])];
  const dIndex = newDocs.findIndex((d) => d.name === docName);

  if (dIndex === -1) {
    newDocs.push({ name: docName, expiryDate, status });
  } else {
    newDocs[dIndex] = { name: docName, expiryDate, status };
  }

  const allValid = newDocs.every((d) => d.status === 'Valid');

  const { data, error } = await supabase
    .from('vendors')
    .update({
      documents: newDocs,
      compliance_status: allValid ? 'Compliant' : 'Non-Compliant',
    })
    .eq('id', vendorId)
    .select()
    .single();

  if (error) throw new Error('Failed to update vendor document');
  return mapVendor(data);
};
