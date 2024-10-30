import React from 'react';
import { Flag, AlertCircle, Star } from 'lucide-react';
import type { DiarySection } from '../../types/diary';

interface SectionEditorProps {
  section: DiarySection;
  onChange: (updates: Partial<DiarySection>) => void;
}

export function SectionEditor({ section, onChange }: SectionEditorProps) {
  const toggleFlag = (flag: keyof typeof section.flags) => {
    onChange({
      flags: { ...section.flags, [flag]: !section.flags[flag] }
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{section.heading}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleFlag('isImportant')}
            className={`p-1 rounded-lg ${
              section.flags.isImportant ? 'text-yellow-500' : 'text-gray-400'
            }`}
          >
            <Star className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFlag('needsReview')}
            className={`p-1 rounded-lg ${
              section.flags.needsReview ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFlag('isMajorEvent')}
            className={`p-1 rounded-lg ${
              section.flags.isMajorEvent ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
      <textarea
        value={section.content}
        onChange={e => onChange({ content: e.target.value })}
        className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 resize-none"
        placeholder={`Write your ${section.heading.toLowerCase()}...`}
      />
    </div>
  );
}