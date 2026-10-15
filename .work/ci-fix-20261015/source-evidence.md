# CI source evidence — 2026-10-15

- Groundlane: no matching callable tools in full inventory. Public-source fallback: Exa MCP web_fetch_exa.
- Google VRP current rules: https://bughunters.google.com/about/rules/6625378258649088/google-and-alphabet-vulnerability-reward-program-vrp-rules . S0 T0/T1 base USD101010, T2 USD75000; quality factors 0.8/1/1.2 at panel discretion. Domain tier, information tier and action criticality are separate. No universal 1.5x factor in retrieved current table.
- Microsoft: https://www.microsoft.com/en-us/msrc/bounty-hyper-v . L1 RCE with functioning exploit+high-quality report maximum USD250000, without exploit high/medium/low USD200000/100000/50000. L2 maximum USD150000. Information disclosure high maximum USD25000. No Google-style multiplier.
- Apple: https://security.apple.com/bounty/categories/ . No-interaction network-to-kernel maximum USD2000000, browser-to-kernel USD1000000, WebContent sandbox escape USD300000. PCC remote attack on request data unsigned code execution USD1000000; distinct categories, not one combined kernel+PCC requirement. Bonuses require conditions.
- Meta: https://bugbounty.meta.com/payout-guidelines/private-processing/ . External TEE code execution/privilege escalation and VM escape up to USD300000; data leaks USD150000; internal code execution/privilege escalation/data leaks USD50000; internal VM escape N/A. External/internal are threat-model conditions, not report-quality factors.
- Mozilla: https://www.mozilla.org/en-US/security/client-bug-bounty/ . Use current official severity and exploit tables instead of unverified purported employee leak.
- PortSwigger: https://portswigger.net/web-security/cross-site-scripting . XSS requires browser-side script execution; HTTP200 or raw reflection alone is not proof. Local JSON shop is a safe HTTP/authorization baseline, not proof of XSS.

These checks support changed statements only; do not label the complete series independently fact-checked.

- Translation corrections used primary MDN/PortSwigger via platform web after a bounded Exa invocation failure. No fallback result is evidence of Groundlane availability.
