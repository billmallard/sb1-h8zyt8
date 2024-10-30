import React, { useState } from 'react';
import { Plus, X, Save, Trash2 } from 'lucide-react';
import useStore from '../../store/diaryStore';
import type { Template } from '../../types/diary';

interface TemplateEditorProps {
  template?: Template;
  onClose: () => void;
}

export function TemplateEditor({ template, onClose }: TemplateEditorProps) {
  const { addTemplate } = useStore();
  const [name, setName] = useState(template?.name || '');
  const [sections, setSections] = useState(
    template?.sections || [{ heading: '' }]
  );

  const handleSave = () => {
    const newTemplate: Template = {
      id: template?.id || crypto.randomUUID(),
      name,
      sections: sections.filter(s => s.heading.trim() !== '')
    };
    addTemplate(newTemplate);
    onClose();
  };

  const addSection = () => {
    setSections([...sections, { heading: '' }]);
  };

  const updateSection = (index: number, heading: string) => {
    const newSections = [...sections];
    newSections[index] = { heading };
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            {template ? 'Edit Template' : 'New Template'}
          </h3>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Template Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="Daily Entry, Weekly Review, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sections</label>
            <div className="space-y-2">
              {sections.map((section, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={section.heading}
                    onChange={e => updateSection(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    placeholder="Section heading"
                  />
                  <button
                    onClick={() => removeSection(index)}
                    className="p-2 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addSection}
              className="mt-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-gray-400 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || sections.every(s => !s.heading.trim())}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}