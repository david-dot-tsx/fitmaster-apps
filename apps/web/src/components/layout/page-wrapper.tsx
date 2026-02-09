import { PageTitle } from "@/components/page-title";
import { cn } from "@/lib/utils";

export const PageWrapper = ({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-1 flex-col items-center px-16 py-4", className)}>
      {title && <PageTitle title={title} />}
      {children}
    </div>
  );
};
