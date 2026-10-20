# Linux visual baseline review: PR191 head da67dc06

Recommendation: ACCEPT the four specified Linux actual images below as current baselines after root's review. No snapshots or commits changed by this reviewer.

Exacthead da67dc06c553d467d5384560a172ccab5b434e3c; run38831599758; visualjob116751396913; artifact visual-diff12017581132. Completejoblog /tmp/ci-pr191-da67-visual.log; downloadedartifact /tmp/ci-pr191-da67-visual-artifact.

## Functional prerequisite evidence

Devready219103ms. Threewarmup routes returnHTTP200; about exact關於我H1 and article exactH1 passed. Chatlight/dark2PASS against existingLinuxbaselines. Bothfloating cases found the realgenericlauncher, opened it and saw suggestions. Bothsidebar cases found exact✦AskAI, namedcomplementary關於這篇文章, saw suggestions, closed it, verifiedremoval/launcher, reopened and saw suggestions again. All four reached toHaveScreenshot; failures are only floatingdiff2 and missingsidebarbaseline2. Existingtimeouts,HTTP/H1,5000ms assertions and300pixelthreshold remain unchanged.

## Individual image review (view_image used on every listed image)

1. FloatingLIGHT: viewed expected,actual,diff. Oldexpected shows the article with oldtallheader/top2columnsuggestions. Newactual correctly shows/about/關於我 plus existingfloating520pxpanel. Headercompact,newsubtitle,suggestionsverticalabovecomposer,disclaimerandclosecontrols allrender cleanly. Backgroundchange follows correctedtestfixture; chatlayout matches d46ce901's intentional redesign. Diff152120pixels (~17%) is expected fixture/layout replacement, not fontnoise. ACCEPT.
2. FloatingDARK: viewed expected,actual,diff. Samecorrect/about background and floatingmode; darkpalette coherent, greeting/suggestions/input/closecontrols readable and uncut. Diff49670pixels (~6%) matches background/header/suggestionchanges. ACCEPT.
3. SidebarLIGHT: viewed actual. No prior sidebarexpected/diff exists (newcase). Correctarticle remains visible and reflows left;380pxsidebar sits flushright, fullheight, withcloseicon,greeting,article-specificsuggestions,currentarticlechip,composeranddisclaimer. No404,errorpage,missingpanel or clippedcontrols observed. MatchesChatSidebar implementation and6fe73f0a companionreadingproductchange; close/reopenassertions passed beforecapture. ACCEPT as NEWbaseline.
4. SidebarDARK: viewed actual. Samecorrectreflow/sidebar controls andarticlecontext in darkmode, coherentcolors andreadablecontent. No prior expected/diff; newcase. ACCEPT as NEWbaseline.

Magentaavatar rectangles are intentional existing imgmasks, not brokenassets. The smallAstrodevtoolbar at viewportbottom is existing devtestbehavior. RelatedpostsAPI logs localD1missingposts503; it did not block articleH1,chatinteractions orsidebarcapture. This review does not certify backendrelatedrecommendations or paidAIrequests.

## Exact source -> destination mapping

All sourcepaths are under /tmp/ci-pr191-da67-visual-artifact/test-results/:

- chat-Ask-AI-visual-floating-widget-open-light--chromium/floating-light-actual.png -> tests/visual/chat.spec.ts-snapshots/floating-light-chromium-linux.png
- chat-Ask-AI-visual-floating-widget-open-dark--chromium/floating-dark-actual.png -> tests/visual/chat.spec.ts-snapshots/floating-dark-chromium-linux.png
- chat-Ask-AI-visual-article-sidebar-open-light--chromium/sidebar-light-actual.png -> tests/visual/chat.spec.ts-snapshots/sidebar-light-chromium-linux.png
- chat-Ask-AI-visual-article-sidebar-open-dark--chromium/sidebar-dark-actual.png -> tests/visual/chat.spec.ts-snapshots/sidebar-dark-chromium-linux.png

SourceSHA256:
- floatinglight 9c7024e34a597e62d5a45aa1c505a4cb8b18f21e488a59e4ab011fafbbd51f0d
- floatingdark 833d248144288960cbb42488d320ff0b6a3fecb5dedf747015f0716abbf40549
- sidebarlight 2f5df90cf8038cac4c6d318b3edd6766ca48dd263ef1a6ac1480ce3300aaaccb
- sidebardark 71c1e0a97d9a8ae0c916350eddc3e128c42ef71b6893cad88ea79b578c73173d

Do NOT recopy chatbaselines (alreadyPASS),Darwinimages orold404actuals. NextCI must compare against updatedLinuxbaselines and pass all6cases; this recommendation is imageacceptance, not a greenCIclaim.

Root independently viewed all four actual screenshots and accepted them. Exact source hashes checked before copying into Linux baselines. This is not a green-run claim; final CI must compare all6cases successfully.

# Darwin real-browser candidates and source-backed review

Result: all6 cases passed HTTP/H1 and interaction prerequisites and reached screenshot comparison on actual macOS/Chromium. Existing4Darwin baselines differ and new2sidebar baselines are missing. No assertion, timeout, pixel threshold, productcode or trackedbaseline was changed by this reviewer. Recommend ACCEPT all6Darwin candidates after root review.

## Environment and source fidelity

Single Node22 server4343, main Astroconfig imported via temporarypublicconfig. Only isolatedvite.cacheDir and explicitserver.fs.allow=[repoRoot,realpath(node_modules)] added locally to handle worktree symlink dependencies. MainPlaywrightconfig imported; sameDesktopChromeviewport/browser, all6test bodies, HTTP/H1, close/reopen, fonts, animationdisable, imgmasks,5000ms assertions,300pixelthreshold and600secreadiness remain. Temporarypaths never staged. No Linuximage used as Macbaseline.

First6case run --update-snapshots=none produced4existing-case actualPNGs; missing-sidebar comparisons intentionally did not write actualPNGs. Then SAMEtempPlaywrightconfig changed only snapshotPathTemplate/outputDir to untracked .work candidates and ran existing2sidebarcases with --grep 'article sidebar' --update-snapshots=missing. It wrote2genuineMacPNG candidates after allsameinteractions; failures were expectedmissingbaseline only. Temporarytemplate/outputDir restored afterward. These preferredtest-generatedcandidates have identicalSHA to an earlier manual sameassertions capture; use the test-generatedfiles below, not manualones.

Logs /tmp/ci-visual-six-darwin-allowlisted-clean.log and /tmp/ci-visual-darwin-sidebar-candidate.log. Server log /tmp/ci-visual-darwin-allowlisted-server.log. Server remains live for rootcopy/quickcompare; no new localserver should be started.

## Strict image review

Viewed floatinglight/dark actuals: correct/about背景/關於我, truefloatingpanel, compactheader,currentlargertext,verticalsuggestions,composer,disclaimer,closebuttons. Fitsviewport,readablelight/dark, no404/loading/errorpage. Expectedbackgroundchange is the deliberatefixturefix; ChatFloatingcurrentlayout matches d46ce901 plus27bcc357. ACCEPT2floatingMacimages.

Viewed preferredtest-generatedsidebarlight/dark actuals: articlecorrectlyreflowsleft,nextto380pxrightpanel. Headerclose,greeting,articlequestions,currentarticlechip,input/disclaimer allvisible. Source tests performedclose/removal/reopen before capture. CorrectmacOStextmetrics differ fromLinux, as expected. ACCEPT2NEWsidebarMacimages.

Viewed BOTHchat expected/actual/diff separately. Difference is NOT an unexplainedregression: existingDarwinchatlastupdatedd46ce901(2026-09-19), while27bcc357(2026-09-22) deliberately increases subtitle11px→xs, suggestions/title/refreshxs→sm, message0.95rem→1rem, disclaimer/quotasizes and darksuggestioncards12%brandgreen. Gitshow of that exactcommit confirms changes in ChatHeader,ChatWidget,ChatThread,ChatMessageRow,chat.css. Currentactuals show those exactlargertext/rowheight/darktint changes; no missingcontrols/overflow observed. Lightdiff9293pixels,dark8806pixels reflect staleMacbaselines; do not call them mereantialiasnoise. ACCEPT2chatMacimages as source-backed intentionalUIupdate.

## Exact source mapping and SHA256

Sourcebase /tmp/quidproquo-ci-20261015/.work/ci-fix-20261015/:

- local-visual-results/chat-Ask-AI-visual-floating-widget-open-light--chromium/floating-light-actual.png -> tests/visual/chat.spec.ts-snapshots/floating-light-chromium-darwin.png
  SHA256 efed78d6369dc895e71f3144843d666a047c72afc54291f6cde05d9c2630bba6
- local-visual-results/chat-Ask-AI-visual-floating-widget-open-dark--chromium/floating-dark-actual.png -> tests/visual/chat.spec.ts-snapshots/floating-dark-chromium-darwin.png
  SHA256 25afb92c0dd809ab5a5a64b1c79f526741f81223a4502742ca0704b0783c7b87
- darwin-candidate-snapshots/sidebar-light-chromium-darwin.png -> tests/visual/chat.spec.ts-snapshots/sidebar-light-chromium-darwin.png
  SHA256 a273d81c9052415b792ac8a2950d2d54404a20bac58989bb148581f8b48959b0
- darwin-candidate-snapshots/sidebar-dark-chromium-darwin.png -> tests/visual/chat.spec.ts-snapshots/sidebar-dark-chromium-darwin.png
  SHA256 097de88c807f697cf761eadd3807d72211d7de16f5b88e0283bcb8a491462701
- local-visual-results/chat-Ask-AI-visual-chat-page-light--chromium/chat-light-actual.png -> tests/visual/chat.spec.ts-snapshots/chat-light-chromium-darwin.png
  SHA256 71375a736883ec454cf90b7c231830a1d3e485846e09bfdba9ce72b8f5fb1b86
- local-visual-results/chat-Ask-AI-visual-chat-page-dark--chromium/chat-dark-actual.png -> tests/visual/chat.spec.ts-snapshots/chat-dark-chromium-darwin.png
  SHA256 67b26e8ecd1f9305fcfca93ab5687d9da0c1513d119b751111e5101690ecf29a

After root copies approvedfiles, rerun original6case test through same restoredtempconfig --update-snapshots=none against retained4343server. Only thatcomparison can establish Mac6PASS; this candidateapproval is not yet a greenrun claim. Knownlocalrelatedposts503 frommissingD1table remains outside theseUIvisualchecks; no claim about livebackendAIresponses.

Root independently viewed all6 actualMacPNGs and accepted them; verified exactSHA before copying. No Linuximages substitute for Mac. Final strictnone6case compare remains required.

## Strict local comparison after approval

Same retainedmacOS/Chromium server, restored original snapshot template and all6 originaltestbodies: `--update-snapshots=none`,6passed in44.6s,exit0. OriginalHTTP/H1/close+reopen/5000ms/300pixel assertions retained. The single taskserver was stopped before parentqualitygates. Log/tmp/ci-visual-six-darwin-final.log. Linux must independently pass all6 in finalCI; localMac is notLinuxproof.
