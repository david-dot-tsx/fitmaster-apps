import { type NextRequest } from "next/server";

import { type CookieSetupParams } from "@/lib/proxy/types/cookie-setup-params";

export interface HandlerBag {
  request: NextRequest;
  redirectUrl: URL | null;
  cookiesBag: CookieSetupParams[];
  headersBag: Record<string, string | undefined>;
}

export interface Handler {
  setNext(handler: Handler): Handler;
  handle(props: HandlerBag): Promise<HandlerBag>;
}

export abstract class AbstractHandler implements Handler {
  private nextHandler: Handler | null = null;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;

    return handler;
  }

  protected abstract process(props: HandlerBag): Promise<HandlerBag>;

  public async handle(props: HandlerBag): Promise<HandlerBag> {
    const result = await this.process(props);

    if (this.nextHandler) {
      return await this.nextHandler.handle(result);
    }

    return result;
  }
}
