import { create } from 'zustand';
import { openDB } from 'idb';
import type { DiaryEntry, Template, UserSettings } from '../types/diary';
import { encryptData, decryptData } from '../utils/encryption';

interface DiaryStore {
  entries: DiaryEntry[];
  templates: Template[];
  settings: UserSettings;
  initialized: boolean;
  initialize: () => Promise<void>;
  addEntry: (entry: DiaryEntry) => Promise<void>;
  updateEntry: (entry: DiaryEntry) => Promise<void>;
  addTemplate: (template: Template) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const useStore = create<DiaryStore>((set, get) => ({
  entries: [],
  templates: [],
  settings: {
    theme: 'light',
    defaultTemplateId: 'default'
  },
  initialized: false,

  initialize: async () => {
    const db = await openDB('diary-db', 1, {
      upgrade(db) {
        db.createObjectStore('entries');
        db.createObjectStore('templates');
        db.createObjectStore('settings');
      },
    });

    const templates = await db.get('templates', 'all') || [];
    const settings = await db.get('settings', 'user') || {
      theme: 'light',
      defaultTemplateId: 'default'
    };
    
    if (templates.length === 0) {
      const defaultTemplate: Template = {
        id: 'default',
        name: 'Daily Entry',
        sections: [
          { heading: 'Morning Thoughts' },
          { heading: 'Today\'s Goals' },
          { heading: 'Highlights' },
          { heading: 'Reflections' }
        ],
        isDefault: true
      };
      await db.put('templates', [defaultTemplate], 'all');
      templates.push(defaultTemplate);
    }

    set({ templates, settings, initialized: true });
  },

  addEntry: async (entry) => {
    const { settings } = get();
    const db = await openDB('diary-db', 1);
    
    if (settings.encryptionKey) {
      const encrypted = await encryptData(entry, settings.encryptionKey);
      await db.put('entries', encrypted, entry.id);
    } else {
      await db.put('entries', entry, entry.id);
    }

    set(state => ({
      entries: [...state.entries, entry]
    }));
  },

  updateEntry: async (entry) => {
    const { settings } = get();
    const db = await openDB('diary-db', 1);
    
    if (settings.encryptionKey) {
      const encrypted = await encryptData(entry, settings.encryptionKey);
      await db.put('entries', encrypted, entry.id);
    } else {
      await db.put('entries', entry, entry.id);
    }

    set(state => ({
      entries: state.entries.map(e => e.id === entry.id ? entry : e)
    }));
  },

  addTemplate: async (template) => {
    const db = await openDB('diary-db', 1);
    const templates = [...get().templates, template];
    await db.put('templates', templates, 'all');
    set({ templates });
  },

  updateSettings: async (newSettings) => {
    const db = await openDB('diary-db', 1);
    const settings = { ...get().settings, ...newSettings };
    await db.put('settings', settings, 'user');
    set({ settings });
  }
}));

export default useStore;