產出中英文版 AI Agent GitHub Digest(2026-11-28):5 個 trending repos(obra/superpowers、elementalsouls/Claude-BugHunter、google-labs-code/stitch-skills、HKUDS/CLI-Anything、zhouxiaoka/autoclip)+ 2 個 notable releases(Pydantic AI v2.76.0、modelcontextprotocol/servers v2.6.0)。

例外:
- 圖解:無適合段落(純新聞條列,repo/release 之間沒有可畫的結構關係)。
- `gh api` 對非 vincentxuu/quidproquo、lanefoundry/gatelane 的第三方公開 repo 回「GitHub access to this repository is not enabled for this session」(session 的 gh/GitHub API 存取被限定在這兩個 repo,連未認證 curl api.github.com 也被同一層擋下)。改用 Groundlane `web_fetch` 直接讀各 repo 的 `releases.atom` 與 shields.io 星數徽章取代 gh api 查 release 與星數,未進一步降級到 Keenable/You.com/雲端 MCP。
