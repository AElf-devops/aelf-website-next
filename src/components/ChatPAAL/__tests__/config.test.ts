import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isPaalChatEnabled } from "../config";

describe("isPaalChatEnabled", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_PAAL_CHAT_ENABLED;
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_PAAL_CHAT_ENABLED;
  });

  it("disables PAAL chat by default", () => {
    expect(isPaalChatEnabled()).toBe(false);
    expect(isPaalChatEnabled(undefined)).toBe(false);
    expect(isPaalChatEnabled("")).toBe(false);
    expect(isPaalChatEnabled("false")).toBe(false);
  });

  it("enables PAAL chat only when explicitly set to true", () => {
    expect(isPaalChatEnabled("true")).toBe(true);
    expect(isPaalChatEnabled("TRUE")).toBe(false);
    expect(isPaalChatEnabled("1")).toBe(false);
  });
});
