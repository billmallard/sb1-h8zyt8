import React from 'react';
import { format, parseISO } from 'date-fns';
import { Flag, AlertCircle, Star, Edit2 } from 'lucide-react';
import type { DiaryEntry } from '../../types/diary';

interface EntryListProps {
  entries: DiaryEntry[];
  onEditEntry: (entry: DiaryEntry) => void;
}

export function EntryList({ entries, onEditEntry }: EntryListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {entries.map(entry => (
        <div
          key={entry.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">
                {format(parseISO(entry.date), 'MMMM d, yyyy')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(parseISO(entry.updatedAt), 'h:mm a')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {entry.flags.isImportant && (
                <Star className="w-4 h-4 text-yellow-500" />
              )}
              {entry.flags.needsReview && (
                <AlertCircle className="w-4 h-4 text-blue-500" />
              )}
              {entry.flags.isMajorEvent && (
                <Flag className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            {entry.sections.map(section => (
              <div key={section.id} className="space-y-1">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-medium">{section.heading}</h4>
                  <div className="flex items-center gap-0.5">
                    {section.flags.isImportant && (
                      <Star className="w-3 h-3 text-yellow-500" />
                    )}
                    {section.flags.needsReview && (
                      <AlertCircle className="w-3 h-3 text-blue-500" />
                    )}
                    {section.flags.isMajorEvent && (
                      <Flag className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => onEditEntry(entry)}
            className="mt-4 w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Entry
          </button>
        </div>
      ))}
    </div>
  );
}