import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col overflow-y-hidden">
          <main className="flex flex-1">{children}</main>
          <Footer className="justify-self-end" />
          <Toaster richColors position="top-right" />
        </div>
      </div>
    </>
  );
};
