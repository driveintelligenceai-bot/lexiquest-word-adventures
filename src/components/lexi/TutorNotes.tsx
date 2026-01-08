import React, { useState } from 'react';
import { StickyNote, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface TutorNotesProps {
  notes: Record<string, string>;
  currentStep: string;
  onSave: (stepId: string, note: string) => void;
  onDelete: (stepId: string) => void;
}

export const TutorNotes: React.FC<TutorNotesProps> = ({
  notes,
  currentStep,
  onSave,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingNote, setEditingNote] = useState(notes[currentStep] || '');

  const handleSave = () => {
    if (editingNote.trim()) {
      onSave(currentStep, editingNote.trim());
    }
  };

  const handleDelete = () => {
    setEditingNote('');
    onDelete(currentStep);
  };

  // Update editing note when step changes
  React.useEffect(() => {
    setEditingNote(notes[currentStep] || '');
  }, [currentStep, notes]);

  return (
    <div className="tutor-card p-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <StickyNote className="text-accent" size={20} />
          <h2 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
            Session Notes
          </h2>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div className="space-y-4 animate-fade-in">
          {/* Current Step Label */}
          <div className="text-xs text-muted-foreground">
            Notes for <span className="font-bold text-primary">Step {currentStep}</span>
          </div>

          {/* Note Textarea */}
          <textarea
            value={editingNote}
            onChange={(e) => setEditingNote(e.target.value)}
            placeholder="Add notes about this lesson, observations, areas to focus on..."
            className="w-full h-32 p-4 bg-tutor-card/60 border border-primary/10 rounded-xl text-sm text-primary-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/30 transition-colors"
          />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!editingNote.trim()}
              className={`flex-1 h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                editingNote.trim()
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-tutor-card/60 text-muted-foreground cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              Save Note
            </button>
            {notes[currentStep] && (
              <button
                onClick={handleDelete}
                className="h-11 px-4 bg-destructive/20 text-destructive rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-destructive/30 transition-colors active:scale-95"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Saved Notes Count */}
          {Object.keys(notes).length > 0 && (
            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-primary/10">
              {Object.keys(notes).length} saved note{Object.keys(notes).length !== 1 ? 's' : ''} across all steps
            </div>
          )}
        </div>
      )}
    </div>
  );
};
