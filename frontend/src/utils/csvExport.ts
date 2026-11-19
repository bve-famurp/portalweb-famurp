export const exportToCsv = (
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): void => {
  if (rows.length === 0) return;

  const escapeCell = (cell: string | number | boolean | null | undefined): string => {
    if (cell === null || cell === undefined) return '""';
    let str = String(cell).replace(/"/g, '""');
    if (/^[=+@-|\t\r]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str}"`;
  };

  const csvRows = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ];

  const csvContent = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
