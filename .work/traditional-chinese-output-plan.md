# Traditional Chinese output normalization

- [completed] Add a Workers-compatible Simplified-to-Traditional Chinese converter.
- [completed] Normalize all zh-TW writer and semantic-cache responses at the shared response boundary.
- [completed] Add focused tests for conversion, English bypass, Markdown links, and protected code fences.
- [completed] Prevent fenced critic JSON and Groq SDK retries from delaying provider fallback and answer delivery.
- [pending] Run `pnpm verify`, deploy, and validate the production fallback answer.
