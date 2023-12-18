import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';

export default function StatsTable({
  labels,
  stats,
}: {
  labels: Record<keyof typeof stats, string>;
  stats: Record<string, number>;
}) {
  const MOCK_VALS = { max: 1, min: 2, average: 2, median: 2, std_dev: 2 };
  return (
    <Table size='small' style={{ width: '100%' }}>
      <TableBody>
        {Object.keys(stats).map((stat) => (
          <TableRow key={stat}>
            <TableCell align='left'>{labels[stat]}</TableCell>
            <TableCell align='left'>{stats[stat].toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
