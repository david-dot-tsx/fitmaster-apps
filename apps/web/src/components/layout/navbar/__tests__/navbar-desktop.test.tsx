import React, { type AnchorHTMLAttributes, type ImgHTMLAttributes } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

vi.mock("@/components/layout/navbar/navbar-mobile", () => {
  const navbarMobile = () => null;

  return {
    NavbarMobile: navbarMobile,
  };
});

vi.mock("@/components/layout/navbar/navbar-desktop", () => {
  const navbarDesktop = ({
    navLinks,
    isAuthenticated,
  }: {
    navLinks: { href: string; label: string }[];
    isAuthenticated?: boolean;
  }) =>
    React.createElement(
      "div",
      { "data-testid": "navbar-desktop" },
      React.createElement("div", { "data-testid": "navbar-locale-switch" }),
      ...navLinks.map((link) => React.createElement("a", { key: link.href, href: link.href }, link.label)),
      isAuthenticated
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

  return {
    NavbarDesktop: navbarDesktop,
  };
});

describe("Navbar desktop auth + role visibility", () => {
  it("not logged in: no staff links, login/register visible, logout hidden, locale switch visible", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(createSessionUser({}));

    render(await Navbar());

    expect(screen.queryByText("web:layout.navbar.links.dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("web:layout.navbar.links.trainings")).not.toBeInTheDocument();
    expect(screen.queryByText("web:layout.navbar.links.exercises")).not.toBeInTheDocument();
    expect(screen.getByTestId("navbar-login-button")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-register-button")).toBeInTheDocument();
    expect(screen.queryByTestId("navbar-logout-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("navbar-locale-switch")).toBeInTheDocument();
  });

  it("logged in customer: no staff links, login/register hidden, logout visible, locale switch visible", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(
      createSessionUser({
        isAuthenticated: true,
        isCustomer: true,
        isStaff: false,
      }),
    );

    render(await Navbar());

    expect(screen.queryByText("web:layout.navbar.links.dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("web:layout.navbar.links.trainings")).not.toBeInTheDocument();
    expect(screen.queryByText("web:layout.navbar.links.exercises")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navbar-login-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navbar-register-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("navbar-logout-button")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-locale-switch")).toBeInTheDocument();
  });

  it("logged in staff: staff links visible, login/register hidden, logout visible, locale switch visible", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(
      createSessionUser({
        isAuthenticated: true,
        isTrainer: true,
        isStaff: true,
      }),
    );

    render(await Navbar());

    expect(screen.getByText("web:layout.navbar.links.dashboard")).toBeInTheDocument();
    expect(screen.getByText("web:layout.navbar.links.trainings")).toBeInTheDocument();
    expect(screen.getByText("web:layout.navbar.links.exercises")).toBeInTheDocument();
    expect(screen.queryByTestId("navbar-login-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("navbar-register-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("navbar-logout-button")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-locale-switch")).toBeInTheDocument();
  });
});
