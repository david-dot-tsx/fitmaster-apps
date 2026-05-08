import { describe, expect, it, vi } from "vitest";

import { API_HEADERS_KEYS } from "@repo/api/headers";
import { AUTH_COOKIES_NAMES } from "@repo/api/cookies";

const safeParseMock = vi.hoisted(() => vi.fn());
const jwtVerifyMock = vi.hoisted(() => vi.fn());

const fakeSessionUser = {
  id: "user-1",
  email: "user@example.com",
  role: "ADMIN",
  createdAt: new Date("2020-01-01T00:00:00.000Z"),
  updatedAt: new Date("2020-01-02T00:00:00.000Z"),
} as const;

vi.mock("@/env", () => ({
  env: {
    JWT_TOKEN_EXPIRES_IN_SECONDS: 3600,
    JWT_REFRESH_TOKEN_EXPIRES_IN_SECONDS: 7200,
  },
}));

vi.mock("@/lib/auth-cookie-builder", () => {
  return {
    AuthCookieBuilder: {
      getAuthTokenCookieSettings: (value: string) => ({
        name: AUTH_COOKIES_NAMES.TOKEN,
        value,
        cookieSettings: { tokenCookie: true, maxAge: 123 },
      }),
      getAuthRefreshTokenCookieSettings: (value: string) => ({
        name: AUTH_COOKIES_NAMES.REFRESH_TOKEN,
        value,
        cookieSettings: { refreshCookie: true, maxAge: 456 },
      }),
    },
  };
});

vi.mock("@repo/db/prisma", () => ({
  prisma: { __mocked: true },
}));

vi.mock("@repo/api/server", () => ({
  sessionUserSchema: {
    safeParse: (...args: unknown[]) => safeParseMock(...args),
  },
}));

describe("backend createTrpcFastifyContext", () => {
  it("builds context and wires cookie/jwt helpers for a valid token", async () => {
    safeParseMock.mockReturnValue({ success: true, data: fakeSessionUser });
    jwtVerifyMock.mockResolvedValue({ some: "decoded-token" });

    const { createTrpcFastifyContext } = await import("@/lib/trpc");

    const req = {
      headers: {
        [API_HEADERS_KEYS.X_CLIENT_TYPE]: ["mobile", "web"],
        "x-device-name": "Pixel",
        "x-device-os": "Android",
        authorization: "Bearer jwt-token",
        "user-agent": "unit-test-agent",
      },
      cookies: {},
      ip: "127.0.0.1",
      server: {
        jwt: {
          verify: jwtVerifyMock,
        },
      },
    } as unknown as {
      headers: Record<string, unknown>;
      cookies: Record<string, string>;
      ip: string;
      server: { jwt: { verify: typeof jwtVerifyMock } };
    };

    const res = {
      jwtSign: vi.fn().mockResolvedValue("signed-jwt"),
      setCookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as {
      jwtSign: ReturnType<typeof vi.fn>;
      setCookie: ReturnType<typeof vi.fn>;
      clearCookie: ReturnType<typeof vi.fn>;
    };

    const ctx = await createTrpcFastifyContext({ req, res } as never);

    expect(ctx.sessionUser).toEqual(fakeSessionUser);
    expect(ctx.sessionDeviceType).toBe("mobile");
    expect(ctx.client.deviceInfo.name).toBe("Pixel");
    expect(ctx.client.deviceInfo.os).toBe("Android");
    expect(ctx.client.ip).toBe("127.0.0.1");

    // signToken helper
    await ctx.utils.signToken(fakeSessionUser);
    expect(res.jwtSign).toHaveBeenCalledWith(fakeSessionUser, { expiresIn: 3600 });

    // setAuthToken / setAuthRefreshToken
    ctx.utils.setAuthToken("access-token");
    expect(res.setCookie).toHaveBeenCalledWith(AUTH_COOKIES_NAMES.TOKEN, "access-token", {
      tokenCookie: true,
      maxAge: 123,
    });

    ctx.utils.setAuthRefreshToken("refresh-token");
    expect(res.setCookie).toHaveBeenCalledWith(AUTH_COOKIES_NAMES.REFRESH_TOKEN, "refresh-token", {
      refreshCookie: true,
      maxAge: 456,
    });

    // clearAuth helper
    ctx.utils.clearAuth();
    expect(res.clearCookie).toHaveBeenCalledWith(AUTH_COOKIES_NAMES.TOKEN);
    expect(res.clearCookie).toHaveBeenCalledWith(AUTH_COOKIES_NAMES.REFRESH_TOKEN);
  });

  it("sets sessionUser to null when jwt verification fails", async () => {
    safeParseMock.mockReturnValue({ success: false, data: null });
    jwtVerifyMock.mockRejectedValue(new Error("bad token"));

    const { createTrpcFastifyContext } = await import("@/lib/trpc");

    const req = {
      headers: {
        [API_HEADERS_KEYS.X_CLIENT_TYPE]: "web",
        "x-device-name": "Laptop",
        "x-device-os": "macOS",
        authorization: "Bearer jwt-token",
        "user-agent": "unit-test-agent",
      },
      cookies: {},
      ip: "127.0.0.1",
      server: {
        jwt: {
          verify: jwtVerifyMock,
        },
      },
    } as unknown as {
      headers: Record<string, unknown>;
      cookies: Record<string, string>;
      ip: string;
      server: { jwt: { verify: typeof jwtVerifyMock } };
    };

    const res = {
      jwtSign: vi.fn().mockResolvedValue("signed-jwt"),
      setCookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as {
      jwtSign: ReturnType<typeof vi.fn>;
      setCookie: ReturnType<typeof vi.fn>;
      clearCookie: ReturnType<typeof vi.fn>;
    };

    const ctx = await createTrpcFastifyContext({ req, res } as never);

    expect(ctx.sessionUser).toBeNull();
  });
});
