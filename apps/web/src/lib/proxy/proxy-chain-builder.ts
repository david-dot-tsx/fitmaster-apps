import { NextResponse } from "next/server";

import { type HandlerBag, type Handler } from "@/lib/proxy/handlers/abstract-handler";

export class ProxyChainBuilder {
  private first: Handler | null = null;
  private last: Handler | null = null;

  add(handler: Handler): this {
    if (!this.first) {
      this.first = handler;
      this.last = handler;
    } else {
      this.last?.setNext(handler);
      this.last = handler;
    }

    return this;
  }

  private buildChain(): Handler {
    if (!this.first) throw new Error("No handlers");

    return this.first;
  }

  private buildResponse(result: HandlerBag) {
    const res = result.redirectUrl
      ? NextResponse.redirect(result.redirectUrl)
      : NextResponse.next();

    result.cookiesBag.forEach((cookie) => {
      if (cookie.value) {
        res.cookies.set(cookie.name, cookie.value, cookie.cookieSettings);
      } else {
        res.cookies.delete(cookie.name);
      }
    });

    Object.entries(result.headersBag).forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        res.headers.set(name, value);
      } else {
        res.headers.delete(name);
      }
    });

    return res;
  }

  async run({
    request,
    redirectUrl = null,
    cookiesBag = [],
    headersBag = {},
  }: Partial<HandlerBag> & Pick<HandlerBag, "request">): Promise<NextResponse> {
    const result = await this.buildChain().handle({
      request,
      redirectUrl,
      cookiesBag,
      headersBag,
    });

    return this.buildResponse(result);
  }
}
