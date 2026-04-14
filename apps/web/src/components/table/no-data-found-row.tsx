import React from "react";

import { NAMESPACES } from "@repo/i18n/web";

import { useTranslation } from "@/lib/i18n/i18n";

export const NoDataFoundRow = ({ colSpan }: { colSpan: number }) => {
  const { t } = useTranslation([NAMESPACES.WEB]);

  return (
    <tr>
      <td colSpan={colSpan} className="p-4 text-center text-zinc-500">
        {t("noDataFound")}
      </td>
    </tr>
  );
};
