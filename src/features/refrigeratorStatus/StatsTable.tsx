import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';

export default function StatsTable() {
  const rows = [
    { field: 'max', headerName: 'Max', type: 'number' },
    {
      field: 'min',
      headerName: 'Min',
    },
    {
      field: 'average',
      headerName: 'Average',
    },
    {
      field: 'median',
      headerName: 'Median',
    },
    {
      field: 'std_dev',
      headerName: 'Std Dev',
    },
  ];

  const MOCK_VALS = { max: 1, min: 2, average: 2, median: 2, std_dev: 2 };
  return (
    <Table size='small' style={{ width: '100%' }}>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.field}>
            <TableCell align='left'>{row.headerName}</TableCell>
            <TableCell align='left'>{MOCK_VALS[row.field]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
