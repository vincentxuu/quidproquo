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
      { id: 'Id8LRtAsqlA', title: 'Hanging Off a Cliff - Insubong Descent!', route: 'Pigeon 垂降', routeEn: 'Pigeon descent', note: '西面垂降實測', noteEn: 'the descent itself', length: '13:47', channel: 'Joel Bennett' },
      { id: 'lYVPPcpjoo0', title: '■경동클라이밍■ 북한산 인수봉 고독길 등반', route: 'Lonely Road 5.6（西面）', routeEn: 'Lonely Road 5.6 (west face)', note: '完整攀登，繩隊視角', noteEn: 'full ascent from the team', length: '16:50', channel: '맥클라이밍' },
      { id: 'OFNWgS2YQN0', title: '인수봉 고독길 8피치 마스터, 인수봉에서 가장 역사가 오래된 등반 루트를 오르다', route: 'Lonely Road 5.6（西面）', routeEn: 'Lonely Road 5.6 (west face)', note: '8 段版本（影片標題），歷史最久的路線', noteEn: 'eight-pitch version per the title, the oldest line', length: '17:47', channel: '여행발자국동행' },
      { id: 'TMjYfUO2wQk', title: 'Insubong Go-Deok Wei Gil, 고독의길 (lonely road) Approach + Climb', route: 'Lonely Road 5.6（西面）', routeEn: 'Lonely Road 5.6 (west face)', note: '從東側接近，攀登西面；僅外部連結', noteEn: 'east-side approach, west-face climb; link only', length: '7:01', channel: "The Tay's Adventures", embed: false },
      { id: '832EYL3GKNk', title: '인수봉 취나드 a 4피치, 재밍의 마력을 믿어라', route: 'Chouinard A 5.10a（東面）', routeEn: 'Chouinard A 5.10a (east face)', note: '只爬前 4 段', noteEn: 'stops after pitch 4', length: '28:02', channel: '쏘맥 클라이머' },
      { id: 'MQrD0McDfqQ', title: '인수봉 명품코스 취나드 A를 오르다', route: 'Chouinard A 5.10a（東面）', routeEn: 'Chouinard A 5.10a (east face)', note: '名品段，作者關閉嵌入', noteEn: 'classic pitches, embed disabled', length: '10:39', channel: '김용기의클라이밍세상', embed: false },
      { id: '4UdmiJv42x8', title: '어이, 인수봉 바위 맛 좀 볼텨? Climbing Insubong Peak, Seoul (ENG SUB)', route: 'Chouinard B 5.8（東面）', routeEn: 'Chouinard B 5.8 (east face)', note: '英文字幕', noteEn: 'English subtitles', length: '10:01', channel: '야생민짜 Wildminzza' },
      { id: 'HxdmcFZcFuU', title: 'Insu-bong chouinard-b, Rock climbing in Seoul', route: 'Chouinard B 5.8（東面）', routeEn: 'Chouinard B 5.8 (east face)', note: '完整 Vlog', noteEn: 'full vlog', length: '27:03', channel: 'Katie Daily' },
      { id: 'Nd2mY65a6Is', title: "Seoul's Hidden Crack Climbing Scene", route: 'Insu B 5.9（東面）', routeEn: 'Insu B 5.9 (east face)', note: '裂隙場景', noteEn: 'the crack scene', length: '14:49', channel: 'Sofia Jin' },
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
};
