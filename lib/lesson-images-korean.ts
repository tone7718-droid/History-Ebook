import { u, type LessonImage } from "./lesson-image-helpers";

export const KOREAN_LESSON_IMAGES: Record<string, LessonImage[]> = {
  "korean/prehistoric-early/prehistoric-culture/paleolithic-life": [
    u("https://upload.wikimedia.org/wikipedia/commons/3/3c/Handaxe_by_John_Frere.png", "전기 구석기를 상징하는 주먹도끼", "배경"),
    u("https://upload.wikimedia.org/wikipedia/commons/8/8b/Amsadong_IMG_2081.jpg", "후대 신석기 취락으로 이어지는 한반도 선사 경관", "핵심사건(연표)"),
  ],
  "korean/prehistoric-early/prehistoric-culture/neolithic-life": [
    u("https://upload.wikimedia.org/wikipedia/commons/5/59/KoreanEarthenwareJar4000BCEAmsa-DongNearSeoul.jpg", "신석기 빗살무늬 토기", "배경"),
    u("https://upload.wikimedia.org/wikipedia/commons/8/8b/Amsadong_IMG_2081.jpg", "서울 암사동 신석기 유적", "인물"),
  ],
  "korean/prehistoric-early/prehistoric-culture/bronze-iron-culture": [
    u("https://upload.wikimedia.org/wikipedia/commons/b/bd/Example_of_a_southern-style_dolmen_at_Ganghwa_Island.jpg", "강화 고인돌 — 청동기 지배층 무덤", "배경"),
    u("https://upload.wikimedia.org/wikipedia/commons/b/be/Bronze_dagger.jpg", "비파형 동검으로 대표되는 청동기 무기", "핵심사건(연표)"),
  ],
  "korean/prehistoric-early/gojoseon-neighbors/gojoseon-rise": [
    u("https://upload.wikimedia.org/wikipedia/commons/6/61/History_of_Korea-108_BC_ko.png", "고조선 강역을 그린 지도", "배경"),
    u("https://upload.wikimedia.org/wikipedia/commons/b/b8/Portrait_of_Dangun.jpg", "단군 초상 — 고조선 건국 전승", "인물"),
  ],
  "korean/prehistoric-early/gojoseon-neighbors/buyeo-samhan-states": [
    u("https://upload.wikimedia.org/wikipedia/commons/b/b5/1st_century_Korea.png", "기원전후 한반도·만주 여러 나라", "배경"),
    u("https://upload.wikimedia.org/wikipedia/commons/8/8b/Buyeo.svg", "부여의 위치를 나타낸 도해", "핵심사건(연표)"),
  ],
};
