import React, { useState } from 'react';
import { Plus, Settings, X } from 'lucide-react';
import useStore from '../../store/diaryStore';
import { TemplateEditor } from './TemplateEditor';
import type { Template } from '../../types/diary';

export function TemplateManager() {
  const { templates } = useStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | undefined>();

  const handleNewTemplate = () => {
    setEditingTemplate(undefined);
    setIsEditorOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Templates</h3>
        <button
          onClick={handleNewTemplate}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map(template => (
          <div
            key={template.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {template.sections.length} sections
                </p>
              </div>
              {!template.isDefault && (
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-1">
              {template.sections.map((section, index) => (
                <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
                  • {section.heading}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isEditorOpen && (
        <TemplateEditor
          template={editingTemplate}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}