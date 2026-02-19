import React from "react";

const Header = () => {
  return (
    <header className="mb-16 flex flex-col items-center text-center">
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400/60">
        Available Modules
      </span>
      <h2 className="mt-2 text-4xl font-black uppercase italic tracking-tighter text-zinc-100">
        System <span className="text-amber-400">Capabilities</span>
      </h2>
    </header>
  );
};

export const MainContentAreaWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-7xl px-8 py-24 md:px-16">
      <Header />
      {children}
    </div>
  );
};
