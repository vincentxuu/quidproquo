# Mobile chat acceptance

2026-10-23. User requested actual mobile composer testing; desktop Chromium with mobile viewport/touch emulation and reduced visible viewport, not a physical OS keyboard.

Initial reproduction on localhost4321: viewport390x430 after entering3lines, textarea top512/bottom608, send544/bottom576. Both outside visible viewport; no horizontal overflow. Fixed-height root plus nonshrinking flex children/suggestion area suspected, subject to regression verification.

Scope: mobile fullpage and floating input, multiline/newline/composition/send, long transcript scrolling, keyboard-height simulation, touch targets. Also remove the unnecessary permanent cloud toolbar per earlier user feedback, retaining history/save in header menu. Mock SSE/private APIs to avoid model costs or changing personal data. No authentication bypass.

Source/automated pending; browser interactions pending; visual pending; production not deployed.

## Findings and fixes

- Reproduced red regression before source changes: mobile-chat-before.log. Textarea bottom608 at390x430. Fixed mobile page to visualViewport height with safe-area padding, min-height0 flex scroller, focused textarea only hides suggestions, and 44x44send target. Floating/sheet adapt to visualViewport; input stays16px to avoid iOSfocuszoom.
- Narrow cloud strip removed. Header has compact history disclosure; save/help live inside it; transient feedback replaces permanent row. Portal panel/toast is viewport-clamped and Escape closes only the disclosure, preserving parentchat.
- Caught focus regression: :focus-within also hid suggestionrefreshbutton onpointerdown. Restricted hide to :has(textarea:focus); refresh rerun passed.
- TraceHTML written under watched.work triggered Viteprogramreload/empty200. Polluted runs discarded. Personal runner now writes outside project via tmpdir or PERSONAL_TEST_OUTPUT_DIR. Clean dedicated preview4355 used for final runs.

## Final evidence

- 9/9 mobile Chromium cases PASS:320/390/430px, normal844height to430keyboard-space; fullpage+floating;44pxsend/nooverflow; ShiftEnter; syntheticIMEcomposition; explicitsendmockSSE;36messagelonghistoryscroll; inflightEnterkeepsnextdraft.
- 11/11 updated chat/history/menu cases PASS, includes mobile390both themes, portalfloatinghit/Escape, save/load and companiongeometry.
- Integrated personal/browser suite33/33 PASS: /tmp/mobile-chat-all-browser.log. Command PERSONAL_TEST_BASE_URL=http://localhost:4355 pnpm exec playwright test --config playwright.personal.config.ts --workers=1. Artifacts /tmp/quidproquo-personal-browser.
- 53 related unit tests PASS (/tmp/mobile-chat-unit.log), oxlint0errors/warnings, owned diff-checkPASS; final pnpm verifyPASS (/tmp/mobile-chat-final-verify.log).
- Actual light/dark390x430 screenshots inspected: evidence/mobile-composer-390x430-final.png and evidence/mobile-composer-390x430-dark-final.png. Measured inputbottom392, sendbottom366, send44x44, viewport430. Earlier *-fixed.png is a failed/emptydevcapture and is not acceptance evidence.

Limitations: mobile emulation with touch plus reducedvisualspace and syntheticcomposition, not physicaliOS/Androidkeyboard. API/SSE fixtures, no realAIcall or privateDBmutation. Existing fullvisualbaseline acceptance remains pending from previous report; these are behavioral/browserlayoutpasses. No commit/push/deployment.
