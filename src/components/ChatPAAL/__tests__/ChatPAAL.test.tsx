import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ChatPAAL from "../index";

describe("ChatPAAL", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_PAAL_CHAT_ENABLED;
  });

  it("does not render the PAAL iframe by default", () => {
    expect(renderToStaticMarkup(<ChatPAAL />)).toBe("");
  });

  it("renders the PAAL iframe only when explicitly enabled", () => {
    process.env.NEXT_PUBLIC_PAAL_CHAT_ENABLED = "true";

    const markup = renderToStaticMarkup(<ChatPAAL />);

    expect(markup).toContain('id="paal-chat"');
    expect(markup).toContain('title="PAAL chat assistant"');
    expect(markup).toContain("https://app.paal.ai/wg?bid=ccee00d2");
  });
});
