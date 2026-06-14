export type Category = 'レトロPC' | 'PDA' | '書籍' | '周辺機器' | 'その他';

export interface Item {
  id: string;
  name: string;
  category: Category;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecognizedItem {
  name: string;
  category: Category;
  memo: string;
}

export interface NoteIdea {
  title: string;
  description: string;
}
