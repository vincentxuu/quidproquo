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
      // Added 2026-10-24: metadata, author descriptions and full-timeline sampled frames checked; not continuous full-video viewing.
      { id: "zCYhFu-EqjI", title: "城山「スタートレック」/マルチピッチクライミング", route: "スタートレック 5.8（東壁）", routeEn: "スタートレック 5.8 (East Face)", note: "接近與分段攀登章節；片中切段方式與表格來源不同", noteEn: "approach and pitch chapters; the video divides the pitches differently from the table sources", length: "11:39", channel: "Okaji Movie" },
      { id: "l68_-amCZl4", title: "伊豆・城山のマルチピッチクライミングルート『スター☆トレック 』（5p/5.8）をご紹介！", route: "スタートレック 5.8（東壁）", routeEn: "スタートレック 5.8 (East Face)", note: "路線介紹與帶繩獨攀紀錄；片名標 5 段", noteEn: "route introduction and rope-solo record; the title gives five pitches", length: "17:37", channel: "TAKEMOVIE（タケムービー）" },
      { id: "DBOMvwRa0Us", title: "【リードクライミング】 伊豆　城山　チューブロック　ミウラー 11a 完登動画", route: "Miurā 5.11a（チューブロック）", routeEn: "Miurā 5.11a (Tube Rock)", note: "作者標為完攀並註明預掛保護；固定機位攀登紀錄", noteEn: "author-labelled completed ascent with pre-clipping; fixed-camera climbing footage", length: "8:29", channel: "tatsuo555-560" },
      { id: "sF3qQbuP8xc", title: "ストーンフリー@城山チューブロック (5.10c)", route: "Stone Free 5.10c（チューブロック）", routeEn: "Stone Free 5.10c (Tube Rock)", note: "固定機位涵蓋下部到上部；作者提到頂段左右出口的選擇", noteEn: "fixed-camera view from the lower to the upper section; the author mentions a choice of exits at the top", length: "5:46", channel: "Couzy Nakamura" },
      { id: "3BfuLotNB2I", title: "城山 チューブロック【チャンディーラサ】5.11a", route: "Chandīrasa 5.11a（チューブロック）", routeEn: "Chandīrasa 5.11a (Tube Rock)", note: "影片標 5.11a 的攀登紀錄", noteEn: "ascent footage labelled 5.11a in the title", length: "9:19", channel: "2nd_723" },
      { id: "lFbxN3meUNo", title: "【ジャンバラヤ 5.11c】城山  166㎝ クライミング climbing joyama Japan", route: "Jambalaya 5.11c（ワイルドボアゴージ）", routeEn: "Jambalaya 5.11c (Wild Boar Gorge)", note: "作者描述為再登，並與ジゴロ比較", noteEn: "the author describes a repeat ascent and compares it with Gigolo", length: "8:55", channel: "Galapagos-Climber" },
      { id: "CV3NdlACOG8", title: "城山 リキッドフィンガー 5.13d, Liquid Finger 8b, Jyoyama", route: "Liquid Finger 5.13d（ワイルドボアゴージ）", routeEn: "Liquid Finger 5.13d (Wild Boar Gorge)", note: "影片標 5.13d／8b 的攀登紀錄", noteEn: "ascent footage labelled 5.13d / 8b", length: "4:09", channel: "のぼコン太田裕樹" },
      { id: "lhtDrrCgTm8", title: "2018年3月12日城山　「ロジカルプログレッション」5.14b/c", route: "Logical Progression 5.14b/c（ワイルドボアゴージ）", routeEn: "Logical Progression 5.14b/c (Wild Boar Gorge)", note: "固定遠景，中段保留較長休息；上段攀登者爬出鏡頭", noteEn: "fixed distant view with an extended mid-route rest; the climber moves out of frame on the upper section", length: "7:02", channel: "shu2rock" },
      { id: "oE6hekYgVJw", title: "城山「スチームボーイ」/マルチピッチクライミング", route: "STEAM BOY 5.11b（東南壁）", routeEn: "STEAM BOY 5.11b (Southeast Face)", note: "含接近與分段章節，也有上升器輔助登繩；不是全程自由攀登示範，仍須搭配正式 topo", noteEn: "approach and pitch chapters include ascender-assisted rope climbing; not an all-free ascent demonstration or a substitute for a topo", length: "16:59", channel: "Okaji Movie" },
      { id: "O0CvQcPrR2g", title: "20260213 城山東壁 ブレードランナー 6p,5 10c（下見）＋マッドマックス5-6P（再登）", route: "ブレードランナー 5.10c（東南壁）", routeEn: "ブレードランナー 5.10c (Southeast Face)", note: "作者目錄列 6 段，表格來源列 5 段；後段接マッドマックス第 5、6 段", noteEn: "the author lists six pitches against five in the table source; the outing then links into Mad Max pitches 5 and 6", length: "7:40", channel: "mikko KURATA" },
      { id: "O0CvQcPrR2g", title: "20260213 城山東壁 ブレードランナー 6p,5 10c（下見）＋マッドマックス5-6P（再登）", route: "マッドマックス 5.10b（東南壁）", routeEn: "マッドマックス 5.10b (Southeast Face)", note: "只涵蓋本線第 5、6 段；前段是ブレードランナー", noteEn: "covers only Mad Max pitches 5 and 6; the earlier footage is Blade Runner", length: "7:40", channel: "mikko KURATA" },
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

  jogasaki: {
    videos: [
      { id: 'jKc3VC4tZls', title: '20230303　城ケ崎フナムシロック', route: '初孫 5.5（フナムシ・ロック）', routeEn: 'Hatsumago 5.5 (Funamushi Rock)', note: '2023-03-03 一天 6 條的合輯（初孫、鬼ごろし、オバステ正宗、純、パープルシャドウ、メルトダウン）', noteEn: 'a 2023-03-03 day of six routes (Hatsumago, Oni Goroshi, Obasute Masamune, Jun, Purple Shadow, Meltdown)', length: '58:47', channel: 'mikko KURATA' },
      { id: 'lO9A1GAiLiM', title: '城ヶ崎 フナムシ・ロック 鬼ごろし 5.7', route: '鬼ごろし 5.7（フナムシ・ロック）', routeEn: 'Oni Goroshi 5.7 (Funamushi Rock)', note: '2025-08 OS；說明欄寫核心是上平台後的左手反手塞，附 cam 清單', noteEn: 'onsight in August 2025; the description puts the crux at a left-hand reverse jam after the ledge and lists the cams', length: '6:52', channel: '5Gクライミング' },
      { id: 'jKc3VC4tZls', title: '20230303　城ケ崎フナムシロック', route: '鬼ごろし 5.7（フナムシ・ロック）', routeEn: 'Oni Goroshi 5.7 (Funamushi Rock)', note: '2023-03-03 一天 6 條的合輯', noteEn: 'a 2023-03-03 day of six routes', length: '58:47', channel: 'mikko KURATA' },
      { id: 'Cbpdb5Zu8-g', title: '純 5.8｜城ヶ崎 フナムシ・ロック 北の岩南面｜フリークライミング [ ALPINE CLUB TOKYO 公式チャンネル ]', route: '純 5.8（フナムシ・ロック）', routeEn: 'Jun 5.8 (Funamushi Rock)', note: '山岳會第一次來城ヶ崎', noteEn: 'a club\'s first Jogasaki trip', length: '5:49', channel: 'ALPINE CLUB TOKYO' },
      { id: 'jKc3VC4tZls', title: '20230303　城ケ崎フナムシロック', route: '純 5.8（フナムシ・ロック）', routeEn: 'Jun 5.8 (Funamushi Rock)', note: '2023-03-03 一天 6 條的合輯', noteEn: 'a 2023-03-03 day of six routes', length: '58:47', channel: 'mikko KURATA' },
      { id: 'N48zGxbAKOc', title: 'パープルシャドウ 5.8｜城ヶ崎 フナムシ・ロック 南の岩東面｜フリークライミング [ ALPINE CLUB TOKYO 公式チャンネル ]', route: 'パープルシャドウ 5.8（フナムシ・ロック）', routeEn: 'Purple Shadow 5.8 (Funamushi Rock)', note: '標題寫南の岩東面、說明欄寫北の岩南面，岩面標示不一致', noteEn: 'the title says the east face of the south rock, the description says the south face of the north rock', length: '8:34', channel: 'ALPINE CLUB TOKYO' },
      { id: 'jKc3VC4tZls', title: '20230303　城ケ崎フナムシロック', route: 'パープルシャドウ 5.8（フナムシ・ロック）', routeEn: 'Purple Shadow 5.8 (Funamushi Rock)', note: '2023-03-03 一天 6 條的合輯', noteEn: 'a 2023-03-03 day of six routes', length: '58:47', channel: 'mikko KURATA' },
      { id: 'u30nIMy2KTs', title: '20251219 ファミリークラックエリア（シーズン初の城ケ崎）', route: 'ベイビークラック 5.8（ファミリークラック）', routeEn: 'Baby Crack 5.8 (Family Crack)', note: '社團一整天的快轉合輯，這條從 00:59 開始', noteEn: 'a sped-up club day; this route starts at 00:59', length: '57:01', channel: 'mikko KURATA' },
      { id: 'u30nIMy2KTs', title: '20251219 ファミリークラックエリア（シーズン初の城ケ崎）', route: 'シスタークラック 5.9（ファミリークラック）', routeEn: 'Sister Crack 5.9 (Family Crack)', note: '社團一整天的快轉合輯，這條從 15:52 開始', noteEn: 'a sped-up club day; this route starts at 15:52', length: '57:01', channel: 'mikko KURATA' },
      { id: 'xfJh9eCCJ0s', title: '城ヶ崎 ファミリークラック アンクルクラック 5.9', route: 'アンクルクラック 5.9（ファミリークラック）', routeEn: 'Uncle Crack 5.9 (Family Crack)', note: '2026-03 RP；說明欄寫核心是屋簷，用腳塞過', noteEn: 'redpoint in March 2026; the description puts the crux at the roof, passed with a foot jam', length: '6:46', channel: '5Gクライミング' },
      { id: '6gaTM_A5v7o', title: 'アンクルクラック 5.9（城ヶ崎 ファミリークラックエリア）', route: 'アンクルクラック 5.9（ファミリークラック）', routeEn: 'Uncle Crack 5.9 (Family Crack)', note: '說明欄寫屋簷裡的裂隙稍窄', noteEn: 'the description says the crack in the roof is a little narrow', length: '5:07', channel: 'めざせ500イレブン+' },
      { id: 'msLYeY7Nvow', title: '城ヶ崎　ファミリー　アンクルクラック　5.9', route: 'アンクルクラック 5.9（ファミリークラック）', routeEn: 'Uncle Crack 5.9 (Family Crack)', note: '說明欄寫核心是翻屋簷後把腳抬進寬裂隙', noteEn: 'the description puts the crux at getting a foot up into the wide crack after the roof', length: '7:28', channel: 'ayakokko' },
      { id: 'u30nIMy2KTs', title: '20251219 ファミリークラックエリア（シーズン初の城ケ崎）', route: 'アンクルクラック 5.9（ファミリークラック）', routeEn: 'Uncle Crack 5.9 (Family Crack)', note: '社團一整天的快轉合輯，這條從 27:09 開始', noteEn: 'a sped-up club day; this route starts at 27:09', length: '57:01', channel: 'mikko KURATA' },
      { id: 'Io7eNp00Pys', title: '城ヶ崎 ファミリークラック サムクラック 5.9', route: 'サムクラック 5.9（ファミリークラック）', routeEn: 'Samu Crack 5.9 (Family Crack)', note: '2026-03 OS；說明欄寫路線偏長', noteEn: 'onsight in March 2026; the description calls it fairly long', length: '9:46', channel: '5Gクライミング' },
      { id: 'u30nIMy2KTs', title: '20251219 ファミリークラックエリア（シーズン初の城ケ崎）', route: 'サムクラック 5.9（ファミリークラック）', routeEn: 'Samu Crack 5.9 (Family Crack)', note: '社團一整天的快轉合輯，這條從 32:54 開始', noteEn: 'a sped-up club day; this route starts at 32:54', length: '57:01', channel: 'mikko KURATA' },
      { id: '7YMtlDqt1CY', title: '城ヶ崎 イントロダクション（5.9）', route: 'イントロダクション 5.9（シーサイド・サンライズ）', routeEn: 'Introduction 5.9 (Seaside Sunrise)', note: '攀登全程', noteEn: 'the full climb', length: '11:37', channel: 'ちくごん -Chikugon Climbing Channel-' },
      { id: 'xkioNWUc88Q', title: '城ケ崎 ファミリークラック 新人クラック 5.10a', route: '新人クラック 5.10a（ファミリークラック）', routeEn: 'Shinjin Crack 5.10a (Family Crack)', note: '2026-03 FL；說明欄寫核心是屋簷', noteEn: 'flash in March 2026; the description puts the crux at the roof', length: '8:58', channel: '5Gクライミング' },
      { id: 'GG3RMS8qeOE', title: '城ケ崎 フナムシ・ロック フラッシュダンス 5.10a', route: 'フラッシュダンス 5.10a（フナムシ・ロック）', routeEn: 'Flash Dance 5.10a (Funamushi Rock)', note: '說明欄寫體感 5.10b～c，橫向裂隙外張，放 cam 要小心', noteEn: 'the description gives a felt grade of 5.10b–c and says the horizontal crack flares, so place cams carefully', length: '10:09', channel: '5Gクライミング' },
      { id: '3ACg6wXaqJs', title: '無名ルーフクラック 5.10a（城ヶ崎 フナムシロック）', route: '無名ルーフクラック 5.10a（フナムシ・ロック）', routeEn: 'Mumei Roof Crack 5.10a (Funamushi Rock)', note: '說明欄寫找不到像 5.10a 的爬法', noteEn: 'the description says the climber could not find 5.10a moves', length: '3:23', channel: 'めざせ500イレブン+' },
      { id: 'DVUTNRvHiF0', title: '城ヶ崎 シーサイド サンセット【海賊フック】5.10b', route: '海賊フック 5.10b（シーサイド・サンセット）', routeEn: 'Captain Hook 5.10b (Seaside Sunset)', note: '2023-01 身高 160 公分的攀登者 flash', noteEn: 'a flash by a 160 cm climber in January 2023', length: '12:15', channel: '2nd_723' },
      { id: 'tIINupjR2J4', title: '城ヶ崎クライミング　シーサイド　海賊フック10b', route: '海賊フック 5.10b（シーサイド・サンセット）', routeEn: 'Captain Hook 5.10b (Seaside Sunset)', note: '2025-11 的攀登', noteEn: 'a November 2025 ascent', length: '10:08', channel: 'nico climbing' },
      { id: 'uABJqjKkSlM', title: '城ヶ崎 気分は最高（5.10c）', route: '気分は最高 5.10c（シーサイド・サンセット）', routeEn: 'I Feel Great 5.10c (Seaside Sunset)', note: '攀登全程', noteEn: 'the full climb', length: '10:17', channel: 'ちくごん -Chikugon Climbing Channel-' },
      { id: 'ik2r92u0DKU', title: '2025/1/3 城ヶ崎 シーサイド 風に吹かれて 5.11a', route: '風に吹かれて 5.11a（シーサイド・サンセット）', routeEn: 'Kaze ni Fukarete 5.11a (Seaside Sunset)', note: '2025-01-03 的攀登；說明欄沒有寫走哪條線', noteEn: 'a 2025-01-03 ascent; the description does not say which line', length: '9:15', channel: 'T. Watanabe' },
      { id: 'ElX2dKrRKzg', title: '城ヶ崎 赤道ルーフ（5.10c-5.11b）', route: '赤道ルーフ 5.10c–5.11b（シーサイド・サンセット）', routeEn: 'Sekido Roof 5.10c–5.11b (Seaside Sunset)', note: '兩段連爬', noteEn: 'both pitches linked', length: '14:48', channel: 'ちくごん -Chikugon Climbing Channel-' },
      { id: 'yXLEpuuG3RA', title: '城ヶ崎 ホワイトクリスマス（5.10c）', route: 'ホワイトクリスマス 5.10c（シーサイド・サンライズ）', routeEn: 'White Christmas 5.10c (Seaside Sunrise)', note: '攀登全程', noteEn: 'the full climb', length: '11:46', channel: 'ちくごん -Chikugon Climbing Channel-' },
      { id: 'r83lHqG4UEg', title: '城ヶ崎 ファミリークラック ファザークラック 5.10b', route: 'ファザー・クラック 5.10b（ファミリークラック）', routeEn: 'Father Crack 5.10b (Family Crack)', note: '2026-03 RP；說明欄寫核心在離開指寬裂隙往右橫渡後的面攀', noteEn: 'redpoint in March 2026; the description puts the crux at the face after traversing right off the finger crack', length: '9:30', channel: '5Gクライミング' },
      { id: 'InP7h6TKYfk', title: 'ファザークラック 5.10b（城ヶ崎 ファミリークラックエリア）', route: 'ファザー・クラック 5.10b（ファミリークラック）', routeEn: 'Father Crack 5.10b (Family Crack)', note: '說明欄提醒裂隙裡凹凸不平，放 cam 要慎重', noteEn: 'the description warns that the crack is uneven inside, so place cams with care', length: '8:12', channel: 'めざせ500イレブン+' },
      { id: 't-FLYToDm8g', title: '城ヶ崎　ファザークラック　5.10c', route: 'ファザー・クラック 5.10b（ファミリークラック）', routeEn: 'Father Crack 5.10b (Family Crack)', note: '影片標 5.10c；聽說核心 cam 容易脫，戴頭盔爬', noteEn: 'labelled 5.10c; the climber wore a helmet after hearing cams pull easily at the crux', length: '7:15', channel: 'iwadanoboru' },
      { id: 'XyYuanElFrI', title: '城ヶ崎ファミリー　ファザー・クラック5.10c（核心ムーブ）', route: 'ファザー・クラック 5.10b（ファミリークラック）', routeEn: 'Father Crack 5.10b (Family Crack)', note: '只拍核心動作，151 公分攀登者；影片標 5.10c', noteEn: 'crux moves only, by a 151 cm climber; labelled 5.10c', length: '1:32', channel: 'Tommy Climbing Club' },
      { id: 'u30nIMy2KTs', title: '20251219 ファミリークラックエリア（シーズン初の城ケ崎）', route: 'ファザー・クラック 5.10b（ファミリークラック）', routeEn: 'Father Crack 5.10b (Family Crack)', note: '社團一整天的快轉合輯，這條從 45:20 開始', noteEn: 'a sped-up club day; this route starts at 45:20', length: '57:01', channel: 'mikko KURATA' },
      { id: 'xkTgSHcZBQQ', title: '城ケ崎 ファミリークラック ブラザークラック 5.10b', route: 'ブラザークラック 5.10b（ファミリークラック）', routeEn: 'Brother Crack 5.10b (Family Crack)', note: '2026-03 FL；說明欄寫和ファザー 相似', noteEn: 'flash in March 2026; the description calls it similar to Father Crack', length: '9:00', channel: '5Gクライミング' },
      { id: '7tCRMGuRZnM', title: '城ケ崎 ファミリークラック マザークラック 5.10c', route: 'マザークラック 5.10c（ファミリークラック）', routeEn: 'Mother Crack 5.10c (Family Crack)', note: '說明欄寫過去有人屋簷 cam 脫落落地，這次屋頂放了 3 個', noteEn: 'the description mentions a past ground fall when a roof cam pulled, so three were placed there', length: '7:12', channel: '5Gクライミング' },
      { id: '4f1TixJe-eE', title: 'マザークラック 5.10c（城ヶ崎 ファミリークラックエリア）', route: 'マザークラック 5.10c（ファミリークラック）', routeEn: 'Mother Crack 5.10c (Family Crack)', note: '說明欄寫出了「胎內」那段才是核心', noteEn: 'the description says the crux comes after leaving the slot', length: '8:31', channel: 'めざせ500イレブン+' },
      { id: 'u3kJH9v5ae4', title: '城ヶ崎　ファミリー　マザークラック　10c', route: 'マザークラック 5.10c（ファミリークラック）', routeEn: 'Mother Crack 5.10c (Family Crack)', note: '說明欄寫不用指寬裂隙，唇緣有左手可拉的小點', noteEn: 'the description skips the finger crack and uses a left-hand edge on the lip', length: '7:02', channel: 'ayakokko' },
      { id: 'u30nIMy2KTs', title: '20251219 ファミリークラックエリア（シーズン初の城ケ崎）', route: 'マザークラック 5.10c（ファミリークラック）', routeEn: 'Mother Crack 5.10c (Family Crack)', note: '社團一整天的快轉合輯，這條從 53:15 開始', noteEn: 'a sped-up club day; this route starts at 53:15', length: '57:01', channel: 'mikko KURATA' },
      { id: '5nkbZT7r_xQ', title: '城ヶ崎 漁火ロック イサリビ・クラックライト 5.10c', route: 'イサリビクラック・ライト 5.10c（漁り火ロック）', routeEn: 'Isaribi Crack Right 5.10c (Isaribi Rock)', note: '說明欄寫浪聲大，和確保者很難溝通', noteEn: 'the description says wave noise makes it hard to talk to the belayer', length: '6:06', channel: '5Gクライミング' },
      { id: 'PP5X0jjDGzg', title: '城ヶ崎、エアーダンス (5.12a)', route: 'エアーダンス 5.12a（シーサイド・サンセット）', routeEn: 'Air Dance 5.12a (Seaside Sunset)', note: '說明欄寫堀洋紀初登，起頭全力 crimp、中後段動態屋簷', noteEn: 'the description credits Hiroki Hori with the first ascent: full-power crimps at the start, dynamic roof moves later', length: '4:33', channel: '萩原悟のクライミング映像' },
      { id: 'hxFAxey6jDo', title: 'ピスタチオ 5.12a｜城ヶ崎 シーサイドエリア (Uncut)', route: 'ピスタチオ 5.12a（シーサイド・サンセット）', routeEn: 'Pistachio 5.12a (Seaside Sunset)', note: '未剪輯全程', noteEn: 'uncut', length: '7:35', channel: 'のぼるきょじん' },
      { id: 'SYhiqLPeL18', title: 'シーサイドに通ったらコテンパンにされた｜城ヶ崎シーサイドエリア', route: 'パンピングアイアンⅡ 5.12b（シーサイド・サンセット）', routeEn: 'Pumping Iron II 5.12b (Seaside Sunset)', note: '約 21 分的 vlog，同片也有シンデレラボーイ、サザンクロス', noteEn: 'a 21-minute vlog that also covers Cinderella Boy and Southern Cross', length: '21:29', channel: 'のぼるきょじん' },
      { id: 'SYhiqLPeL18', title: 'シーサイドに通ったらコテンパンにされた｜城ヶ崎シーサイドエリア', route: 'サザンクロス 5.12b（シーサイド・サンセット）', routeEn: 'Southern Cross 5.12b (Seaside Sunset)', note: '約 21 分的 vlog，同片也有シンデレラボーイ、パンピングアイアンⅡ', noteEn: 'a 21-minute vlog that also covers Cinderella Boy and Pumping Iron II', length: '21:29', channel: 'のぼるきょじん' },
      { id: 'G5D0xRy3L4s', title: '虎の穴(5.13a) 城ヶ崎 Toranoana, Jogasaki', route: '虎の穴 5.13a（シーサイド・サンセット）', routeEn: 'Toranoana 5.13a (Seaside Sunset)', note: '2025-01-18 RP；說明欄寫以 lunge 起、以 lunge 收，中段 crimp 最難', noteEn: 'redpoint on 2025-01-18; the description says it starts and ends with lunges and the crimpy middle is hardest', length: '4:18', channel: 'きい山歩' },
      { id: 'lAPrIRlSAqY', title: '城ヶ崎 シンデレラボーイ（5.13ab）', route: 'シンデレラボーイ 5.13a/b（シーサイド・サンセット）', routeEn: 'Cinderella Boy 5.13a/b (Seaside Sunset)', note: '攀登全程', noteEn: 'the full climb', length: '6:11', channel: 'ちくごん -Chikugon Climbing Channel-' },
      { id: 'SYhiqLPeL18', title: 'シーサイドに通ったらコテンパンにされた｜城ヶ崎シーサイドエリア', route: 'シンデレラボーイ 5.13a/b（シーサイド・サンセット）', routeEn: 'Cinderella Boy 5.13a/b (Seaside Sunset)', note: '約 21 分的 vlog，同片也有パンピングアイアンⅡ、サザンクロス', noteEn: 'a 21-minute vlog that also covers Pumping Iron II and Southern Cross', length: '21:29', channel: 'のぼるきょじん' },
      { id: 'tGPbCAM0joM', title: '【城ヶ崎 Jogasaki Coast 】MARS 5.13d', route: 'MARS 5.13d（影片沒寫子區）', routeEn: 'MARS 5.13d (sector not given)', note: '說明欄寫 1989 年吉田和正初登的傳攀線', noteEn: 'the description calls it a trad line first climbed by Kazumasa Yoshida in 1989', length: '15:22', channel: 'ユウキミヤシタ' },
      { id: 'QoyhjAW7gWk', title: '城ヶ崎ボルダー 「文殊」 初段　フナムシロックエリア 文殊岩/JYOGASAKI Monju V7  Funamushi Rock Area  Monju Rock', route: '文殊 初段（フナムシロック）', routeEn: 'Monju', note: '說明欄提醒落地差、會撞到旁邊的岩，多帶幾塊墊子', noteEn: 'the description warns of a bad landing next to another boulder; bring several pads', length: '1:05', channel: 'Spicy Armpits KEN' },
      { id: 'BnO5aB1HQzA', title: '1泊2日で城ヶ崎ボルダーに行ってきた【外岩遠征】', route: '泥酔 初段（田中磯）', routeEn: 'Deisui', note: '兩天的抱石之旅，同片有日蓮崎、田中磯、橋立多題', noteEn: 'a two-day bouldering trip covering several problems at Nichirenzaki, Tanakaiso and Hashidate', length: '6:07', channel: 'らんどクライミングR&O' },
      { id: 'txuSnOXZ7Vk', title: 'モンスターママ (Monster Mama), 二段 (7b+). 城ヶ崎 (Jogasaki)', route: 'モンスターママ 二段（フナムシロック）', routeEn: 'Monster Mama', note: 'MadBoulder 的 beta 短片', noteEn: 'a MadBoulder beta clip', length: '1:23', channel: 'MadBoulder' },
      { id: 'BnO5aB1HQzA', title: '1泊2日で城ヶ崎ボルダーに行ってきた【外岩遠征】', route: '波浪 二段（日蓮崎）', routeEn: 'Harou', note: '兩天的抱石之旅，同片有田中磯、橋立多題', noteEn: 'a two-day bouldering trip that also covers Tanakaiso and Hashidate', length: '6:07', channel: 'らんどクライミングR&O' },
      { id: 'BnO5aB1HQzA', title: '1泊2日で城ヶ崎ボルダーに行ってきた【外岩遠征】', route: 'ゲラルドゥス・メルカトル 二段（橋立）', routeEn: 'Gerardus Mercator', note: '兩天的抱石之旅，同片有日蓮崎、田中磯多題', noteEn: 'a two-day bouldering trip that also covers Nichirenzaki and Tanakaiso', length: '6:07', channel: 'らんどクライミングR&O' },
      { id: 'RgxVt7IuJmY', title: '城ヶ崎ボルダー フナムシロック 海坊主 四段-', route: '海坊主 四段−（フナムシロック）', routeEn: 'Umibozu', note: '說明欄寫用一指洞的版本爬不動，不用洞大約三段', noteEn: 'the description says the one-finger-pocket version was too hard, and without the pocket it is about 三段', length: '1:59', channel: '160 climber' },
      { id: 'zsSQ2bo3VzA', title: '城ヶ崎　サティアグラハ　四段/V12', route: 'サティアグラハ 四段（日蓮崎）', routeEn: 'Satyagraha', note: '2026-01 完攀；說明欄寫連續反撐，一次就很累', noteEn: 'the 2026-01 send; the description calls it strenuous, with repeated underclings', length: '2:08', channel: 'KameClimb' },
    ],
  },
};
