# Admin Session AI Elements Integration

## Scope

- Replace `/admin/sessions/[id]` inline transcript rendering with a React island.
- Keep the existing session SSE API and event schema.
- Add the minimum Tailwind/shadcn-compatible foundation needed for copy-in AI Elements-style components.

## Tasks

- [x] Add AI SDK, Tailwind, shadcn helper dependencies.
- [x] Add Tailwind Vite integration and global import.
- [x] Add local `cn` helper and AI Elements-style primitives.
- [x] Build `AdminSessionChat` React component against existing SSE events.
- [x] Mount the component from the Astro session page.
- [x] Run focused verification.
