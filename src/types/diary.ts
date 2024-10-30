export interface DiaryEntry {
  id: string;
  date: string;
  sections: DiarySection[];
  templateId: string;
  flags: EntryFlags;
  createdAt: string;
  updatedAt: string;
}

export interface DiarySection {
  id: string;
  heading: string;
  content: string;
  flags: SectionFlags;
}

export interface Template {
  id: string;
  name: string;
  sections: { heading: string }[];
  isDefault?: boolean;
}

export interface EntryFlags {
  isImportant: boolean;
  needsReview: boolean;
  isMajorEvent: boolean;
}

export interface SectionFlags {
  isImportant: boolean;
  needsReview: boolean;
  isMajorEvent: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  defaultTemplateId: string;
  encryptionKey?: CryptoKey;
}