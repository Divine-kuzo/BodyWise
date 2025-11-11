import { ReactNode } from "react";

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Array<Column<T>>;
  data: ReadonlyArray<T>;
  caption?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  caption,
}: DataTableProps<T>) {
  return (
    <div className="max-w-full overflow-x-auto rounded-3xl border border-[#e6d8ce] bg-white shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
      <div className="min-w-full">
        <table
          className="w-full min-w-[720px] divide-y divide-[#f1e3d9]"
          style={{ tableLayout: "auto" }}
        >
          {caption ? (
            <caption className="px-6 py-4 text-left text-sm font-semibold text-[#3a2218]">
              {caption}
            </caption>
          ) : null}
          <thead className="bg-[#f9f0e6]">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3e5db]">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition hover:bg-[#fdf9f6]">
                {columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td key={String(column.key)} className="whitespace-nowrap px-6 py-4 text-sm text-[#4b3125]">
                      {column.render ? column.render(value, row) : (value as ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


