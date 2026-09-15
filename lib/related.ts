import type { LessonMeta } from "./types";
import { getFlatLessons } from "./content";

export interface RelatedLessonLink {
  lessonKey: string;
  title: string;
  href: string;
  trackLabel: string;
  eraTitle: string;
  note: string;
}

type RelatedPair = {
  a: string;
  b: string;
  note: string;
};

/** Curated Korean ↔ world (and a few intra-track) pairs. Bidirectional. */
const RELATED_PAIRS: RelatedPair[] = [
  {
    a: "korean/prehistoric-early/prehistoric-culture/paleolithic-life",
    b: "world/origins/prehistory/human-origins",
    note: "도구·불·이동 생활의 세계사 배경",
  },
  {
    a: "korean/prehistoric-early/prehistoric-culture/neolithic-life",
    b: "world/origins/prehistory/human-origins",
    note: "농경과 정착이 시작된 선사 전환",
  },
  {
    a: "korean/prehistoric-early/prehistoric-culture/bronze-iron-culture",
    b: "world/origins/china/yellow-river-civilization",
    note: "동아시아 청동기와 초기 국가 형성",
  },
  {
    a: "korean/prehistoric-early/gojoseon-neighbors/gojoseon-rise",
    b: "world/origins/china/yellow-river-civilization",
    note: "고조선과 황허 문명의 이웃 관계",
  },
  {
    a: "korean/prehistoric-early/gojoseon-neighbors/gojoseon-rise",
    b: "world/east-asia/formation/han-empire",
    note: "한의 팽창과 고조선 멸망",
  },
  {
    a: "korean/prehistoric-early/gojoseon-neighbors/buyeo-samhan-states",
    b: "world/east-asia/formation/han-empire",
    note: "한군현 주변의 부여·삼한",
  },
  {
    a: "korean/three-kingdoms-north-south/three-kingdoms-gaya/goguryeo-growth",
    b: "world/east-asia/formation/sui-tang",
    note: "수·당과의 전쟁과 동아시아 질서",
  },
  {
    a: "korean/three-kingdoms-north-south/three-kingdoms-gaya/goguryeo-growth",
    b: "world/east-asia/formation/han-empire",
    note: "한 제국 이후 북방 세력의 성장",
  },
  {
    a: "korean/three-kingdoms-north-south/three-kingdoms-gaya/baekje-growth",
    b: "world/east-asia/formation/ancient-japan",
    note: "백제와 왜의 문화·외교 교류",
  },
  {
    a: "korean/three-kingdoms-north-south/three-kingdoms-gaya/baekje-growth",
    b: "world/east-asia/formation/east-asian-cultural-sphere",
    note: "율령·불교가 퍼진 문화권",
  },
  {
    a: "korean/three-kingdoms-north-south/three-kingdoms-gaya/silla-centralization",
    b: "world/east-asia/formation/sui-tang",
    note: "신라 중앙 집권과 당의 율령 모델",
  },
  {
    a: "korean/three-kingdoms-north-south/three-kingdoms-gaya/gaya-confederacy",
    b: "world/east-asia/formation/ancient-japan",
    note: "가야의 철·교역과 왜",
  },
  {
    a: "korean/three-kingdoms-north-south/unification-north-south/silla-unification",
    b: "world/east-asia/formation/sui-tang",
    note: "나·당 동맹과 통일 전쟁",
  },
  {
    a: "korean/three-kingdoms-north-south/unification-north-south/unified-silla-society",
    b: "world/east-asia/formation/east-asian-cultural-sphere",
    note: "통일 신라와 동아시아 문화권",
  },
  {
    a: "korean/three-kingdoms-north-south/unification-north-south/balhae-rise",
    b: "world/east-asia/development/northern-peoples",
    note: "발해와 북방 민족의 병존",
  },
  {
    a: "korean/three-kingdoms-north-south/ancient-economy-culture/ancient-thought-culture",
    b: "world/east-asia/formation/east-asian-cultural-sphere",
    note: "불교·유교의 수용",
  },
  {
    a: "korean/three-kingdoms-north-south/ancient-economy-culture/ancient-thought-culture",
    b: "world/west-asia/india/maurya-buddhism",
    note: "불교가 아시아로 퍼진 기원",
  },
  {
    a: "korean/goryeo/politics/goryeo-politics-overview",
    b: "world/east-asia/development/song-society",
    note: "고려와 송의 문치·외교",
  },
  {
    a: "korean/goryeo/politics/northern-policy",
    b: "world/east-asia/development/northern-peoples",
    note: "거란(요)·여진(금)과의 북방 관계",
  },
  {
    a: "korean/goryeo/social-change/mongol-yuan",
    b: "world/east-asia/development/mongol-yuan",
    note: "몽골 팽창과 원 간섭",
  },
  {
    a: "korean/goryeo/economy-culture/thought-culture",
    b: "world/east-asia/development/song-society",
    note: "불교·성리학과 송대 사상",
  },
  {
    a: "korean/joseon-early/foundation/joseon-founding",
    b: "world/east-asia/transformation/ming",
    note: "조선 건국과 명 중심 질서",
  },
  {
    a: "korean/joseon-early/foundation/sejong-policy-culture",
    b: "world/east-asia/transformation/ming",
    note: "15세기 동아시아 문치의 정점",
  },
  {
    a: "korean/joseon-early/two-wars-society/imjin-byeongja-wars",
    b: "world/east-asia/transformation/edo-japan",
    note: "임진왜란과 일본 전국·에도 전환",
  },
  {
    a: "korean/joseon-early/two-wars-society/imjin-byeongja-wars",
    b: "world/east-asia/transformation/ming",
    note: "명 참전과 동아시아 전쟁",
  },
  {
    a: "korean/joseon-early/two-wars-society/early-joseon-society-culture",
    b: "world/east-asia/transformation/ming",
    note: "성리학 질서와 명·조선 사회",
  },
  {
    a: "korean/joseon-late/economy-society-thought/commercial-money-economy",
    b: "world/east-asia/transformation/east-asia-trade",
    note: "은·공물과 해역 교역망",
  },
  {
    a: "korean/joseon-late/economy-society-thought/silhak-new-culture",
    b: "world/early-modern-europe/revolution/science-enlightenment",
    note: "실학과 실증·경세의 세계적 맥락",
  },
  {
    a: "korean/joseon-late/politics-change/heungseon-reform",
    b: "world/east-asia/transformation/qing",
    note: "서양 압박 속 조선과 청",
  },
  {
    a: "korean/modern-colonial/opening-nation-building/opening-unequal-treaties",
    b: "world/imperialism-world-wars/imperialism-nationalism/imperialism-partition",
    note: "불평등 조약과 제국주의 분할",
  },
  {
    a: "korean/modern-colonial/opening-nation-building/opening-unequal-treaties",
    b: "world/east-asia/transformation/qing",
    note: "개항기 동아시아의 불평등 조약",
  },
  {
    a: "korean/modern-colonial/opening-nation-building/enlightenment-imogapshin",
    b: "world/imperialism-world-wars/imperialism-nationalism/meiji-japan",
    note: "개화 경쟁과 메이지 유신",
  },
  {
    a: "korean/modern-colonial/opening-nation-building/donghak-gabo-reform",
    b: "world/imperialism-world-wars/imperialism-nationalism/meiji-japan",
    note: "청일전쟁 전후 개혁과 일본",
  },
  {
    a: "korean/modern-colonial/opening-nation-building/korean-empire-salvation",
    b: "world/imperialism-world-wars/imperialism-nationalism/imperialism-partition",
    note: "대한 제국과 열강의 분할 경쟁",
  },
  {
    a: "korean/modern-colonial/colonial-rule-resistance/1910s-military-rule",
    b: "world/imperialism-world-wars/imperialism-nationalism/meiji-japan",
    note: "일본 제국주의와 무단 통치",
  },
  {
    a: "korean/modern-colonial/colonial-rule-resistance/march-first-provisional-gov",
    b: "world/imperialism-world-wars/world-wars/world-war-i",
    note: "민족 자결 원칙과 3·1 운동",
  },
  {
    a: "korean/modern-colonial/colonial-rule-resistance/march-first-provisional-gov",
    b: "world/imperialism-world-wars/imperialism-nationalism/china-national-movement",
    note: "3·1과 5·4 등 동아시아 민족 운동",
  },
  {
    a: "korean/modern-colonial/colonial-rule-resistance/1920s-cultural-rule",
    b: "world/imperialism-world-wars/world-wars/interwar-asia",
    note: "전간기 아시아의 민족 운동",
  },
  {
    a: "korean/modern-colonial/colonial-rule-resistance/1930s-40s-independence",
    b: "world/imperialism-world-wars/world-wars/world-war-ii",
    note: "전시 동원과 제2차 세계 대전",
  },
  {
    a: "korean/modern-colonial/colonial-rule-resistance/1930s-40s-independence",
    b: "world/imperialism-world-wars/world-wars/interwar-asia",
    note: "만주·중일전쟁과 무장 독립 운동",
  },
  {
    a: "korean/modern-colonial/colonial-rule-resistance/modern-colonial-society",
    b: "world/imperialism-world-wars/imperialism-nationalism/imperialism-partition",
    note: "식민 경제와 제국주의 수탈 구조",
  },
  {
    a: "korean/contemporary/liberation-government/liberation-occupation",
    b: "world/imperialism-world-wars/world-wars/world-war-ii",
    note: "일제 패망과 광복",
  },
  {
    a: "korean/contemporary/liberation-government/liberation-occupation",
    b: "world/contemporary-world/cold-war/cold-war-formation",
    note: "미·소 점령과 냉전 형성",
  },
  {
    a: "korean/contemporary/liberation-government/government-division",
    b: "world/contemporary-world/cold-war/cold-war-formation",
    note: "분단 정부와 냉전 질서",
  },
  {
    a: "korean/contemporary/korean-war-aftermath/korean-war",
    b: "world/contemporary-world/cold-war/cold-war-conflicts",
    note: "한국 전쟁과 냉전 열전",
  },
  {
    a: "korean/contemporary/korean-war-aftermath/rhee-april-revolution",
    b: "world/contemporary-world/cold-war/cold-war-formation",
    note: "전후 반공 체제와 냉전",
  },
  {
    a: "korean/contemporary/authoritarianism-democratization/park-industrialization",
    b: "world/contemporary-world/cold-war/cold-war-formation",
    note: "냉전 하 개발 독재와 성장",
  },
  {
    a: "korean/contemporary/authoritarianism-democratization/gwangju-june-uprising",
    b: "world/contemporary-world/cold-war/detente-end-of-cold-war",
    note: "1980년대 민주화와 탈냉전 흐름",
  },
  {
    a: "korean/contemporary/authoritarianism-democratization/civilian-government-change",
    b: "world/contemporary-world/cold-war/detente-end-of-cold-war",
    note: "문민화와 냉전 종식 이후",
  },
  {
    a: "korean/contemporary/contemporary-challenges/growth-social-change",
    b: "world/contemporary-world/twenty-first-century/globalization-multipolarity",
    note: "성장·한류와 세계화",
  },
  {
    a: "korean/contemporary/contemporary-challenges/inter-korean-world",
    b: "world/contemporary-world/cold-war/cold-war-conflicts",
    note: "한반도 문제와 냉전 유산",
  },
  {
    a: "korean/contemporary/contemporary-challenges/inter-korean-world",
    b: "world/contemporary-world/cold-war/detente-end-of-cold-war",
    note: "남북 대화와 데탕트·탈냉전",
  },
  {
    a: "korean/joseon-late/economy-society-thought/silhak-new-culture",
    b: "world/medieval-europe/late-medieval-reform/renaissance-reformation",
    note: "지식·세계관의 전환을 비교",
  },
];

const MAX_RELATED = 4;

export function getRelatedLessons(lessonKey: string): RelatedLessonLink[] {
  const byKey = new Map<string, LessonMeta>();
  for (const lesson of getFlatLessons()) {
    byKey.set(lesson.lessonKey, lesson);
  }

  const seen = new Set<string>();
  const out: RelatedLessonLink[] = [];

  for (const pair of RELATED_PAIRS) {
    let other: string | null = null;
    const note = pair.note;
    if (pair.a === lessonKey) other = pair.b;
    else if (pair.b === lessonKey) other = pair.a;
    if (!other || seen.has(other)) continue;
    const meta = byKey.get(other);
    if (!meta) continue;
    seen.add(other);
    out.push({
      lessonKey: meta.lessonKey,
      title: meta.title,
      href: meta.href,
      trackLabel: meta.trackLabel,
      eraTitle: meta.eraTitle,
      note,
    });
    if (out.length >= MAX_RELATED) break;
  }

  return out;
}
