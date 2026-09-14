import { c, u, type LessonImage } from "./lesson-image-helpers";

export const KOREAN_LESSON_IMAGES: Record<string, LessonImage[]> = {
  "korean/prehistoric-early/prehistoric-culture/paleolithic-life": [
    u("https://upload.wikimedia.org/wikipedia/commons/3/3c/Handaxe_by_John_Frere.png", "전기 구석기를 상징하는 주먹도끼(핸드액스)", "배경"),
    c("Jeongok-ri Prehistoric Site.jpg", "전곡리 선사 유적 일대", "핵심사건(연표)"),
  ],
  "korean/prehistoric-early/prehistoric-culture/neolithic-life": [
    u("https://upload.wikimedia.org/wikipedia/commons/f/f5/Comb_Ceramic_Render.png", "신석기를 대표하는 빗살무늬 토기", "배경"),
    c("Amsa-dong Prehistoric Settlement Site.jpg", "암사동 신석기 취락 유적", "인물"),
  ],
  "korean/prehistoric-early/prehistoric-culture/bronze-iron-culture": [
    c("Korea-Ganghwado-Dolmen-02.jpg", "강화 고인돌 — 청동기 지배층 무덤", "배경"),
    c("2020년 12월 6일에 촬영한 비파형 동검.jpg", "비파형 동검 — 청동기 군장의 권위", "핵심사건(연표)"),
  ],
  "korean/prehistoric-early/gojoseon-neighbors/gojoseon-rise": [
    u("https://upload.wikimedia.org/wikipedia/commons/3/30/Old_Chos%C5%8Fn.png", "고조선의 강역을 그린 지도", "배경"),
    c("Dangun.jpg", "단군 전승과 고조선 건국 이야기", "인물"),
  ],
  "korean/prehistoric-early/gojoseon-neighbors/buyeo-samhan-states": [
    u("https://upload.wikimedia.org/wikipedia/commons/b/b5/1st_century_Korea.png", "기원전후 한반도·만주 여러 나라", "배경"),
  ],
  "korean/three-kingdoms-north-south/three-kingdoms-gaya/goguryeo-growth": [
    u("https://upload.wikimedia.org/wikipedia/commons/3/3f/20230605_Stela_for_Gwanggaeto.jpg", "광개토왕비 — 정복과 왕권의 기록", "배경"),
    c("Goguryeo tomb mural.jpg", "고구려 고분 벽화의 사신·생활 장면", "인물"),
  ],
  "korean/three-kingdoms-north-south/three-kingdoms-gaya/baekje-growth": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/%EB%B0%B1%EC%A0%9C_%EA%B8%88%EB%8F%99%EB%8C%80%ED%96%A5%EB%A1%9C.jpg",
      "백제 금동대향로",
      "배경",
    ),
    c("Muryeong Tomb.jpg", "무령왕릉 — 웅진 백제 왕실", "인물"),
  ],
  "korean/three-kingdoms-north-south/three-kingdoms-gaya/silla-centralization": [
    c("Cheomseongdae-1.jpg", "경주 첨성대", "배경"),
    c("Jinheung Stele.jpg", "진흥왕 순수비 — 영역 확장의 현장 기록", "인물"),
  ],
  "korean/three-kingdoms-north-south/three-kingdoms-gaya/gaya-confederacy": [
    c("Gold Crown of Gaya.jpg", "가야 금관 — 연맹 왕권의 위세", "배경"),
    c("Jisan-dong tumuli.jpg", "고령 지산동 고분군", "핵심사건(연표)"),
  ],
  "korean/three-kingdoms-north-south/unification-north-south/silla-unification": [
    c("Kim Yusin.jpg", "김유신 — 나·당 동맹과 통일 전쟁", "인물"),
    c("Hwangnyongsa replica.jpg", "황룡사 구층목탑의 복원 이미지", "배경"),
  ],
  "korean/three-kingdoms-north-south/unification-north-south/unified-silla-society": [
    c("Bulguksa Temple.jpg", "불국사 — 통일 신라 불교 건축", "배경"),
    c("Seokguram Buddha.jpg", "석굴암 본존불", "인물"),
  ],
  "korean/three-kingdoms-north-south/unification-north-south/balhae-rise": [
    c("Balhae map.png", "발해의 강역과 5경", "배경"),
    c("Sanggyeong site.jpg", "상경용천부 유적", "핵심사건(연표)"),
  ],
  "korean/three-kingdoms-north-south/ancient-economy-culture/ancient-economy-society": [
    c("Gold Crown of Silla Kingdom 01b.jpg", "신라 금관 — 골품 귀족 문화", "배경"),
  ],
  "korean/three-kingdoms-north-south/ancient-economy-culture/ancient-thought-culture": [
    c("Seokguram Grotto.jpg", "석굴암 석굴", "배경"),
    c("Baekje Incense Burner of Baekje in National Museum of Korea.jpg", "백제 금속 공예의 정수", "인물"),
  ],
  "korean/goryeo/politics/goryeo-politics-overview": [
    u("https://upload.wikimedia.org/wikipedia/commons/c/cc/Koryo_map.png", "고려의 강역", "배경"),
    c("Taejo of Goryeo.jpg", "태조 왕건", "인물"),
  ],
  "korean/goryeo/politics/central-local-system": [
    c("Manwoldae.jpg", "개경 만월대 — 고려 궁궐터", "배경"),
  ],
  "korean/goryeo/politics/northern-policy": [
    c("Yun Gwan.jpg", "윤관과 동북 9성", "인물"),
    c("Cheolli Jangseong.jpg", "천리장성 관련 기록·유적", "핵심사건(연표)"),
  ],
  "korean/goryeo/social-change/aristocratic-rebellions": [
    u("https://upload.wikimedia.org/wikipedia/commons/c/cc/Koryo_map.png", "문벌 귀족기의 고려", "배경"),
  ],
  "korean/goryeo/social-change/military-regime": [
    c("Goryeo military.jpg", "무신 정권기 고려", "배경"),
  ],
  "korean/goryeo/social-change/mongol-yuan": [
    c("Mongol invasion of Korea.jpg", "몽골의 고려 침입", "배경"),
    c("Ganghwa Island.jpg", "강화 천도 — 항전의 거점", "핵심사건(연표)"),
  ],
  "korean/goryeo/social-change/gongmin-reform": [
    c("Gongmin of Goryeo.jpg", "공민왕", "인물"),
  ],
  "korean/goryeo/economy-culture/economy-status": [
    c("Goryeo celadon.jpg", "고려청자 — 자기 수공업과 대외 교역", "배경"),
  ],
  "korean/goryeo/economy-culture/thought-culture": [
    c("Tripitaka Koreana.jpg", "해인사 팔만대장경", "배경"),
    c("Goryeo painting Water-Moon Avalokiteshvara.jpg", "고려 불화 수월관음도", "인물"),
  ],
  "korean/joseon-early/foundation/joseon-founding": [
    c("Gyeongbokgung Geunjeongjeon.jpg", "경복궁 근정전 — 한양 천도의 상징", "배경"),
    c("Taejo of Joseon.jpg", "태조 이성계", "인물"),
  ],
  "korean/joseon-early/foundation/administration-military": [
    c("Gyeongbokgung.jpg", "조선 궁궐과 중앙 관아의 공간", "배경"),
  ],
  "korean/joseon-early/foundation/sejong-policy-culture": [
    c("Hunminjeongeum.jpg", "훈민정음", "배경"),
    c("Sejong the Great.jpg", "세종", "인물"),
  ],
  "korean/joseon-early/sarim-factions/hungu-sarim-purges": [
    c("Dosan Seowon.jpg", "서원 — 사림의 근거지", "배경"),
  ],
  "korean/joseon-early/sarim-factions/factional-politics": [
    c("Changdeokgung.jpg", "창덕궁 — 붕당 정치의 무대", "배경"),
  ],
  "korean/joseon-early/two-wars-society/imjin-byeongja-wars": [
    c("Yi Sun-sin.jpg", "이순신", "인물"),
    c("Turtle ship.jpg", "거북선 — 임진왜란 수군", "핵심사건(연표)"),
  ],
  "korean/joseon-early/two-wars-society/early-joseon-society-culture": [
    c("Jikji.jpg", "직지심체요절 — 금속활자", "배경"),
  ],
  "korean/joseon-late/politics-change/factional-politics-hwanguk": [
    c("Sukjong of Joseon.jpg", "숙종 — 환국의 중심", "인물"),
  ],
  "korean/joseon-late/politics-change/tangpyeong-politics": [
    c("Yeongjo of Joseon.jpg", "영조 — 탕평책", "인물"),
    c("Hwaseong Fortress.jpg", "수원 화성 — 정조대 개혁의 공간", "핵심사건(연표)"),
  ],
  "korean/joseon-late/politics-change/sedo-peasant-uprisings": [
    c("Changgyeonggung.jpg", "세도 정치기 왕실·외첩의 공간", "배경"),
  ],
  "korean/joseon-late/politics-change/heungseon-reform": [
    c("Heungseon Daewongun.jpg", "흥선 대원군", "인물"),
    c("Gyeongbokgung restoration.jpg", "경복궁 중건", "핵심사건(연표)"),
  ],
  "korean/joseon-late/economy-society-thought/commercial-money-economy": [
    c("Sangpyeong Tongbo.jpg", "상평통보 — 조선 후기 화폐", "배경"),
  ],
  "korean/joseon-late/economy-society-thought/social-status-change": [
    c("Joseon genre painting.jpg", "조선 후기 풍속화에 보이는 신분 동요", "배경"),
  ],
  "korean/joseon-late/economy-society-thought/silhak-new-culture": [
    c("Jeong Yak-yong.jpg", "정약용", "인물"),
    c("Dongguk Daejeon map.jpg", "실학의 지도·지리 관심", "배경"),
  ],
  "korean/modern-colonial/opening-nation-building/opening-unequal-treaties": [
    c("Unyo incident.jpg", "운요호 사건과 개항 압박", "핵심사건(연표)"),
    c("Ganghwa Treaty.jpg", "강화도 조약", "배경"),
  ],
  "korean/modern-colonial/opening-nation-building/enlightenment-imogapshin": [
    c("Gapsin Coup.jpg", "갑신정변", "핵심사건(연표)"),
    c("Kim Ok-gyun.jpg", "김옥균", "인물"),
  ],
  "korean/modern-colonial/opening-nation-building/donghak-gabo-reform": [
    c("Jeon Bong-jun.jpg", "전봉준", "인물"),
    c("Donghak Peasant Revolution.jpg", "동학 농민 운동", "배경"),
  ],
  "korean/modern-colonial/opening-nation-building/korean-empire-salvation": [
    c("Independence Gate Seoul.jpg", "독립문", "배경"),
    c("Emperor Gojong.jpg", "고종과 대한 제국", "인물"),
  ],
  "korean/modern-colonial/colonial-rule-resistance/1910s-military-rule": [
    c("Japanese Government-General of Korea.jpg", "조선총독부 청사(당시)", "배경"),
  ],
  "korean/modern-colonial/colonial-rule-resistance/march-first-provisional-gov": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/a/a8/L%E2%80%99Ind%C3%A9pendance_de_la_Cor%C3%A9e_et_la_Paix-02.jpg",
      "3·1 운동을 알린 해외 보도·시위 장면",
      "배경",
    ),
    c("Provisional Government of the Republic of Korea.jpg", "대한민국 임시 정부", "인물"),
  ],
  "korean/modern-colonial/colonial-rule-resistance/1920s-cultural-rule": [
    c("Dong-a Ilbo 1920.jpg", "1920년대 한국어 신문과 여론", "배경"),
  ],
  "korean/modern-colonial/colonial-rule-resistance/1930s-40s-independence": [
    u("https://upload.wikimedia.org/wikipedia/commons/d/db/Kim_Gu_in_1949.jpg", "김구", "인물"),
    c("Yun Bong-gil.jpg", "윤봉길 의거", "핵심사건(연표)"),
  ],
  "korean/modern-colonial/colonial-rule-resistance/modern-colonial-society": [
    c("Independence Newspaper.jpg", "독립신문 등 근대 매체", "배경"),
  ],
  "korean/contemporary/liberation-government/liberation-occupation": [
    c("Liberation of Korea 1945.jpg", "1945년 광복", "배경"),
  ],
  "korean/contemporary/liberation-government/government-division": [
    c("Syngman Rhee 1948.jpg", "이승만과 정부 수립", "인물"),
  ],
  "korean/contemporary/korean-war-aftermath/korean-war": [
    c("Incheon Landing.jpg", "인천 상륙 작전", "핵심사건(연표)"),
    c("Korean War refugees.jpg", "전쟁과 피란민", "배경"),
  ],
  "korean/contemporary/korean-war-aftermath/rhee-april-revolution": [
    c("April Revolution 1960.jpg", "4·19 혁명", "배경"),
  ],
  "korean/contemporary/authoritarianism-democratization/park-industrialization": [
    c("Pohang Steel.jpg", "중화학 공업과 산업화", "배경"),
  ],
  "korean/contemporary/authoritarianism-democratization/gwangju-june-uprising": [
    c("June Democratic Struggle 1987.jpg", "6월 민주 항쟁", "배경"),
  ],
  "korean/contemporary/authoritarianism-democratization/civilian-government-change": [
    c("National Assembly of South Korea.jpg", "문민 정부 이후 의회 정치", "배경"),
  ],
  "korean/contemporary/contemporary-challenges/growth-social-change": [
    c("Seoul cityscape.jpg", "고도성장 이후의 도시 경관", "배경"),
  ],
  "korean/contemporary/contemporary-challenges/inter-korean-world": [
    c("Korean DMZ.jpg", "한반도 비무장지대", "배경"),
  ],
};
