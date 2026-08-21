---
title: "WebMCP: Letting a Web Page Hand Its Own Functions to an Agent"
date: 2026-08-21
category: tech
type: deep-dive
tags: [webmcp, mcp, ai-agent, browser-agent, chrome, web-standards]
lang: en
tldr: "WebMCP lets a page register its own functions as agent-callable tools via document.modelContext.registerTool(), replacing the agent's guess-the-button DOM scraping. Chrome opened an origin trial in 149 and estimates stable in 157; Edge followed in 150. But WebKit has formally opposed it ('an agent acting on a user's behalf is, in effect, assistive technology... the site should not single it out for different treatment') and Mozilla filed neutral. This post covers both APIs, where the security gates sit, and whether to invest now with one and a half engines behind it."
description: "A deep dive on WebMCP (document.modelContext): the imperative and declarative APIs, the permission and security model, implementation progress in Chrome, Edge, and Brave, the Mozilla and WebKit standards positions, and what to actually adopt today."
series:
  name: "Technology Choices in the AI Era"
  order: 8
draft: false
---

🌏 [中文版](/posts/tech/2026-08-21-webmcp-browser-tools)

The [previous post in this series](/posts/tech/2026-08-21-llms-txt-en) was about making your docs *readable* by machines. This one is the next step: making your page *callable* by them.

WebMCP is a set of browser APIs. It lets a page declare a set of "tools" in its own JavaScript — each with a name, a natural-language description, and a JSON Schema for its inputs. An AI agent inside the browser can then call them directly, instead of staring at a screenshot guessing which button says "checkout." The proposal comes from engineers at Microsoft Edge and Google Chrome, incubated in the W3C Web Machine Learning Community Group. The latest revision is a Draft Community Group Report dated 19 August 2026, and its status section is blunt: **this is not a W3C Standard, nor is it on the W3C Standards Track.**

One confusion to clear first: **WebMCP is not MCP**. Anthropic's MCP is a backend protocol speaking JSON-RPC, hosted on a server, alive whether or not anyone has a browser open. WebMCP runs entirely inside a browser tab; a tool's lifetime is the tab's lifetime. It inherits the user's already-authenticated session by construction, so there is no separate server to deploy and no second auth story to build. The spec's own framing is that pages using WebMCP "can be thought of as Model Context Protocol servers that implement tools in client-side script instead of on the backend." What the two share is the word "tool," not a wire.

## The two APIs

**Imperative** is the main one. The entry point hangs off `document.modelContext` (early drafts put it on `navigator`; it moved, a change also noted in [this site's AI-ready content post](/posts/ai/2026-03-30-ai-ready-content-en)):

```js
const controller = new AbortController();

await document.modelContext.registerTool({
  name: "add-todo",
  description: "Add a new item to the user's active todo list",
  inputSchema: {
    type: "object",
    properties: {
      text: { type: "string", description: "The text content of the todo item" }
    },
    required: ["text"]
  },
  annotations: { readOnlyHint: false, untrustedContentHint: true },
  async execute({ text }, { signal }) {
    await addTodoItemToCollection(text);   // reuse the page's existing logic
    return { content: [{ type: "text", text: `Added: ${text}` }] };
  }
}, { signal: controller.signal });
```

Three design details are worth noting. First, **unregistration goes through `AbortSignal`**, not a separate `unregisterTool()` method. That lets a tool's lifetime bind directly to a framework component's mount and unmount, which is exactly how React's `usewebmcp` package and Angular's experimental support wire it up. Second, `execute` receives a signal as its second argument, so when the user hits stop in the agent UI you can pass it straight to `fetch()`. Third, tool names are constrained: the spec requires 1 to 128 characters, ASCII alphanumerics plus `_`, `-`, and `.` only.

**Declarative** involves no JavaScript at all — two attributes on an existing `<form>`:

```html
<form toolname="createSupportRequest"
      tooldescription="Submits a request for customer support."
      action="/submit">
  <label for="firstName">First Name</label>
  <input type=text name=firstName>
  <select name="select" required
          toolparamdescription="Determines what team this request is routed to.">
    <option value="Customer happiness team">Return my purchase.</option>
    <option value="Website support team">Get help on the website.</option>
  </select>
  <button type=submit>Submit</button>
</form>
```

The browser synthesizes the JSON Schema from the form itself: each `<option>` becomes an `enum` member, `required` becomes a required field. When an agent calls the tool, the browser brings the form into view, focuses it, and fills the fields — and **the user still sees that form**, and by default still clicks submit themselves unless you add `toolautosubmit`.

A set of events and pseudo-classes comes with it. `SubmitEvent.agentInvoked` tells you whether this submission came from a human or an agent. `:tool-form-active` and `:tool-submit-active` let you style the moment an agent is operating the form; Chrome ships a default dashed outline.

This is the part of the proposal I find most elegant: it does not open an invisible side road for agents. It **sends the agent down the user's road, just with better aim**.

## The security model: four gates

WebMCP tools run in a tab where the user is already logged in. That is its greatest advantage and its greatest risk: whatever a tricked tool can do equals whatever the logged-in user can do. So the gates stack four deep:

1. **Secure context**: the IDL is marked `[SecureContext]`. Plain HTTP pages don't get the API.
2. **Origin isolation**: available only in origin-isolated documents. If a site enables `document.domain` (for example with the `Origin-Agent-Cluster: ?0` header), WebMCP switches off entirely.
3. **Permissions Policy**: both APIs are gated by the `tools` policy, which defaults to `self`. Cross-origin iframes therefore cannot register tools unless the embedder grants `allow="tools"`; without it, `registerTool()` rejects with `NotAllowedError`.
4. **The `exposedTo` allowlist**: by default a tool is visible only to same-origin documents and the browser's built-in agent. Exposing it to a third-party in-page agent — a support widget in an iframe, say — means naming the trusted origins one by one.

On top of that, Chrome's tool security guidance adds two things. One is a pair of annotations. `readOnlyHint` marks a tool as non-mutating, so the agent can judge when it needs to stop and ask a human. `untrustedContentHint` marks a return value as containing user-generated or externally sourced data, signalling that this output deserves extra scrutiny.

The other is a **character budget**. Chrome recommends keeping tool descriptions under 500 characters, with separate caps for parameter descriptions, tool names, and individual tool outputs; exceeding them tends to trip the agent's own guardrails.

Worth remembering: Chrome's companion document for agent developers concedes the point directly — models are probabilistic, and **safety inside an LLM cannot be guaranteed**. Its answer is defence in depth: cap inbound tokens, restrict which origins the agent may touch, wrap untrusted content in base64 and tell the model in the system prompt that this block is data, not instructions. That last trick costs roughly a third more tokens. This is an engineering compromise made after conceding the problem is unsolved, not a solution.

## Who is actually building this

| Engine | Status (2026-08) |
|---|---|
| Chrome | Dev Trial 146, Origin Trial 149–156, stable estimated at 157 |
| Edge | Origin Trial from 150 |
| Brave | Experimental support in Leo AI chat |
| Firefox | Standards position: **neutral** |
| Safari | Standards position: **oppose** |

Chrome's progress is real. For local development, flip `chrome://flags/#enable-webmcp-testing`; for production you can sign up for the origin trial. The proposal repository has 3,033 stars (read 2026-08-21) and over a hundred open issues, with active discussion.

But the other two engines' positions are the part worth actually reading before you choose.

Mozilla filed **neutral**. Their reasoning is that in an adversarial setting, the tools a site offers may not match what a user actually sees on the page. They also note it is currently impossible to tell how much of that risk this API creates versus how much is inherent to an LLM consuming web content at all. They dislike the name too — "There is no MCP here" — and suggest something like Website Tool API instead.

WebKit filed a clear **oppose**, and the reasoning deserves reading in full, because it is not nitpicking details; it rejects the direction:

> An agent acting on a user's behalf is, in effect, **assistive technology**: it should operate a site as the user would, and the site should not single it out for different treatment. WebMCP does the opposite, making "an agent is driving" an observable fact.

WebKit's second argument is sharper: they think the reliability promise is false. An agent still picks a tool by reading its natural-language name and description. WebKit quotes the spec's own concession here — that there is "no guarantee that a WebMCP tool's declared intent matches its actual behavior" — and concludes that a typed schema constrains an argument's shape, not the meaning the agent must infer. The brittleness, in their reading, **just moves from the DOM into the tool descriptions**. Add that `exposedTo` lets a site grant agents capabilities it withholds from its human UI (and vice versa), and they see two unequal webs forming.

In mid-June, WebKit went further and proposed setting WebMCP aside back to the problem-definition stage: stand up a separate community group, hold a W3C Workshop to re-scope, targeting TPAC in late October 2026.

Chrome's reply is public in the same thread. The core of it: real agents already drive pages by injecting JavaScript and even using `chrome.debugger`, so "an agent must be unobservable" is not a premise that holds today. That rebuttal has force — but what it establishes is that the status quo is bad, not that WebMCP is the right fix.

## Should you invest now

My read splits three ways.

**If you already build browser agents or Chrome extensions**, invest now. The origin trial is open and the payoff is immediate: one structured call replaces a dozen guessed clicks, and you control both ends.

**If you run an ordinary product site with existing form flows**, do only the declarative half. Adding `toolname` and `tooldescription` to a form you already have costs a few lines of HTML, changes no architecture, and affects no human user; in a browser without support they are two ignored unknown attributes. This is the best risk-to-reward ratio in the whole proposal — and it happens to be the half WebKit treated most gently. Chrome asked them directly whether a declarative-only version would be acceptable; neither side closed that question.

**If you are considering re-architecting a frontend for agents**, don't. Not because the technology is bad, but because the bet is lopsided. One limitation Chrome lists itself is very real: **there is no up-front tool discoverability**. An agent has to navigate to your page and finish loading before it knows whether you have tools at all, and a `.well-known`-style manifest is still only a community proposal. With one engine opposed and one neutral, rewriting business logic into a tool layer today means betting on one spec and one browser.

One practical warning: the docs and the spec disagree right now. Chrome's imperative API page passes arguments as a JSON string (`executeTool(tool, '{"text": "Buy milk"}')`), while the spec's IDL takes an `object` that the browser serializes internally — and the proposal's own README example passes an object too. A gap like that is normal during an origin trial, but it is a signal: **run it yourself behind the flag before you copy anything out of the docs.**

## Overall

WebMCP bets on the same premise as llms.txt — that the readership of the web has permanently changed — but it is far more aggressive about it. llms.txt is a Markdown index; if it's wrong, nobody reads it. WebMCP asks you to hand over executable capability to a probabilistic, injectable caller.

So the conclusion here is not "this is the future, get on board." It is: **ship the declarative half now, and let the imperative half follow engine consensus**. The one thing all three positions actually agree on is that the human interface stays primary and the human stays in the loop. The rest can wait for TPAC.

## References

- [WebMCP specification (W3C Web Machine Learning CG Draft Report, 2026-08-19)](https://webmachinelearning.github.io/webmcp/)
- [webmachinelearning/webmcp explainer and proposal repository](https://github.com/webmachinelearning/webmcp)
- [WebMCP implementation status across browsers](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md)
- [WebMCP — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp)
- [Imperative API — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp/imperative-api)
- [Declarative API — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp/declarative-api)
- [WebMCP best practices — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp/best-practices)
- [WebMCP tool security — Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp/secure-tools)
- [Agent security considerations for WebMCP — Chrome for Developers](https://developer.chrome.com/docs/agents/security)
- [Join the WebMCP origin trial (Chrome blog)](https://developer.chrome.com/blog/ai-webmcp-origin-trial)
- [WebMCP — Chrome Platform Status (milestones)](https://chromestatus.com/feature/5117755740913664)
- [Mozilla standards-positions #1412 (neutral)](https://github.com/mozilla/standards-positions/issues/1412)
- [WebKit standards-positions #670 (oppose)](https://github.com/WebKit/standards-positions/issues/670)
- On this site: [llms.txt: The Copy of Your Docs Written for Machines](/posts/tech/2026-08-21-llms-txt-en), [shadcn registry and MCP](/posts/tech/2026-08-21-shadcn-registry-mcp-en), [Choosing a React Stack in the AI Era](/posts/tech/2026-08-19-react-stack-ai-era-en), [AI-ready content strategy](/posts/ai/2026-03-30-ai-ready-content-en)
