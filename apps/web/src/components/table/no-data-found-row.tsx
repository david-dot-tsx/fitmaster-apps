import React from "react";

import { useT } from "@/lib/i18n/i18n";

export const NoDataFoundRow = ({ colSpan }: { colSpan: number }) => {
  const { t } = useT();

  return (
    <tr>
      <td colSpan={colSpan} className="p-4 text-center text-zinc-500">
        {t("noDataFound")}
      </td>
    </tr>
  );
};
