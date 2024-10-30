import React, { useState } from 'react';
import { Plus, BookOpen, Layout } from 'lucide-react';
import useStore from '../store/diaryStore';
import { EntryList } from './EntryList';
import { EntryEditor } from './EntryEditor';
import { SearchBar } from './SearchBar';
import { TemplateManager } from './TemplateManager';
import { EncryptionSetup } from './EncryptionSetup';
import type { DiaryEntry } from '../types/diary';

function Dashboard() {
  const { entries } = useStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | undefined>();
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>(entries);
  const [activeTab, setActiveTab] = useState<'entries' | 'templates'>('entries');

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setIsEditorOpen(true);
  };

  const handleNewEntry = () => {
    setEditingEntry(undefined);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingEntry(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('entries')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'entries'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Entries
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'templates'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            Templates
          </button>
        </div>
        {activeTab === 'entries' && (
          <button
            onClick={handleNewEntry}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        )}
      </div>

      <EncryptionSetup />

      {activeTab === 'entries' && (
        <>
          <SearchBar onResultsChange={setFilteredEntries} />

          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No entries found</h3>
              <p className="mt-2 text-gray-500">
                {entries.length === 0
                  ? "Start writing your first diary entry"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            <EntryList entries={filteredEntries} onEditEntry={handleEditEntry} />
          )}
        </>
      )}

      {activeTab === 'templates' && <TemplateManager />}

      {isEditorOpen && (
        <EntryEditor
          onClose={handleCloseEditor}
          initialEntry={editingEntry}
        />
      )}
    </div>
  );
}

export default Dashboard;