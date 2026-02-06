import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "@/providers/theme/theme-provider";
import { TRPCReactProvider } from "@/lib/trpc/client";
import { AuthProvider } from "@/providers/auth/auth-provider";

import { I18nProvider } from "./i18n/i18n-provider";
// import i18next from "@/providers/i18n/client";

export const RootProvider = ({
  children,
  session,
  locale,
}: {
  children: React.ReactNode;
  session: boolean;
  locale: string;
}) => {
  return (
    <TRPCReactProvider>
      <I18nProvider locale={locale}>
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </I18nProvider>
    </TRPCReactProvider>
  );
};

export default RootProvider;
