export type TrackId = "korean" | "world";

export type Difficulty = 1 | 2 | 3;

export interface CurriculumLessonRef {
  id: string;
  title: string;
  mdxPath: string;
  order?: number;
}

export interface CurriculumUnit {
  id: string;
  title: string;
  lessons: CurriculumLessonRef[];
}

export interface CurriculumEra {
  id: string;
  title: string;
  description?: string;
  units: CurriculumUnit[];
}

export interface CurriculumFile {
  track: TrackId;
  trackLabel: string;
  eras: CurriculumEra[];
}

export interface LessonFrontmatter {
  title: string;
  track: TrackId;
  era: string;
  unit: string;
  keywords: string[];
  difficulty: Difficulty;
  description?: string;
  order?: number;
  draft?: boolean;
  quiz?: Quiz;
}

export interface QuizChoice {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: QuizChoice[];
  answer: string;
  explanation?: string;
}

export interface Quiz {
  lessonId?: string;
  version?: number;
  questions: QuizQuestion[];
}

export interface LessonProgress {
  read: boolean;
  readAt?: string;
  quizBestScore?: number;
  quizAttempts?: number;
  lastQuizAt?: string;
}

export interface QuizMistake {
  id: string;
  lessonKey: string;
  questionId: string;
  prompt: string;
  choices: QuizChoice[];
  answer: string;
  chosen: string;
  chosenText: string;
  answerText: string;
  explanation?: string;
  href: string;
  at: string;
}

export interface ProgressStore {
  version: 1;
  lessons: Record<string, LessonProgress>;
  lastVisited?: string;
  mistakes?: QuizMistake[];
}

export interface LessonMeta {
  track: TrackId;
  era: string;
  unit: string;
  lesson: string;
  title: string;
  eraTitle: string;
  unitTitle: string;
  trackLabel: string;
  lessonKey: string;
  href: string;
  mdxPath: string;
  description?: string;
  keywords: string[];
  difficulty: Difficulty;
  draft: boolean;
}

export interface SearchDocument {
  id: string;
  track: TrackId;
  title: string;
  era: string;
  eraTitle: string;
  unit: string;
  unitTitle: string;
  keywords: string[];
  bodyText: string;
  href: string;
  description?: string;
}

export interface AdjacentLesson {
  prev: LessonMeta | null;
  next: LessonMeta | null;
}
