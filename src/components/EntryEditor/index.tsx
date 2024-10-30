import React, { useState } from 'react';
import { format } from 'date-fns';
import { Save, X, Flag, AlertCircle, Star } from 'lucide-react';
import useStore from '../../store/diaryStore';
import type { DiaryEntry, DiarySection, Template } from '../../types/diary';
import { SectionEditor } from './SectionEditor';

interface EntryEditorProps {
  onClose: () => void;
  initialEntry?: DiaryEntry;
}

export function EntryEditor({ onClose, initialEntry }: EntryEditorProps) {
  const { templates, settings, addEntry, updateEntry } = useStore();
  const [template] = useState<Template>(() => 
    templates.find(t => t.id === (initialEntry?.templateId || settings.defaultTemplateId)) || templates[0]
  );

  const [entry, setEntry] = useState<DiaryEntry>(() => initialEntry || {
    id: crypto.randomUUID(),
    date: format(new Date(), 'yyyy-MM-dd'),
    sections: template.sections.map(s => ({
      id: crypto.randomUUID(),
      heading: s.heading,
      content: '',
      flags: { isImportant: false, needsReview: false, isMajorEvent: false }
    })),
    templateId: template.id,
    flags: { isImportant: false, needsReview: false, isMajorEvent: false },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleSave = async () => {
    const updatedEntry = {
      ...entry,
      updatedAt: new Date().toISOString()
    };
    
    if (initialEntry) {
      await updateEntry(updatedEntry);
    } else {
      await addEntry(updatedEntry);
    }
    onClose();
  };

  const updateSection = (sectionId: string, updates: Partial<DiarySection>) => {
    setEntry(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      )
    }));
  };

  const toggleEntryFlag = (flag: keyof typeof entry.flags) => {
    setEntry(prev => ({
      ...prev,
      flags: { ...prev.flags, [flag]: !prev.flags[flag] }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {initialEntry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleEntryFlag('isImportant')}
              className={`p-2 rounded-lg ${
                entry.flags.isImportant ? 'text-yellow-500' : 'text-gray-400'
              }`}
            >
              <Star className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleEntryFlag('needsReview')}
              className={`p-2 rounded-lg ${
                entry.flags.needsReview ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleEntryFlag('isMajorEvent')}
              className={`p-2 rounded-lg ${
                entry.flags.isMajorEvent ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <input
            type="date"
            value={entry.date}
            onChange={e => setEntry(prev => ({ ...prev, date: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
          
          {entry.sections.map(section => (
            <SectionEditor
              key={section.id}
              section={section}
              onChange={updates => updateSection(section.id, updates)}
            />
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}