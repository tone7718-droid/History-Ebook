import { c, u, type LessonImage } from "./lesson-image-helpers";

export const WORLD_LESSON_IMAGES: Record<string, LessonImage[]> = {
  "world/origins/world-history-meaning/meaning-of-world-history": [
    c("World map 1689.jpg", "옛 세계지도 — 세계를 어떻게 그렸나", "배경"),
  ],
  "world/origins/prehistory/human-origins": [
    c("Venus of Willendorf.jpg", "빌렌도르프의 비너스 — 후기 구석기", "배경"),
    c("Lascaux painting.jpg", "라스코 동굴 벽화", "핵심사건(연표)"),
  ],
  "world/origins/mesopotamia/mesopotamia-civilization": [
    c("Code of Hammurabi.jpg", "함무라비 법전 석비", "배경"),
    c("Ziggurat of Ur.jpg", "우르의 지구라트", "핵심사건(연표)"),
  ],
  "world/origins/egypt/egypt-civilization": [
    c("Great Pyramid of Giza.jpg", "기자의 대피라미드", "배경"),
    c("Mask of Tutankhamun.jpg", "투탕카멘 황금 마스크", "인물"),
  ],
  "world/origins/mediterranean/mediterranean-neighbors": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Phoenicia_map-en.svg/960px-Phoenicia_map-en.svg.png",
      "페니키아 해상 교역망",
      "배경",
    ),
  ],
  "world/origins/indus/indus-civilization": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Mohenjodaro_-_view_of_the_stupa_mound.JPG",
      "모헨조다로 유적",
      "배경",
    ),
  ],
  "world/origins/china/yellow-river-civilization": [
    c("Shang bronze vessel.jpg", "상 왕조 청동 제기", "배경"),
  ],
  "world/east-asia/formation/spring-autumn-warring-states": [
    c("Confucius.jpg", "공자 — 제자백가의 한 흐름", "인물"),
  ],
  "world/east-asia/formation/qin-unification": [
    c("Terracotta Army.jpg", "진시황릉 병마용", "배경"),
    c("Great Wall of China.jpg", "만리장성", "핵심사건(연표)"),
  ],
  "world/east-asia/formation/han-empire": [
    c("Han dynasty map.jpg", "한 제국의 강역", "배경"),
  ],
  "world/east-asia/formation/six-dynasties": [
    c("Longmen Grottoes.jpg", "룡먼 석굴 — 위진남북조·수당 불교", "배경"),
  ],
  "world/east-asia/formation/sui-tang": [
    c("Giant Wild Goose Pagoda.jpg", "대안탑 — 당 장안과 율령 국가", "배경"),
  ],
  "world/east-asia/formation/east-asian-cultural-sphere": [
    c("Chang'an map.jpg", "장안성 — 동아시아 문화권의 중심 도시", "배경"),
  ],
  "world/east-asia/formation/ancient-japan": [
    c("Horyu-ji.jpg", "호류지 — 아스카·나라 불교 건축", "배경"),
  ],
  "world/east-asia/development/song-society": [
    u("https://upload.wikimedia.org/wikipedia/commons/d/d2/Bianjing_city_gate.JPG", "청명상하도에 보이는 송의 도시", "배경"),
  ],
  "world/east-asia/development/northern-peoples": [
    u("https://upload.wikimedia.org/wikipedia/commons/2/25/Liao_circuits.png", "요의 통치 구획", "배경"),
  ],
  "world/east-asia/development/mongol-yuan": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/3/35/YuanEmperorAlbumGenghisPortrait.jpg",
      "칭기즈 칸(원대 제왕 화첩)",
      "인물",
    ),
  ],
  "world/east-asia/development/kamakura-japan": [
    c("Great Buddha of Kamakura.jpg", "가마쿠라 대불", "배경"),
  ],
  "world/east-asia/transformation/ming": [
    c("Forbidden City.jpg", "자금성 — 명 황제권의 공간", "배경"),
  ],
  "world/east-asia/transformation/qing": [
    c("Kangxi Emperor.jpg", "강희제", "인물"),
  ],
  "world/east-asia/transformation/edo-japan": [
    u("https://upload.wikimedia.org/wikipedia/commons/5/5f/Edo_P_detail.jpg", "에도의 도시 경관", "배경"),
  ],
  "world/east-asia/transformation/east-asia-trade": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Nagasaki_City_View_from_Glover_Garden%2C_Nagasaki_2014.jpg",
      "나가사키 — 해역 교역의 창구",
      "배경",
    ),
  ],
  "world/west-asia/pre-islam-empires/assyria": [
    c("Lamassu.jpg", "라마수 — 아시리아 궁전 수호상", "배경"),
  ],
  "world/west-asia/pre-islam-empires/achaemenid-persia": [
    c("Persepolis.jpg", "페르세폴리스", "배경"),
  ],
  "world/west-asia/pre-islam-empires/parthia-sasanian": [
    c("Taq Kasra.jpg", "타크 키스라 — 사산 왕조 이완", "배경"),
  ],
  "world/west-asia/islam/islam-formation": [
    c("Masjid al-Haram.jpg", "마스지드 알하람 — 이슬람의 중심", "배경"),
  ],
  "world/west-asia/gunpowder-empires/ottoman-empire": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/4/4a/Hagia_Sophia_%28228968325%29.jpeg",
      "아야소피아 — 비잔티움에서 오스만으로",
      "배경",
    ),
  ],
  "world/west-asia/gunpowder-empires/timurid-safavid": [
    c("Shah Mosque Isfahan.jpg", "이스파한 이맘 모스크 — 사파비", "배경"),
  ],
  "world/west-asia/india/maurya-buddhism": [
    c("Sanchi Stupa.jpg", "산치 대탑 — 마우리아·불교", "배경"),
  ],
  "world/west-asia/india/kushan-gupta": [
    u("https://upload.wikimedia.org/wikipedia/commons/c/c3/Ajanta_%2863%29.jpg", "아잔타 석굴", "배경"),
  ],
  "world/west-asia/india/delhi-mughal": [
    u("https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg", "타지마할 — 무굴 건축", "배경"),
  ],
  "world/west-asia/india/southeast-asia-indianization": [
    u("https://upload.wikimedia.org/wikipedia/commons/4/41/Angkor_Wat.jpg", "앙코르와트", "배경"),
  ],
  "world/ancient-greece/polis/athenian-democracy": [
    u("https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg", "파르테논 — 아테네 폴리스", "배경"),
  ],
  "world/ancient-greece/polis/sparta-persian-wars": [
    u("https://upload.wikimedia.org/wikipedia/commons/f/fb/Helmed_Hoplite_Sparta.JPG", "스파르타 중장보병", "배경"),
  ],
  "world/ancient-greece/polis/hellenism": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Alexander_Mosaic_detail_of_Alexander_the_Great_%283x4_cropped%29.jpg",
      "알렉산드로스 (이소스 모자이크)",
      "인물",
    ),
  ],
  "world/ancient-rome/rome/roman-republic": [
    c("Roman Forum.jpg", "로마 포럼 — 공화정의 공적 공간", "배경"),
  ],
  "world/ancient-rome/rome/roman-empire": [
    c("Colosseum.jpg", "콜로세움 — 제정 로마", "배경"),
  ],
  "world/ancient-rome/rome/christianity-rome": [
    c("Pantheon Rome.jpg", "판테온", "배경"),
  ],
  "world/medieval-europe/formation-and-church/germanic-franks": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/f/fb/Charlemagne_denier_Mayence_812_814.jpg",
      "카롤루스(샤를마뉴) 데나리우스",
      "인물",
    ),
  ],
  "world/medieval-europe/formation-and-church/feudalism": [
    u("https://upload.wikimedia.org/wikipedia/commons/9/9c/Odo_bayeux_tapestry.png", "바이외 태피스트리 — 기사와 봉신", "배경"),
  ],
  "world/medieval-europe/formation-and-church/papacy-byzantium": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/4/4a/Hagia_Sophia_%28228968325%29.jpeg",
      "하기아 소피아 — 비잔티움 교회",
      "배경",
    ),
  ],
  "world/medieval-europe/formation-and-church/crusades": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Combat_deuxi%C3%A8me_croisade.jpg",
      "십자군 전쟁 장면(중세 채색)",
      "배경",
    ),
  ],
  "world/medieval-europe/late-medieval-reform/late-medieval-crisis": [
    c("Black Death spread.jpg", "흑사병의 확산", "배경"),
  ],
  "world/medieval-europe/late-medieval-reform/renaissance-reformation": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Sistine_Chapel_ceiling_02_%28brightened%29.jpg",
      "시스티나 성당 천장화 — 르네상스",
      "배경",
    ),
    c("Martin Luther 95 Theses.jpg", "루터와 95개조", "인물"),
  ],
  "world/early-modern-europe/exploration-absolutism/age-of-exploration": [
    c("Christopher Columbus.jpg", "콜뙌버스와 신항로", "인물"),
    c("Cantino planisphere.jpg", "칸티노 세계 지도", "배경"),
  ],
  "world/early-modern-europe/exploration-absolutism/americas-conquest": [
    c("Moctezuma II.jpg", "모크테수마 2세 — 아스테카", "인물"),
    c("Machu Picchu.jpg", "마추픽추 — 잉카", "배경"),
  ],
  "world/early-modern-europe/exploration-absolutism/western-absolutism": [
    c("Louis XIV of France.jpg", "루이 14세", "인물"),
    c("Palace of Versailles.jpg", "베르사유 궁전", "배경"),
  ],
  "world/early-modern-europe/exploration-absolutism/eastern-absolutism": [
    c("Peter the Great.jpg", "표트르 대제", "인물"),
  ],
  "world/early-modern-europe/revolution/science-enlightenment": [
    c("Isaac Newton.jpg", "아이작 뉴턴", "인물"),
  ],
  "world/early-modern-europe/revolution/english-revolution": [
    c("Oliver Cromwell.jpg", "올리버 크롬웠", "인물"),
  ],
  "world/early-modern-europe/revolution/american-revolution": [
    c("Declaration of Independence (1819), by John Trumbull.jpg", "미국 독립선언 채택 장면", "배경"),
  ],
  "world/early-modern-europe/revolution/french-revolution": [
    c("Storming of the Bastille.jpg", "바스티유 습격", "핵심사건(연표)"),
  ],
  "world/early-modern-europe/revolution/vienna-liberalism-nationalism": [
    c("Congress of Vienna.jpg", "빈 회의", "배경"),
  ],
  "world/early-modern-europe/revolution/industrial-revolution": [
    c("Watt steam engine.jpg", "와트 증기기관", "배경"),
  ],
  "world/imperialism-world-wars/imperialism-nationalism/imperialism-partition": [
    c("Scramble for Africa.jpg", "아프리카 분할", "배경"),
  ],
  "world/imperialism-world-wars/imperialism-nationalism/china-national-movement": [
    c("Sun Yat-sen.jpg", "쎜원과 신해혁명", "인물"),
  ],
  "world/imperialism-world-wars/imperialism-nationalism/meiji-japan": [
    c("Emperor Meiji.jpg", "메이지 천황", "인물"),
  ],
  "world/imperialism-world-wars/imperialism-nationalism/india-national-movement": [
    c("Mahatma Gandhi.jpg", "간디와 비폭력 저항", "인물"),
  ],
  "world/imperialism-world-wars/imperialism-nationalism/west-asia-africa-se-asia": [
    c("Mustafa Kemal Ataturk.jpg", "아타튀르크 — 오스만 이후 민족 국가", "인물"),
  ],
  "world/imperialism-world-wars/world-wars/world-war-i": [
    c("World War I trench.jpg", "제1차 세계 대전 참호", "배경"),
  ],
  "world/imperialism-world-wars/world-wars/russian-revolution": [
    c("Storming of the Winter Palace.jpg", "러시아 혁명", "배경"),
  ],
  "world/imperialism-world-wars/world-wars/interwar-asia": [
    c("Chiang Kai-shek.jpg", "장제스와 전간기 중국", "인물"),
  ],
  "world/imperialism-world-wars/world-wars/great-depression-totalitarianism": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Unemployed_men_queued_outside_a_depression_soup_kitchen_opened_in_Chicago_by_Al_Capone%2C_02-1931_-_NARA_-_541927.jpg",
      "대공황기 배급 행렬",
      "배경",
    ),
  ],
  "world/imperialism-world-wars/world-wars/world-war-ii": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Bundesarchiv_Bild_101I-646-5188-17%2C_Flugzeuge_Junkers_Ju_87.jpg",
      "제2차 세계 대전",
      "배경",
    ),
  ],
  "world/contemporary-world/cold-war/cold-war-formation": [
    u("https://upload.wikimedia.org/wikipedia/commons/5/5d/Berlinermauer.jpg", "베를린 장벽", "배경"),
  ],
  "world/contemporary-world/cold-war/cold-war-conflicts": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/6/67/U.S._Army_UH-1H_Hueys_insert_ARVN_troops_at_Kh%C3%A2m_%C4%90%E1%BB%A9c%2C_Vietnam%2C_12_July_1970_%2879431435%29.jpg",
      "베트남 전쟁",
      "핵심사건(연표)",
    ),
  ],
  "world/contemporary-world/cold-war/third-world-nonalignment": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/9/97/Nehru_in_the_Netherlands%2C_1957.jpg",
      "네루 — 비동맹 운동",
      "인물",
    ),
  ],
  "world/contemporary-world/cold-war/detente-end-of-cold-war": [
    u(
      "https://upload.wikimedia.org/wikipedia/commons/5/57/RIAN_archive_850809_General_Secretary_of_the_CPSU_CC_M._Gorbachev_%28crop%29.jpg",
      "고르바초프와 냉전 종식",
      "인물",
    ),
  ],
  "world/contemporary-world/twenty-first-century/globalization-multipolarity": [
    c("Earth from space.jpg", "지구촌으로 연결된 세계", "배경"),
  ],
  "world/contemporary-world/twenty-first-century/global-issues": [
    c("Climate change temperature.jpg", "기후 변화 — 지구촌 과제", "배경"),
  ],
};
