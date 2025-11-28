/**
 * CSV Export Utility
 * Handles CSV generation with UTF-8 encoding and proper Excel compatibility
 */

/**
 * Escape CSV value to handle special characters
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If value contains semicolon, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(';') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Convert array of objects to CSV string
 * @param data - Array of objects to convert
 * @param headers - Object mapping keys to column labels (e.g., { id: 'ID', nome: 'Nome' })
 * @returns CSV string
 */
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  headers: Record<keyof T, string>
): string {
  const keys = Object.keys(headers) as (keyof T)[];
  const headerLabels = keys.map(key => headers[key]);
  
  // Create header row
  const headerRow = headerLabels.map(escapeCSVValue).join(';');
  
  // Create data rows
  const dataRows = data.map(item => {
    return keys.map(key => escapeCSVValue(item[key])).join(';');
  });
  
  // Combine header and data
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Trigger CSV file download in browser
 * @param csvContent - CSV string content
 * @param filename - Name of the file to download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Add UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;
  
  // Create blob with UTF-8 encoding
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the CSV file
 * @param headers - Object mapping keys to column labels
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers: Record<keyof T, string>
): void {
  const csvContent = arrayToCSV(data, headers);
  downloadCSV(csvContent, filename);
}

/**
 * Format date for CSV export
 */
export function formatDateForCSV(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

/**
 * Format datetime for CSV export
 */
export function formatDateTimeForCSV(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR');
}

/**
 * Generate filename with current date
 */
export function generateCSVFilename(prefix: string): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}_${dateStr}.csv`;
}
