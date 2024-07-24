import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";

export default function StatsTable({
  labels,
  stats,
}: {
  labels: {
    label: string;
    field: keyof typeof stats;
    format?: (number: number) => string | number;
  }[];
  stats: Record<string, number>;
}) {
  return (
    <Table size="small" style={{ width: "100%" }}>
      <TableBody>
        {Object.keys(stats).map((stat) => {
          const item = labels.find((label) => label.field === stat);
          if (typeof item === "undefined") {
            return null;
          }
          return (
            <TableRow key={stat}>
              <TableCell align="left">{item.label}</TableCell>
              <TableCell align="left">
                {item.format ? item.format(stats[stat]) : stats[stat]}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
