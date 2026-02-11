import { PageTitle } from "@/components/layout/page-title";
import { cn } from "@/lib/utils";

export const PageWrapper = ({
  children,
  title,
  className,
  divider = false,
  size = "full",
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  divider?: boolean;
  size?: "full" | "medium";
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col items-center px-16 py-4",
        {
          "max-w-full": size === "full",
          "mx-auto max-w-5xl": size === "medium",
        },
        className,
      )}
    >
      {title && <PageTitle title={title} />}
      {divider && <div className="w-full border-b border-white/30" />}
      <div className="mb-6" />
      {children}
    </div>
  );
};
