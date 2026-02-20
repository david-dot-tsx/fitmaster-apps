import React from "react";

export const NoDataFoundRow = ({ colSpan }: { colSpan: number }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="p-4 text-center text-zinc-500">
        No data found.
      </td>
    </tr>
  );
};
