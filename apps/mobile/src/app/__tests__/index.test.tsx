import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Role } from "@repo/validators";

import Index from "@/app/index";
import type { AppBootstrapPhase } from "@/components/layout/app-bootstrap-screen";
import { AUTH_STATUS, type AuthStatus } from "@/providers/auth/types";

type MeResult = {
  role: Role;
  profile: Record<string, string> | null;
} | null;

const mockState: { authStatus: AuthStatus; me: MeResult; isMeLoading: boolean } = {
  authStatus: AUTH_STATUS.LOADING,
  me: null,
  isMeLoading: false,
};

vi.mock("expo-router", () => {
  const redirect = ({ href }: { href: string }) =>
    React.createElement("div", { "data-testid": "redirect" }, href);

  return {
    Redirect: redirect,
  };
});

vi.mock("@/providers/auth/auth.store", () => ({
  useAuthStoreState: () => ({ authStatus: mockState.authStatus }),
}));

vi.mock("@/lib/trpc/client", () => ({
  trpc: {
    user: {
      me: {
        useQuery: () => ({
          data: mockState.me,
          isLoading: mockState.isMeLoading,
        }),
      },
    },
  },
}));

vi.mock("@/components/staff-screen", () => ({
  default: () => React.createElement("div", { "data-testid": "staff-screen" }),
}));

vi.mock("@/components/layout/app-bootstrap-screen", () => {
  const appBootstrapScreen = ({ phase }: { phase: AppBootstrapPhase }) =>
    React.createElement("div", { "data-testid": "app-bootstrap-phase" }, phase);

  return {
    AppBootstrapScreen: appBootstrapScreen,
  };
});

describe("mobile bootstrap screen routing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockState.authStatus = AUTH_STATUS.LOADING;
    mockState.me = null;
    mockState.isMeLoading = false;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("shows loading phase while bootstrapping", () => {
    mockState.authStatus = AUTH_STATUS.LOADING;

    render(React.createElement(Index));

    expect(screen.getByTestId("app-bootstrap-phase").textContent).toBe("loading");
  });

  it("shows login phase when unauthenticated after minimum loading", () => {
    mockState.authStatus = AUTH_STATUS.UNAUTHENTICATED;

    render(React.createElement(Index));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("app-bootstrap-phase").textContent).toBe("login");
  });

  it("shows onboarding phase for authenticated customer without profile", () => {
    mockState.authStatus = AUTH_STATUS.AUTHENTICATED;
    mockState.isMeLoading = false;
    mockState.me = { role: Role.CUSTOMER, profile: null };

    render(React.createElement(Index));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("app-bootstrap-phase").textContent).toBe("onboarding");
  });

  it("renders redirect to /main for authenticated customer with profile", () => {
    mockState.authStatus = AUTH_STATUS.AUTHENTICATED;
    mockState.isMeLoading = false;
    mockState.me = { role: Role.CUSTOMER, profile: { id: "profile-1" } };

    render(React.createElement(Index));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("redirect").textContent).toBe("/main");
  });

  it("renders staff screen for authenticated non-customer role", () => {
    mockState.authStatus = AUTH_STATUS.AUTHENTICATED;
    mockState.isMeLoading = false;
    mockState.me = { role: Role.TRAINER, profile: null };

    render(React.createElement(Index));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("staff-screen")).toBeTruthy();
  });
});
