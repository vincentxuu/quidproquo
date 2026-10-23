// Route videos for the Korea crags series.
// One entry per crag; the `video-gallery` fence in a post references the key and
// renders the same data in both language versions.
// `embed: false` marks clips that will not play in an embed — the owner disabled
// it, or a music claim blocks iframe playback. They render as external links
// instead of a selectable card.

export interface GalleryVideo {
  /** YouTube video id, 11 characters. */
  id: string;
  /** Original video title, used for the iframe accessible name. */
  title: string;
  /** Route label shown on the card. */
  route: string;
  routeEn: string;
  /** Short note about what the clip shows. */
  note: string;
  noteEn: string;
  /** Runtime as m:ss. */
  length: string;
  channel: string;
  embed?: boolean;
}

export interface VideoGallery {
  videos: GalleryVideo[];
}

export const videoGalleries: Record<string, VideoGallery> = {
  insubong: {
    videos: [
      { id: 'XQE74rkLVRs', title: 'Multi-pitch rock climb up Insubong Peak in Korea', route: 'Pigeon 5.7 A0（西面）', routeEn: 'Pigeon 5.7 A0 (west face)', note: '4 段完整攀登，英文；僅外部連結', noteEn: 'all four pitches, English; link only', length: '5:20', channel: 'John Carter', embed: false },
      { id: 'HLiRmyV9aBc', title: '인수봉 비둘기길을 오른 가천대 산악부', route: 'Pigeon 5.7 A0（西面）', routeEn: 'Pigeon 5.7 A0 (west face)', note: '大學山岳部隊伍', noteEn: 'university club ascent', length: '17:46', channel: '권코몽클라이밍tv' },
      { id: '9HxSEJiCOAg', title: '인수봉 정상을 쉽고도 빨리 올라갈 수 있는 길, 비둘기길(5.6~7)', route: 'Pigeon 5.7 A0（西面）', routeEn: 'Pigeon 5.7 A0 (west face)', note: '影片標 5.6~7、約 90 公尺；描述記兩人約 1 小時', noteEn: 'video gives 5.6–7 and about 90 m; roughly an hour for two', length: '13:22', channel: '김용기의클라이밍세상' },
      { id: 'Id8LRtAsqlA', title: 'Hanging Off a Cliff - Insubong Descent!', route: 'Pigeon 垂降', routeEn: 'Pigeon descent', note: '西面垂降實測', noteEn: 'the descent itself', length: '13:47', channel: 'Joel Bennett' },
      { id: 'lYVPPcpjoo0', title: '■경동클라이밍■ 북한산 인수봉 고독길 등반', route: 'Lonely Road 5.6（西面）', routeEn: 'Lonely Road 5.6 (west face)', note: '完整攀登，繩隊視角', noteEn: 'full ascent from the team', length: '16:50', channel: '맥클라이밍' },
      { id: 'OFNWgS2YQN0', title: '인수봉 고독길 8피치 마스터, 인수봉에서 가장 역사가 오래된 등반 루트를 오르다', route: 'Lonely Road 5.6（西面）', routeEn: 'Lonely Road 5.6 (west face)', note: '8 段版本（影片標題），歷史最久的路線', noteEn: 'eight-pitch version per the title, the oldest line', length: '17:47', channel: '여행발자국동행' },
      { id: 'TMjYfUO2wQk', title: 'Insubong Go-Deok Wei Gil, 고독의길 (lonely road) Approach + Climb', route: 'Lonely Road 5.6（西面）', routeEn: 'Lonely Road 5.6 (west face)', note: '從東側接近，攀登西面；僅外部連結', noteEn: 'east-side approach, west-face climb; link only', length: '7:01', channel: "The Tay's Adventures", embed: false },
      { id: 'JE5_SYb_-1k', title: '인수봉 인수a 길 등반 가이드.', route: 'Insu A 5.8（東面）', routeEn: 'Insu A 5.8 (east face)', note: '인수A 路線導覽，2016 年攀登', noteEn: 'route guide to Insu A, climbed in 2016', length: '17:37', channel: '맨발의청춘' },
      { id: 'C8o_GAt7YW0', title: '돼지 클라이머의 북한산 인수봉 인수A 암벽등반기', route: 'Insu A 5.8（東面，變形）', routeEn: 'Insu A 5.8 (east face, variation)', note: '走變形線；兩位繩隊的攀登紀錄', noteEn: 'the variation, not the original line; two-person team', length: '29:39', channel: '한호이' },
      { id: 'vgPPxd-jjM4', title: "초보자도 가능? 하지만 심장은 터질 듯한 '인수A' 수직 크랙의 공포 [4K]", route: 'Insu A 5.8（東面，變形）', routeEn: 'Insu A 5.8 (east face, variation)', note: '變形線 4K 影像，裂隙與岩板段', noteEn: 'the variation in 4K, cracks and slab', length: '13:12', channel: "Let's Go to the Mountains" },
      { id: '832EYL3GKNk', title: '인수봉 취나드 a 4피치, 재밍의 마력을 믿어라', route: 'Chouinard A 5.10a（東面）', routeEn: 'Chouinard A 5.10a (east face)', note: '只爬前 4 段', noteEn: 'stops after pitch 4', length: '28:02', channel: '쏘맥 클라이머' },
      { id: 'MQrD0McDfqQ', title: '인수봉 명품코스 취나드 A를 오르다', route: 'Chouinard A 5.10a（東面）', routeEn: 'Chouinard A 5.10a (east face)', note: '名品段，作者關閉嵌入', noteEn: 'classic pitches, embed disabled', length: '10:39', channel: '김용기의클라이밍세상', embed: false },
      { id: '4UdmiJv42x8', title: '어이, 인수봉 바위 맛 좀 볼텨? Climbing Insubong Peak, Seoul (ENG SUB)', route: 'Chouinard B 5.8（東面）', routeEn: 'Chouinard B 5.8 (east face)', note: '英文字幕', noteEn: 'English subtitles', length: '10:01', channel: '야생민짜 Wildminzza' },
      { id: 'HxdmcFZcFuU', title: 'Insu-bong chouinard-b, Rock climbing in Seoul', route: 'Chouinard B 5.8（東面）', routeEn: 'Chouinard B 5.8 (east face)', note: '完整 Vlog', noteEn: 'full vlog', length: '27:03', channel: 'Katie Daily' },
      { id: 'Nd2mY65a6Is', title: "Seoul's Hidden Crack Climbing Scene", route: 'Insu B 5.9（東面）', routeEn: 'Insu B 5.9 (east face)', note: '裂隙場景', noteEn: 'the crack scene', length: '14:49', channel: 'Sofia Jin' },
      { id: '1ekZvEa443U', title: '인수봉 봔트길 3피치 자유등반 영상', route: 'Wand 5.10b（東面）', routeEn: 'Wand 5.10b (east face)', note: '3 段自由攀登版本', noteEn: 'three-pitch free version', length: '8:59', channel: '권코몽클라이밍tv' },
      { id: 'jORFOAVszw8', title: '인수봉 봔트, 등반 경력의 터닝 포인트. 성공 전략 분석', route: 'Wand 5.10b（東面）', routeEn: 'Wand 5.10b (east face)', note: '2–3 段為重點；作者分析攀登策略，嵌入受限', noteEn: 'pitches 2–3 are the key; the author analyses the strategy, embed disabled', length: '17:21', channel: 'K Climbing Company', embed: false },
      { id: 'S4AsrxbDCuo', title: '인수봉 만인보 동작풀이 (등강기 등반)', route: 'Maninbo 5.11b（東面）', routeEn: 'Maninbo 5.11b (east face)', note: '無確保者的獨攀紀錄；描述自述常以等升器攀登，crux 在 3–4 號 bolt 之間', noteEn: 'a solo ascent without a belayer; the description says he often uses ascenders, and puts the crux between bolts 3 and 4', length: '5:00', channel: '이윤섭' },
      { id: 'gOR1u9IWFCQ', title: '손정준과 함께하는 한국의 암벽 10회 - 북한산 인수봉 빌라코스', route: 'Villa 5.12a（依指南定位）', routeEn: 'Villa 5.12a (locate via guide)', note: 'NEPA 系列；影片標南西面 5.12b，與指南的 5.12a／A2 記法不同', noteEn: "NEPA series; the video labels it southwest face 5.12b, unlike the guide's 5.12a/A2", length: '6:52', channel: '네파 NEPA' },
      { id: 'PJA9b7BfHSA', title: '인수봉-빌라길 IRC 20190525', route: 'Villa 5.12a（依指南定位）', routeEn: 'Villa 5.12a (locate via guide)', note: 'IRC 繩隊攀登紀錄', noteEn: 'IRC team ascent', length: '14:18', channel: '유성Climb TV.' },
      { id: 'U7_sJeeFr1U', title: '인수봉의 명품길!, 빌라길 제2피치/1980년대 후반 국내 최초로 5.12급대 페이스등반 시작이 된 빌라!', route: 'Villa 5.12a（依指南定位）', routeEn: 'Villa 5.12a (locate via guide)', note: '第 2 段詳解，含 1980 年代首攀背景；僅外部連結', noteEn: 'pitch 2 breakdown with 1980s first-ascent background; link only', length: '13:57', channel: '김용기의클라이밍세상', embed: false },
      { id: '4f8aBMKVTZg', title: '인수봉등반/크로니길 전 피치', route: 'Crony 5.9（東壁）', routeEn: 'Crony 5.9 (east face)', note: '全段剪輯；大學山岳部隊伍', noteEn: 'all pitches, edited; university club team', length: '4:53', channel: '올라보라' },
      { id: '3Fb6ECtneSw', title: '인수릿지길', route: 'Insu Ridge 5.9（北稜）', routeEn: 'Insu Ridge 5.9 (north ridge)', note: '稜線攀登紀錄；影片未標段數', noteEn: 'ridge ascent; the video does not label pitch count', length: '8:41', channel: '마굿간 클럽' },
      { id: 'rT0-cBQL4Ac', title: '인수봉 아미동길 등반 가이드', route: 'Amidong 5.10a（東壁）', routeEn: 'Amidong 5.10a (east face)', note: '完整路線導覽；2017 年攀登，描述列了裝備', noteEn: 'full route guide; climbed in 2017, with the rack listed', length: '14:50', channel: '맨발의청춘' },
      { id: 'YbPcvy-DcOA', title: '55년 전 서울대 의대생들이 개척한 암벽길...북한산 인수봉 의대길 암벽등반', route: 'Medical School 5.10a A0（東壁）', routeEn: 'Medical School 5.10a A0 (east face)', note: '從 1971 年開拓史到實際攀登；描述附報導連結', noteEn: 'from the 1971 first-ascent history to the climb; the description links the source article', length: '25:09', channel: '한호이' },
      { id: '8TWRzQEHoaQ', title: '인수봉 구조대길 암벽등반 - 스카이락알파인클럽 최충현 대장, 전향숙, 이형희, 송팔용', route: 'Rescuer 5.10a A0（東壁）', routeEn: 'Rescuer 5.10a A0 (east face)', note: '12 段完整攀登剪輯；4 人繩隊，描述記約 4 小時 30 分', noteEn: 'edited 12-pitch ascent; four-person team, description gives about 4.5 hours', length: '10:17', channel: '여행발자국동행' },
      { id: 'HIRaIU_oOH0', title: '인수봉 패시길', route: 'PASI 5.10c（東壁）', routeEn: 'PASI 5.10c (east face)', note: '攀登紀錄；2017 年上傳', noteEn: 'ascent footage; uploaded in 2017', length: '9:26', channel: '헤드셰프캠핑카' },
      { id: 'zl4q0vEWn0o', title: '2026.5.1(금)인수봉 산천지길', route: 'Sanchonji 5.11a（東壁）', routeEn: 'Sanchonji 5.11a (east face)', note: '完整路線剪輯，從岩底到山頂合照，含 5.11a crux', noteEn: 'edited full route, base to the summit group shot, including the 5.11a crux', length: '15:01', channel: '고양이 삼촌' },
      { id: 'lOQfMuHDyvY', title: '2025.6.23(월)인수봉 동양길(5.10b)', route: 'Dongyang-gil 5.10b（東南面）', routeEn: 'Dongyang-gil 5.10b (southeast face)', note: '2025 年完整攀登，標 5.10b', noteEn: 'full 2025 ascent, labelled 5.10b', length: '9:30', channel: '고양이 삼촌' },
      { id: 'P4bkKEszYXo', title: '인수봉 하늘길 루트파인딩, KMGA 정기등반에 가다', route: 'Haneul-gil 5.10c（南面）', routeEn: 'Haneul-gil 5.10c (south face)', note: '路線尋找與攀登；KMGA 定期攀登', noteEn: 'route finding and ascent on a KMGA club day', length: '8:07', channel: 'K Climbing Company' },
      { id: '0AkY0Vahzdo', title: '201607 인수봉 거룡길', route: 'Georyong-gil 5.12b（南面）', routeEn: 'Georyong-gil 5.12b (south face)', note: '34 分鐘第一人稱視角，前段裂隙到上段岩面一路拍完，份量遠超過前 4 段', noteEn: 'a 34-minute first-person record from the lower cracks through the upper face, well past the first four pitches', length: '34:00', channel: 'rawild K' },
      { id: '1jX2tvG2Dhk', title: '[북한산 인수봉] 정상 하강 포인트 완벽 정리! 70m 로프 2동으로 한 번에 하강하기 (POV)', route: '登頂下降', routeEn: 'summit descent', note: '山頂以 70 公尺雙繩一次下降到地面的錨點選擇；60 公尺繩仍需分段', noteEn: 'anchor choice for a single 70 m double-rope rappel from the summit; a 60 m rope still needs two', length: '2:38', channel: '어푸어푸어프로치' },
      { id: 'xrTd0dvMCIM', title: '아직도 구조대로 빠지시나요? 북한산 인수봉 서면 최단 어프로치 (POV/GPX)', route: '西面接近（Pigeon／Lonely Road）', routeEn: 'west-face approach (Pigeon / Lonely Road)', note: '從道詵寺廣場到西面岩底的 POV，附 GPX', noteEn: 'POV from Doseonsa plaza to the west-face base, with GPX', length: '22:57', channel: '어푸어푸어프로치' },
    ],
  },

  seoninbong: {
    videos: [
      { id: 'oJOoIw5DtpY', title: '선인봉 은벽길', route: 'Silver 은벽길 5.8', routeEn: 'Silver / 은벽길 5.8', note: '完整攀登', noteEn: 'full ascent', length: '11:17', channel: '냉감자 icegamza' },
      { id: 'ZruZAx_hP28', title: '도봉산 선인봉 은벽길 3피치', route: 'Silver 은벽길 5.8', routeEn: 'Silver / 은벽길 5.8', note: '3 段版本', noteEn: 'three-pitch version', length: '11:19', channel: '장연달 암벽 영상' },
    ],
  },

  daeryukbong: {
    videos: [
      { id: 'n4-N6SBYbwU', title: '부산 금정산 대륙봉 쓰레기(5.10a)', route: 'Trash 쓰레기 5.10a', routeEn: 'Trash / 쓰레기 5.10a', note: '12 公尺短線', noteEn: 'the 12 m line', length: '6:44', channel: '온더락' },
    ],
  },

  ganhyeon: {
    videos: [
      { id: '7wHKxjqx4Fk', title: '간현암 물결 5.12a 완등 윤은미 클라이밍', route: 'Wave 물결 5.12a', routeEn: 'Wave / 물결 5.12a', note: '完攀紀錄', noteEn: 'the send', length: '3:04', channel: '윤은미클라이밍클럽' },
    ],
  },

  'halmae-bawi': {
    videos: [
      { id: 'vAmb5Beqmgs', title: '할매바위 곰소길 (10b)', route: 'Salty Road 곰소길 5.10c', routeEn: 'Salty Road / 곰소길 5.10c', note: '短版，級數紀錄不同', noteEn: 'short take, records a different grade', length: '3:06', channel: '클라이밍하는 현' },
      { id: 'RKiODimeW8I', title: '고창 할매바위 곰소길', route: 'Salty Road 곰소길 5.10c', routeEn: 'Salty Road / 곰소길 5.10c', note: '完整攀登；僅外部連結', noteEn: 'full ascent; link only', length: '7:40', channel: '신난다 클라이밍', embed: false },
    ],
  },

  janggunbong: {
    videos: [
      { id: 'z1BFMhnoJvs', title: "설악산 장군봉 '기존길 3피치' IRC", route: 'Gi-Jon 기존길 5.10d', routeEn: 'Gi-Jon / 기존길 5.10d', note: '前 3 段完整', noteEn: 'first three pitches', length: '40:47', channel: '유성Climb TV' },
      { id: 'aEfWW3VnvDU', title: '[암벽등반] 설악산 장군봉 기존길 등반스케치', route: 'Gi-Jon 기존길 5.10d', routeEn: 'Gi-Jon / 기존길 5.10d', note: '攀登速寫', noteEn: 'ascent sketch', length: '6:50', channel: 'korea rock climbing' },
    ],
  },

  // Cheese Dorito and Pig Farm have no public footage; these are the problems
  // other climbers have filmed at the same crag (all shot on the Musucheon bed).
  'jeju-bouldering': {
    videos: [
      { id: 'vJi0Fowoo9U', title: 'Spanish Kimchi - V5, The School crag', route: 'Spanish Kimchi V5', routeEn: 'Spanish Kimchi V5', note: '同岩區，和兩道 V5 同級', noteEn: 'same crag, same grade as the two V5s', length: '1:04', channel: '산왕의 볼더 라이브러리' },
      { id: '9MY8yibS56o', title: 'Picante - V4, The School crag', route: 'Picante V4', routeEn: 'Picante V4', note: '河床岩質與落地', noteEn: 'riverbed rock and landings', length: '1:04', channel: '산왕의 볼더 라이브러리' },
      { id: 'bhvPSdaH_j4', title: 'Scholar - V4, The School crag', route: 'Scholar V4', routeEn: 'Scholar V4', note: '河床岩質與落地', noteEn: 'riverbed rock and landings', length: '1:07', channel: '산왕의 볼더 라이브러리' },
      { id: '4D0v1K6Eufc', title: 'All pain no gain - V8, The School crag', route: 'All pain no gain V8', routeEn: 'All pain no gain V8', note: '同岩區高難度，看保護怎麼擺', noteEn: 'the crag at a harder grade; watch the spotting', length: '1:26', channel: '산왕의 볼더 라이브러리' },
      { id: 'CQet2wK4Txo', title: '[어프로치 가이드] 제주도 무수천 볼더링 어프로치 완전 정복', route: '無水川抱石區接近', routeEn: 'Musucheon bouldering approach', note: '接近路線與入溪點', noteEn: 'approach and stream entry', length: '7:16', channel: 'Kyu Blocs' },
    ],
  },

  jeokbyeok: {
    videos: [
      { id: 'H7Z0gq-hvRw', title: '암벽등반 설악산 적벽 독주길', route: 'Solo 독주길 5.8/A1', routeEn: 'Solo / 독주길 5.8/A1', note: '岩壁短紀錄', noteEn: 'short record', length: '1:54', channel: '벽이벽' },
      { id: 'Yk51VA16DZU', title: '설악산 적벽 에코독주 (5.13-) 자유등반', route: 'Echo 에코길 5.11c/A2', routeEn: 'Echo / 에코길 5.11c/A2', note: '自由攀登版 5.13-；僅外部連結', noteEn: 'free ascent at 5.13-; link only', length: '14:41', channel: 'Super Purple Crack', embed: false },
    ],
  },

  munsusan: {
    videos: [
      { id: '4cFldfuBA0o', title: '울산 문수산 문수암 병풍바위에서의 클라이밍', route: '문수암 岩場', routeEn: '문수암 area', note: '岩場與岩質', noteEn: 'the crag and the rock', length: '6:58', channel: '룰루랄락' },
    ],
  },

  musucheon: {
    videos: [
      { id: 'jp_nbl4acu0', title: '혁명(5.12b)_무수천암장', route: 'Revolution 혁명 5.12b', routeEn: 'Revolution / 혁명 5.12b', note: '單線紀錄', noteEn: 'single-line record', length: '2:34', channel: '지리산역사문화조사단' },
      { id: 'T1W7J2ZQ0VM', title: '제주도 무수천 암장', route: '北區岩場', routeEn: 'North sector', note: '溪谷與入口', noteEn: 'the creek and the entrance', length: '8:47', channel: '깨비깨비 공작소' },
    ],
  },

  seonunsan: {
    videos: [
      { id: 'tQEQ13l0Koo', title: '선운산 속살바위 새내기 5.11b', route: 'Freshman 새내기 5.11b', routeEn: 'Freshman / 새내기 5.11b', note: '속살바위', noteEn: 'Soksal', length: '7:05', channel: 'Iron LEE' },
      { id: 'FS_fGHeRsxA', title: '선운산 새내기(5.11b)', route: 'Freshman 새내기 5.11b', routeEn: 'Freshman / 새내기 5.11b', note: '另一視角', noteEn: 'another take', length: '6:54', channel: '포린락 등반읽기' },
    ],
  },

  ulsanbawi: {
    videos: [
      { id: 'lFYl33fn8y8', title: "설악산 울산바위 '사선크랙 1~2피치' IRC", route: 'Sasun Crack 사선크랙 5.10a', routeEn: 'Sasun Crack / 사선크랙 5.10a', note: '1–2 段', noteEn: 'pitches 1–2', length: '28:39', channel: '유성Climb TV' },
      { id: 'Ymsf-g49BPA', title: "설악산 울산바위 '사선크랙 3피치' IRC", route: 'Sasun Crack 사선크랙 5.10a', routeEn: 'Sasun Crack / 사선크랙 5.10a', note: '3 段完整', noteEn: 'pitch 3, full', length: '57:48', channel: '유성Climb TV' },
    ],
  },

  yuseondae: {
    videos: [
      { id: 'Bf44DNoo8vc', title: '■경동클라이밍■ 선등시점 - 설악산 유선대, 그리움 둘 -무편집', route: 'Longing for Two 그리움 둘 5.8', routeEn: 'Longing for Two / 그리움 둘 5.8', note: '50 分鐘先鋒視角，未剪輯', noteEn: '50 minutes of lead POV, unedited', length: '50:26', channel: '맥클라이밍' },
      { id: 'yb4um5Nfwok', title: '설악산 유선대 그리움 둘 등반', route: 'Longing for Two 그리움 둘 5.8', routeEn: 'Longing for Two / 그리움 둘 5.8', note: '8 分鐘版本', noteEn: 'eight-minute version', length: '8:47', channel: '벽이벽' },
      { id: 'coog9peSOQA', title: '설악산 유선대 그리움 둘 릿지', route: 'Longing for Two 그리움 둘 5.8', routeEn: 'Longing for Two / 그리움 둘 5.8', note: '整段稜線；僅外部連結', noteEn: 'the whole ridge; link only', length: '26:31', channel: '산이랑', embed: false },
      { id: 'lnM21iYd4QU', title: '설악산 유선대 "이륙공천" 1P 5.10a', route: '同一岩壁其他線', routeEn: 'other lines on the buttress', note: '岩壁線 5.10a', noteEn: 'a 5.10a wall pitch', length: '13:09', channel: '유성Climb TV' },
    ],
  },

  // Malaysia crags series. Every id, title, channel and runtime below was
  // re-checked against the YouTube oEmbed endpoint and the watch page on
  // 2026-10-21; grades are the theCrag French grades.
  'bukit-keteri': {
    videos: [
      { id: 'PAExKArHBBU', title: 'MALAYSIA CLIMBING | Bukit Keteri', route: '岩場導覽', routeEn: 'crag overview', note: '玻璃市岩場與攀登', noteEn: 'the crag and the climbing', length: '6:47', channel: 'Nico Corradi' },
      { id: 'HZzd4dE2XMo', title: 'POV: Dust in the Wind 6b | Rock Climbing Bukit Keteri, Perlis', route: 'Dust in the Wind 6b', routeEn: 'Dust in the Wind 6b', note: 'West 區的第一視角', noteEn: 'a first-person look at the West sector', length: '10:07', channel: 'Jack Wong' },
      { id: 'zpVuAbt3wkw', title: 'Nettie sending “Zamboney” 7B+ (5.12c) in Perlis, Malaysia', route: 'Zamboney 7b+', routeEn: 'Zamboney 7b+', note: '完攀 7b+ 的片段', noteEn: 'the 7b+ send', length: '4:26', channel: 'The Climbing Backpackers' },
      { id: 'X3aALOYtglc', title: 'Belly Button Window, 7c | Bukit Keteri, Perlis', route: 'Belly Button Window 7c', routeEn: 'Belly Button Window 7c', note: 'Belly Button 區的 7c', noteEn: 'a 7c in the Belly Button sector', length: '1:20', channel: 'SITI NURSARA' },
      { id: 'WmfHwJB8mik', title: 'Bukit Keteri Perlis for rock climbing from Kuala Lumpur', route: '從吉隆坡前往', routeEn: 'getting there from KL', note: '交通與行程', noteEn: 'transport and the trip', length: '3:48', channel: 'HOBO CLIMBS' },
      { id: '5OGktf5lseA', title: 'Bukit Keteri In Perlis Can Be Scaled! Just Looking At It Will Send Chills Down Your Spine.', route: '岩場空拍', routeEn: 'aerial view', note: '稻田中的石灰岩壁', noteEn: 'limestone above the paddy fields', length: '18:07', channel: 'Atok vlog YT' },
    ],
  },

  'batu-caves-nyamuk': {
    videos: [
      { id: 'jv8PDYAix9c', title: 'Bada Bing (8b) - Rock Climbing in Malaysia, Nyamuk Wall, Batu Caves, Kuala Lumpur', route: 'Bada Bing 8b', routeEn: 'Bada Bing 8b', note: 'Nyamuk 最高級的線', noteEn: 'the hardest line listed for Nyamuk', length: '8:34', channel: 'Kang Climbing' },
      { id: '4APPxaOauXI', title: 'Chess (7a) - Rock Climbing in Malaysia, Nyamuk Wall, Batu Caves, Kuala Lumpur', route: 'Chess 7a', routeEn: 'Chess 7a', note: 'Shieldtox 區的 7a', noteEn: 'a 7a in the Shieldtox sector', length: '10:03', channel: 'Kang Climbing' },
      { id: 'huOhiFxoma4', title: 'Climbing POV: Bangsar Babe Backdrop (6a+) Nyamuk Wall, Batu Caves, Malaysia', route: 'Bangsar Babes Backdrop 6a+', routeEn: 'Bangsar Babes Backdrop 6a+', note: '第一視角攀登', noteEn: 'a first-person climb', length: '6:46', channel: 'Jack Wong' },
      { id: 'mgnDRQM-MIk', title: "Nyamuk Wall - Love at 1st Bite 5.12c [7b+] Crux beta", route: 'Love at 1st Bite 7b+', routeEn: 'Love at 1st Bite 7b+', note: '關鍵動作 beta', noteEn: 'the crux beta', length: '1:24', channel: 'ClimberDavT' },
      { id: 'jv6-lUpH_O0', title: 'EP 3 - Climbing at Nyamuk Wall | Batu Caves', route: '岩場紀錄', routeEn: 'crag session', note: '整段岩場紀錄', noteEn: 'a full session', length: '3:09', channel: 'Outside TV Channel' },
    ],
  },

  'batu-caves-damai': {
    videos: [
      { id: 'Mzja4le8htk', title: 'Climbing at Batu Caves, Damai Wall', route: 'Damai Wall', routeEn: 'Damai Wall', note: '2008 年的岩場紀錄', noteEn: 'a 2008 session', length: '6:10', channel: 'sportsclimbingkakis' },
      { id: 'tTwwURUjzi4', title: 'Rock Climbing at Batu Caves Damai', route: 'Damai Wall', routeEn: 'Damai Wall', note: '主牆攀登', noteEn: 'on the main wall', length: '8:32', channel: 'Vivian Goi' },
      { id: 'f0E086pBRBY', title: 'GoPro | Climbing Batu Caves Damai Wall', route: 'Damai Wall', routeEn: 'Damai Wall', note: '第一視角', noteEn: 'first-person footage', length: '11:50', channel: 'Ryan Chua' },
      { id: 'EGjjaUTaL0U', title: 'Sport climbing at Batu Caves Damai Wall - May 2019', route: 'Damai Wall', routeEn: 'Damai Wall', note: '2019 年的攀登', noteEn: 'a 2019 outing', length: '2:40', channel: 'Singapore Sends' },
      { id: 'kKCcdSrLg3g', title: 'OUTDOOR ACTIVITIES IN MALAYSIA - Rock climbing Gua Damai Extreme Park Batu Caves Kuala Lumpur', route: '園區與動線', routeEn: 'the park', note: '園區設施與動線', noteEn: 'facilities and the approach', length: '7:21', channel: 'YOKL' },
      { id: 'TJyl3yvherU', title: 'Rock Climbing - Damai Wall, Batu Caves', route: 'Damai Wall', routeEn: 'Damai Wall', note: '短線紀錄', noteEn: 'a short clip', length: '1:04', channel: 'Andy Saiden' },
    ],
  },

  'batu-caves-other-walls': {
    videos: [
      { id: 'V1jOUH8Pn90', title: 'Matrix (7a) - Rock Climbing in Malaysia, Nanyang Wall, Batu Caves, Kuala Lumpur', route: 'Matrix 7a（Nanyang）', routeEn: 'Matrix 7a (Nanyang)', note: 'Nanyang 的 7a', noteEn: 'a 7a at Nanyang', length: '9:56', channel: 'Kang Climbing' },
      { id: 'QhVu1TjeEgA', title: 'Lost Monkey (6c) - Rock Climbing in Malaysia, Kuala Lumpur, Batu Caves, Nanyang Wall', route: 'Lost Monkey 6c（Nanyang）', routeEn: 'Lost Monkey 6c (Nanyang)', note: 'Nanyang 的 6c', noteEn: 'a 6c at Nanyang', length: '5:18', channel: 'Kang Climbing' },
      { id: 'cXyqd61DD74', title: 'Hard project lines at Batu caves, Malaysia', route: '黑風洞各壁', routeEn: 'several Batu Caves walls', note: '不同岩壁的難線', noteEn: 'hard lines across the walls', length: '3:52', channel: 'The Climbing Backpackers' },
      { id: 'cgWm4kXx6jY', title: 'Rock Climbing Gua Damai - Near Batu Caves', route: 'Gua Damai 園區', routeEn: 'Gua Damai park', note: '園區裡的攀登', noteEn: 'climbing inside the park', length: '2:28', channel: 'Adha Studios' },
    ],
  },

  'tioman-dragons-horns': {
    videos: [
      { id: '0Ihcsn74jms', title: "Naga (6b/+) - Dragon's Horns, Tioman - Malaysia Rock Climbing", route: 'Naga 6b+', routeEn: 'Naga 6b+', note: '南塔完整攀登', noteEn: 'the full South Tower route', length: '88:59', channel: 'Kang Climbing' },
      { id: 'x6pg_SJhIfo', title: "Polish Princess (7b+) - Dragons Horns, Tioman - Malaysia Rock Climbing", route: 'Polish Princess 7b+', routeEn: 'Polish Princess 7b+', note: '岩場最難的線之一', noteEn: 'one of the hardest lines here', length: '94:03', channel: 'Kang Climbing' },
      { id: '9C47iG75AGs', title: "Climbing the Dragons Horns on Tioman in Malaysia", route: 'Dragon Horns 岩壁', routeEn: 'the Dragon Horns wall', note: '大牆與地形', noteEn: 'the big wall and the terrain', length: '24:31', channel: 'Kang Climbing' },
      { id: 'FVpQ7PZ5w8E', title: 'Naga, Dragon Horns - Tioman Climbing Trip 2023', route: 'Naga 6b+', routeEn: 'Naga 6b+', note: '另一支完整的 Naga', noteEn: 'another full ascent of Naga', length: '5:57', channel: 'Sng Shao Hao' },
      { id: 'xc4-ggN2b04', title: "ROCK CLIMBING the DRAGON'S HORNS, TIOMAN ISLAND, Malaysia", route: 'Dragon Horns 岩壁', routeEn: 'the Dragon Horns wall', note: '岩壁與繩隊', noteEn: 'wall and rope team', length: '35:39', channel: 'Monster Climber' },
      { id: 'r8PC1XSbxB0', title: "Climbing the Dragon Horns, Tioman Island, Malaysia - 2015", route: 'Dragon Horns 岩壁', routeEn: 'the Dragon Horns wall', note: '2015 年的攀爬', noteEn: 'a 2015 trip', length: '8:16', channel: "Grant 'Axe' Rawlinson" },
      { id: 'wSG0RINsFow', title: 'Most dangerous in Malaysia, 700 meter hiking - Dragon Horns, Tioman', route: '叢林接近', routeEn: 'the jungle approach', note: '登島後的接近', noteEn: 'the approach after landing', length: '12:41', channel: 'WonHoHo' },
    ],
  },

  'fairy-caves': {
    videos: [
      { id: 'RIB81rPScHQ', title: 'Kuching Rock Climbing【Fairy Cave】仙洞攀岩【古晋】', route: 'Fairy Caves 岩場', routeEn: 'the Fairy Caves crag', note: '古晉的岩場', noteEn: 'the crag near Kuching', length: '5:15', channel: 'Be MyBest Jessica' },
      { id: 'lJuH3V2mRvo', title: 'Show pony 7C+, Fairy Cave, Kuching, Malaysia', route: 'Show Pony 7c+', routeEn: 'Show Pony 7c+', note: '洞穴岩壁的 7c+', noteEn: 'a 7c+ on the cave wall', length: '3:13', channel: 'LW-Ricarido' },
      { id: '0hDtMaQjtTQ', title: 'Outdoor Climbing Batman Wall Fairy Cave 20250607 Top View', route: 'Batman Wall', routeEn: 'Batman Wall', note: '本地社團維護的牆', noteEn: 'the wall the local group maintains', length: '1:42', channel: 'C Hamzah' },
      { id: '2j0pccR5I-c', title: 'Fairy Cave Rock Climbing. My first trial', route: 'Fairy Caves 岩場', routeEn: 'the Fairy Caves crag', note: '第一次嘗試', noteEn: 'a first attempt', length: '14:02', channel: 'Patrick Howel' },
      { id: 'qI2-WxaXNFE', title: 'Outdoor Rock Climbing at Fairy Caves, Kuching', route: 'Fairy Caves 岩場', routeEn: 'the Fairy Caves crag', note: '戶外攀登紀錄', noteEn: 'an outdoor session', length: '5:49', channel: 'Alan Lee' },
    ],
  },

  // Japan crags series. Ids, titles, channels and runtimes were re-checked
  // against each YouTube watch page on 2026-10-23. Compilation clips appear
  // once per route they cover, so the route tables omit `ids`.
  joyama: {
    videos: [
      { id: 'GyP1ZEdZXGU', title: '終わらない初日トレ「ホームボーイ&アミーゴス」城山 南壁｜伊豆大仁 外岩合宿 04 [ ALPINE CLUB TOKYO 公式チャンネル ]', route: 'Homeboy 5.8（南壁）', routeEn: 'Homeboy 5.8 (south face)', note: '和アミーゴス同一集；看得到取付點的擁擠程度', noteEn: 'same episode as Amigos; shows how crowded the base gets', length: '18:19', channel: 'ALPINE CLUB TOKYO' },
      { id: 'GyP1ZEdZXGU', title: '終わらない初日トレ「ホームボーイ&アミーゴス」城山 南壁｜伊豆大仁 外岩合宿 04 [ ALPINE CLUB TOKYO 公式チャンネル ]', route: 'アミーゴス 5.9（南壁）', routeEn: 'アミーゴス 5.9 (south face)', note: '和 Homeboy 同一集的熱身日', noteEn: 'the same warm-up day as Homeboy', length: '18:19', channel: 'ALPINE CLUB TOKYO' },
      { id: 'epctb8lTIeg', title: '20250201 城山南壁', route: 'とんとん拍子 5.8（南壁）', routeEn: 'とんとん拍子 5.8 (south face)', note: '南壁一日多條的早回し合輯，影片有目錄', noteEn: 'a sped-up South Face day covering several routes; chapters in the video', length: '55:49', channel: 'mikko KURATA' },
      { id: 'epctb8lTIeg', title: '20250201 城山南壁', route: 'ブルースカイ 5.9（南壁）', routeEn: 'ブルースカイ 5.9 (south face)', note: '南壁一日多條的早回し合輯，影片有目錄', noteEn: 'a sped-up South Face day covering several routes; chapters in the video', length: '55:49', channel: 'mikko KURATA' },
      { id: 'CHGc1WDHXPk', title: '断崖絶壁に大ハングを超えていくマルチピッチ【伊豆城山バトルランナー】', route: 'Battlerunner 5.10a（南壁）', routeEn: 'Battlerunner 5.10a (south face)', note: '多段全程，含第 2 段翻屋簷', noteEn: 'the full multi-pitch, including the pitch-2 roof', length: '23:28', channel: '相棒と見る世界' },
      { id: 'FaWKyCjie7U', title: '城山エクスカーション・バトルランナー クライミング ドローン空撮', route: 'Battlerunner 5.10a（南壁）', routeEn: 'Battlerunner 5.10a (south face)', note: '空拍，和 Excursion 同一支', noteEn: 'drone footage, shared with Excursion', length: '5:10', channel: '湯川高之' },
      { id: 'fq_UnZmYw_M', title: '20250104 城山南壁', route: 'ジプシーマリー 5.10a（南壁）', routeEn: 'ジプシーマリー 5.10a (south face)', note: '南壁一日多條的早回し合輯，影片有目錄', noteEn: 'a sped-up South Face day covering several routes; chapters in the video', length: '57:09', channel: 'mikko KURATA' },
      { id: 'epctb8lTIeg', title: '20250201 城山南壁', route: 'ジプシーマリー 5.10a（南壁）', routeEn: 'ジプシーマリー 5.10a (south face)', note: '南壁一日多條的早回し合輯，影片有目錄', noteEn: 'a sped-up South Face day covering several routes; chapters in the video', length: '55:49', channel: 'mikko KURATA' },
      { id: '8_ooJR_LEb8', title: '20250309 城山南壁（プリクリ練習含む）', route: 'ジプシーマリー 5.10a（南壁）', routeEn: 'ジプシーマリー 5.10a (south face)', note: '南壁一日多條的早回し合輯，影片有目錄；含預爬練習', noteEn: 'a sped-up South Face day covering several routes; chapters in the video; includes pre-clip practice', length: '63:39', channel: 'mikko KURATA' },
      { id: 'ezRq4wztNRw', title: '【未知との遭遇】マルチピッチ　城山　エキスカーション　本番編', route: 'Excursion 5.10c（南壁）', routeEn: 'Excursion 5.10c (south face)', note: '本番編，多段全程', noteEn: 'the actual ascent, all pitches', length: '9:46', channel: 'Kuro_a' },
      { id: 'ggqnz7WEN_M', title: 'マルチピッチクライミング　エキスカーションに挑戦　核心ピッチ練習編', route: 'Excursion 5.10c（南壁）', routeEn: 'Excursion 5.10c (south face)', note: '只練核心段', noteEn: 'crux-pitch practice only', length: '8:56', channel: 'Kuro_a' },
      { id: 'unVr1Ekq4co', title: '2020年12月27日　城山 エクスカーション', route: 'Excursion 5.10c（南壁）', routeEn: 'Excursion 5.10c (south face)', note: '2020 年 12 月的短片', noteEn: 'a short clip from December 2020', length: '2:16', channel: 'Jinok Park' },
      { id: 'FaWKyCjie7U', title: '城山エクスカーション・バトルランナー クライミング ドローン空撮', route: 'Excursion 5.10c（南壁）', routeEn: 'Excursion 5.10c (south face)', note: '空拍，看得到整面南壁的規模', noteEn: 'drone footage showing the scale of the South Face', length: '5:10', channel: '湯川高之' },
      { id: 'fq_UnZmYw_M', title: '20250104 城山南壁', route: 'ロング・グットバイ 5.10b（南壁）', routeEn: 'ロング・グットバイ 5.10b (south face)', note: '南壁一日多條的早回し合輯，影片有目錄；片中寫作ロンググッドバイ', noteEn: 'a sped-up South Face day covering several routes; chapters in the video; listed as ロンググッドバイ', length: '57:09', channel: 'mikko KURATA' },
      { id: 'epctb8lTIeg', title: '20250201 城山南壁', route: 'ロング・グットバイ 5.10b（南壁）', routeEn: 'ロング・グットバイ 5.10b (south face)', note: '南壁一日多條的早回し合輯，影片有目錄；片中寫作ロンググッドバイ', noteEn: 'a sped-up South Face day covering several routes; chapters in the video; listed as ロンググッドバイ', length: '55:49', channel: 'mikko KURATA' },
      { id: '8_ooJR_LEb8', title: '20250309 城山南壁（プリクリ練習含む）', route: 'ロング・グットバイ 5.10b（南壁）', routeEn: 'ロング・グットバイ 5.10b (south face)', note: '南壁一日多條的早回し合輯，影片有目錄；片中寫作ロンググッドバイ', noteEn: 'a sped-up South Face day covering several routes; chapters in the video; listed as ロンググッドバイ', length: '63:39', channel: 'mikko KURATA' },
      { id: 'fq_UnZmYw_M', title: '20250104 城山南壁', route: 'タナバタのタナボタ 5.10c（南壁）', routeEn: 'タナバタのタナボタ 5.10c (south face)', note: '南壁一日多條的早回し合輯，影片有目錄', noteEn: 'a sped-up South Face day covering several routes; chapters in the video', length: '57:09', channel: 'mikko KURATA' },
      { id: 'epctb8lTIeg', title: '20250201 城山南壁', route: 'タナバタのタナボタ 5.10c（南壁）', routeEn: 'タナバタのタナボタ 5.10c (south face)', note: '南壁一日多條的早回し合輯，影片有目錄', noteEn: 'a sped-up South Face day covering several routes; chapters in the video', length: '55:49', channel: 'mikko KURATA' },
      { id: '8_ooJR_LEb8', title: '20250309 城山南壁（プリクリ練習含む）', route: 'タナバタのタナボタ 5.10c（南壁）', routeEn: 'タナバタのタナボタ 5.10c (south face)', note: '南壁一日多條的早回し合輯，影片有目錄', noteEn: 'a sped-up South Face day covering several routes; chapters in the video', length: '63:39', channel: 'mikko KURATA' },
      { id: 'epctb8lTIeg', title: '20250201 城山南壁', route: '仰げば尊し 5.10d（南壁）', routeEn: '仰げば尊し 5.10d (south face)', note: '南壁一日多條的早回し合輯，影片有目錄', noteEn: 'a sped-up South Face day covering several routes; chapters in the video', length: '55:49', channel: 'mikko KURATA' },
      { id: 'IBbIss6dDlI', title: '腰が痛い。(伊豆城山南壁5.11aハートルート)', route: 'Heart Route 5.11a（南壁）', routeEn: 'Heart Route 5.11a (south face)', note: '影片標 5.11a', noteEn: 'labelled 5.11a', length: '14:11', channel: '相棒と見る世界' },
      { id: 'k4KniycxIXs', title: 'ハートルート（5.10d）／城山', route: 'Heart Route 5.11a（南壁）', routeEn: 'Heart Route 5.11a (south face)', note: '影片標 5.10d，比表格低一級', noteEn: 'labelled 5.10d, a grade below the table', length: '3:15', channel: 'machomomo' },
      { id: 'fq_UnZmYw_M', title: '20250104 城山南壁', route: 'Heart Route 5.11a（南壁）', routeEn: 'Heart Route 5.11a (south face)', note: '南壁一日多條的早回し合輯，影片有目錄', noteEn: 'a sped-up South Face day covering several routes; chapters in the video', length: '57:09', channel: 'mikko KURATA' },
      { id: 'lAYwxEE6Qhw', title: '【フリークライミング】ジゴロ5.11b/c(伊豆城山　ワイルドボアコージ)', route: 'Gigolo 5.11c（ワイルドボアゴージ）', routeEn: 'Gigolo 5.11c (Wild Boar Gorge)', note: '影片標 5.11b/c', noteEn: 'labelled 5.11b/c', length: '13:33', channel: '相棒と見る世界' },
      { id: 'm-HQke_GZfI', title: '2022/04/11 城山 ジゴロ5.11b/c 健mOS', route: 'Gigolo 5.11c（ワイルドボアゴージ）', routeEn: 'Gigolo 5.11c (Wild Boar Gorge)', note: '標題寫 onsight，影片標 5.11b/c', noteEn: 'the title says onsight; labelled 5.11b/c', length: '15:09', channel: 'SEKI' },
      { id: 'uqNGls6qaag', title: '城山　ワイルドボア　ジャンバラヤ　11c　クライマーマーシー', route: 'Jambalaya 5.11c（ワイルドボアゴージ）', routeEn: 'Jambalaya 5.11c (Wild Boar Gorge)', note: '攀登紀錄', noteEn: 'ascent footage', length: '8:09', channel: 'eworks01' },
      { id: '0bsLImuM1lg', title: '城山 クライミング　ミウラー11a', route: 'Miurā 5.11a（チューブロック）', routeEn: 'Miurā 5.11a (Tube Rock)', note: '攀登紀錄', noteEn: 'ascent footage', length: '5:36', channel: 'eworks01' },
      { id: 'bZy31j9vj-c', title: '城山 クライミング オーバードライブ 5.11d (女性154cm)', route: 'Overdrive 5.11d（ワイルドボアゴージ）', routeEn: 'Overdrive 5.11d (Wild Boar Gorge)', note: '154 公分女性的攀登，看得到矮個子的解法', noteEn: 'a 154 cm climber, useful for shorter-reach beta', length: '6:53', channel: 'Yu Tomio' },
      { id: 'hzKlKlXbnE0', title: 'OVER DRIVE 11d RP 伊豆城山', route: 'Overdrive 5.11d（ワイルドボアゴージ）', routeEn: 'Overdrive 5.11d (Wild Boar Gorge)', note: '紅點完攀', noteEn: 'redpoint ascent', length: '10:27', channel: 'Tetsuro Nagaoka' },
      { id: 'RxHYJOX5HwQ', title: '城山オーバードライブ（11d）RP', route: 'Overdrive 5.11d（ワイルドボアゴージ）', routeEn: 'Overdrive 5.11d (Wild Boar Gorge)', note: '紅點完攀', noteEn: 'redpoint ascent', length: '9:48', channel: 'taku540140' },
      { id: 'UPSeTx_XjiQ', title: '【フリークライミング】OVER DRIVE 5.11d（伊豆城山　ワイルドボアコージ）', route: 'Overdrive 5.11d（ワイルドボアゴージ）', routeEn: 'Overdrive 5.11d (Wild Boar Gorge)', note: '攀登與講解', noteEn: 'ascent with commentary', length: '15:09', channel: '相棒と見る世界' },
      { id: '012TuyLiYik', title: 'OVERDRIVE@城山 ワイルドボア (5.11d)', route: 'Overdrive 5.11d（ワイルドボアゴージ）', routeEn: 'Overdrive 5.11d (Wild Boar Gorge)', note: '攀登紀錄', noteEn: 'ascent footage', length: '6:16', channel: 'Couzy Nakamura' },
      { id: 'OdBGE0PWQPM', title: '2022/04/11 城山 オーバードライブ5.11d 健', route: 'Overdrive 5.11d（ワイルドボアゴージ）', routeEn: 'Overdrive 5.11d (Wild Boar Gorge)', note: '攀登紀錄', noteEn: 'ascent footage', length: '7:28', channel: 'SEKI' },
      { id: 'mg5MLPmZjvs', title: 'おっさん達と若者の叫び｜城山 南壁｜伊豆大仁 外岩合宿 01 [ ALPINE CLUB TOKYO 公式チャンネル ]', route: '南壁概要', routeEn: 'Minami kabe', note: '開頭約 5 分半是城山概要與攀登感想', noteEn: 'the first five and a half minutes cover the crag and first impressions', length: '29:11', channel: 'ALPINE CLUB TOKYO' },
      { id: 'GLMZtR-dFak', title: 'リードで登れるまで帰れません 城山 クッキングワールド｜伊豆大仁 外岩合宿 05 [ ALPINE CLUB TOKYO 公式チャンネル ]', route: 'クッキングワールド 區', routeEn: 'Cooking World', note: '先鋒練習，看得到這區的岩質與路線密度', noteEn: 'lead practice; shows the rock and route density in this sector', length: '38:47', channel: 'ALPINE CLUB TOKYO' },
      { id: 'ETrwK3RhBN0', title: '伊豆　城山・西南カンテ マルチピッチクライミング 2023/12/3', route: 'Seinan Kante 5.9（南壁）', routeEn: 'Seinan Kante 5.9 (south face)', note: '多段全程；第 1 段常接 Homeboy', noteEn: 'the full multi-pitch; often started via Homeboy', length: '31:36', channel: 'べーきゃんA' },
      { id: 'hQX6qMxUlGc', title: '城山・西南カンテ', route: 'Seinan Kante 5.9（南壁）', routeEn: 'Seinan Kante 5.9 (south face)', note: '攀登紀錄', noteEn: 'ascent footage', length: '12:52', channel: 'そして、幼少期。' },
      { id: 'C2OkVu5jGmE', title: '伊豆　城山東壁　スタートレック（5.8）沢靴ソロ登攀　マルチピッチクライミング', route: 'スタートレック 5.8（東壁）', routeEn: 'スタートレック 5.8 (East Face)', note: '穿溪降鞋獨攀，不是一般繩隊的示範', noteEn: 'a rope-solo in canyoning shoes, not a model for a normal team', length: '40:00', channel: 'そして、幼少期。' },
      { id: 'f2HYExPQwUo', title: '城山西南カンテ', route: 'Seinan Kante 5.9（南壁）', routeEn: 'Seinan Kante 5.9 (south face)', note: '攀登短片', noteEn: 'a short ascent clip', length: '5:41', channel: 'hiro YoidoreYamaOyaji' },
    ],
  },
};
