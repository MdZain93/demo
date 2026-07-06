/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const exportCSV = (filename, headers, data, keyMap) => {
  if (!data || !data.length) {
    console.error('No data available to export');
    return;
  }

  // 1. Build CSV content rows
  const csvRows = [];
  
  // Headers line
  const escapedHeaders = headers.map(h => {
    const stringH = String(h || '');
    const escaped = stringH.replace(/"/g, '""');
    return (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) ? `"${escaped}"` : escaped;
  });
  csvRows.push(escapedHeaders.join(','));

  // Data lines
  for (const row of data) {
    const values = keyMap.map((key) => {
      let val = row[key];
      // Resolve nested object references (like contact.email)
      if (key.includes('.')) {
        const parts = key.split('.');
        let temp = row;
        for (const p of parts) {
          temp = temp ? temp[p] : undefined;
        }
        val = temp;
      }
      
      // Escape commas, quotes, and line breaks
      const stringVal = val !== undefined && val !== null ? String(val) : '';
      const escaped = stringVal.replace(/"/g, '""');
      if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
        return `"${escaped}"`;
      }
      return escaped;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 2. Trigger browser download
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default exportCSV;
