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
      {title && <h1 className="mb-4 mr-auto text-4xl text-amber-400">{title}</h1>}
      {children}
    </div>
  );
};
