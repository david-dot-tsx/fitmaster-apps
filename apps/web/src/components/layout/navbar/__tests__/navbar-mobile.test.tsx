import React, { type AnchorHTMLAttributes, type ImgHTMLAttributes } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Navbar } from "@/components/layout/navbar/navbar";
import { getSessionUser } from "@/lib/session-user";

type SessionUser = Awaited<ReturnType<typeof getSessionUser>>;

const createSessionUser = (overrides: Partial<SessionUser>): SessionUser => ({
  user: undefined,
  isAuthenticated: false,
  isAdmin: false,
  isTrainer: false,
  isCustomer: false,
  isStaff: false,
  ...overrides,
});

let mockIsAuthenticated = false;

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement("img", { ...props, alt: props.alt || "" }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement("a", { href, ...props }, children),
}));

vi.mock("@/lib/session-user", () => ({
  getSessionUser: vi.fn(),
}));

vi.mock("@/lib/i18n/server", () => ({
  getServerTranslations: vi.fn(async () => ({
    t: (key: string) => key,
  })),
}));

vi.mock("@/components/layout/navbar/navbar-desktop", () => {
  const navbarDesktop = () => null;

  return { NavbarDesktop: navbarDesktop };
});

vi.mock("@/components/locale-switch", () => {
  const localeSwitch = () => React.createElement("div", { "data-testid": "navbar-locale-switch" });

  return { LocaleSwitch: localeSwitch };
});

vi.mock("@/components/layout/navbar/navbar-auth", () => {
  const navbarAuth = () =>
    React.createElement(
      "div",
      null,
      mockIsAuthenticated
        ? React.createElement("button", { "data-testid": "navbar-logout-button", type: "button" }, "logout")
        : [
            React.createElement("button", { key: "login", "data-testid": "navbar-login-button", type: "button" }, "login"),
            React.createElement(
              "button",
              { key: "register", "data-testid": "navbar-register-button", type: "button" },
              "register",
            ),
          ],
    );

  return { NavbarAuth: navbarAuth };
});

vi.mock("@/components/layout/navbar/nav-link", () => {
  const navLink = ({
    href,
    children,
    testId,
  }: {
    href: string;
    children: React.ReactNode;
    testId?: string;
  }) => React.createElement("a", { href, "data-testid": testId }, children);

  return { NavLink: navLink };
});

describe("Navbar mobile behavior + auth/role visibility", () => {
  beforeEach(() => {
    mockIsAuthenticated = false;
  });

  it("opens mobile menu and displays menu content", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(createSessionUser({}));

    render(await Navbar());

    expect(screen.getByTestId("navbar-mobile")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-locale-switch")).toBeInTheDocument();
    expect(screen.queryByTestId("navbar-mobile-menu-panel")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("navbar-mobile-menu-toggle"));

    expect(screen.getByTestId("navbar-mobile-menu-panel")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-mobile-menu-nav")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-mobile-auth-container")).toBeInTheDocument();
  });

  it("not logged in: no staff links, login/register visible, logout hidden, locale switch visible", async () => {
    mockIsAuthenticated = false;
    vi.mocked(getSessionUser).mockResolvedValue(createSessionUser({}));

    render(await Navbar());
    fireEvent.click(screen.getByTestId("navbar-mobile-menu-toggle"));

    expect(screen.queryByText("web:layout.navbar.links.dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("web:layout.navbar.links.trainings")).not.toBeInTheDocument();
    expect(screen.queryByText("web:layout.navbar.links.exercises")).not.toBeInTheDocument();
    expect(screen.getByTestId("navbar-login-button")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-register-button")).toBeInTheDocument();
    expect(screen.queryByTestId("navbar-logout-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("navbar-locale-switch")).toBeInTheDocument();
  });

  it("logged in customer: no staff links, login/register hidden, logout visible, locale switch visible", async () => {
    mockIsAuthenticated = true;
    vi.mocked(getSessionUser).mockResolvedValue(
      createSessionUser({
        isAuthenticated: true,
        isCustomer: true,
        isStaff: false,
      }),
    );

    render(await Navbar());
    fireEvent.click(screen.getByTestId("navbar-mobile-menu-toggle"));

    expect(screen.queryByText("web:layout.navbar.links.dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("web:layout.navbar.links.trainings")).not.toBeInTheDocument();
    expect(screen.queryByText("web:layout.navbar.links.exercises")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navbar-login-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navbar-register-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("navbar-logout-button")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-locale-switch")).toBeInTheDocument();
  });

  it("logged in staff: staff links visible, login/register hidden, logout visible, locale switch visible", async () => {
    mockIsAuthenticated = true;
    vi.mocked(getSessionUser).mockResolvedValue(
      createSessionUser({
        isAuthenticated: true,
        isTrainer: true,
        isStaff: true,
      }),
    );

    render(await Navbar());
    fireEvent.click(screen.getByTestId("navbar-mobile-menu-toggle"));

    expect(screen.getByText("web:layout.navbar.links.dashboard")).toBeInTheDocument();
    expect(screen.getByText("web:layout.navbar.links.trainings")).toBeInTheDocument();
    expect(screen.getByText("web:layout.navbar.links.exercises")).toBeInTheDocument();
    expect(screen.queryByTestId("navbar-login-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navbar-register-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("navbar-logout-button")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-locale-switch")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-mobile-nav-link-0")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-mobile-nav-link-1")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-mobile-nav-link-2")).toBeInTheDocument();
  });
});
