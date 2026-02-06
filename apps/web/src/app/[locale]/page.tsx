import { times } from "remeda";

import { PageWrapper } from "@/components/layout/page-wrapper";
import initTranslations from "@/lib/i18n/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = await initTranslations({ locale });

  return (
    <PageWrapper>
      <div>
        <div>{t("description")}</div>
        <h1 className="text-4xl font-bold">Home</h1>
        <h2 className="mt-12 text-2xl font-bold">Content 1</h2>
        <div className="flex flex-wrap gap-4">
          {times(20, (index) => (
            <div key={index} className="size-[220px] bg-purple-700">
              {index}
            </div>
          ))}
        </div>
        <h2 className="mt-24 text-2xl font-bold">Content 2</h2>
        <div className="grid grid-cols-4 gap-4">
          {times(10, (index) => (
            <div key={index} className="h-48 bg-purple-600">
              {index}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
