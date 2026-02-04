import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { TRPCReactProvider } from "@/lib/trpc/client";
import { AuthProvider } from "@/providers/auth/auth-provider";

export const RootProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: boolean;
}) => {
  return (
    <TRPCReactProvider>
      <AuthProvider session={session}>{children}</AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </TRPCReactProvider>
  );
};

export default RootProvider;
