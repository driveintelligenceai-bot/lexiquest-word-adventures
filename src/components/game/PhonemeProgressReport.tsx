import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Star, 
  Volume2, Target, BookOpen, Lightbulb, ChevronRight 
} from 'lucide-react';
import { PHONEMES } from '@/data/phonemes';

interface PhonemePerformance {
  phoneme: string;
  phoneme_type: string;
  correct_count: number;
  incorrect_count: number;
  wilson_step: number;
}

interface PhonemeProgressReportProps {
  performances: PhonemePerformance[];
  childName: string;
  onPracticePhoneme?: (phoneme: string) => void;
  onSpeak?: (text: string) => void;
}

interface PhonemeStat {
  phoneme: string;
  type: string;
  accuracy: number;
  total: number;
  correct: number;
  incorrect: number;
  trend: 'improving' | 'declining' | 'stable' | 'new';
  keyword?: string;
  keywordEmoji?: string;
  mouthHint?: string;
}

export const PhonemeProgressReport: React.FC<PhonemeProgressReportProps> = ({
  performances,
  childName,
  onPracticePhoneme,
  onSpeak,
}) => {
  // Process performance data into stats
  const stats = useMemo((): PhonemeStat[] => {
    return performances.map(p => {
      const total = p.correct_count + p.incorrect_count;
      const accuracy = total > 0 ? (p.correct_count / total) * 100 : 0;
      const phonemeData = PHONEMES[p.phoneme] || PHONEMES[`${p.phoneme}_short`];
      
      // Determine trend based on accuracy
      let trend: 'improving' | 'declining' | 'stable' | 'new';
      if (total < 5) {
        trend = 'new';
      } else if (accuracy >= 80) {
        trend = 'improving';
      } else if (accuracy < 50) {
        trend = 'declining';
      } else {
        trend = 'stable';
      }
      
      return {
        phoneme: p.phoneme,
        type: p.phoneme_type,
        accuracy,
        total,
        correct: p.correct_count,
        incorrect: p.incorrect_count,
        trend,
        keyword: phonemeData?.keyword,
        keywordEmoji: phonemeData?.keywordEmoji,
        mouthHint: phonemeData?.mouthHint,
      };
    }).sort((a, b) => a.accuracy - b.accuracy); // Sort by accuracy (struggling first)
  }, [performances]);

  // Get struggling phonemes (accuracy < 70%)
  const strugglingPhonemes = stats.filter(s => s.accuracy < 70 && s.total >= 3);
  
  // Get mastered phonemes (accuracy >= 90%)
  const masteredPhonemes = stats.filter(s => s.accuracy >= 90 && s.total >= 5);
  
  // Get phonemes needing practice (between 70-90%)
  const practicingPhonemes = stats.filter(s => s.accuracy >= 70 && s.accuracy < 90 && s.total >= 3);

  // Generate actionable suggestions
  const suggestions = useMemo(() => {
    const suggestions: { title: string; description: string; phoneme?: string; priority: 'high' | 'medium' | 'low' }[] = [];
    
    strugglingPhonemes.slice(0, 3).forEach(p => {
      suggestions.push({
        title: `Practice "${p.phoneme}" sound`,
        description: p.mouthHint || `Focus on the ${p.keyword || p.phoneme} sound with multi-sensory activities.`,
        phoneme: p.phoneme,
        priority: 'high',
      });
    });

    if (strugglingPhonemes.some(p => ['b', 'd', 'p', 'q'].includes(p.phoneme))) {
      suggestions.push({
        title: 'Letter Flip Game',
        description: 'The b/d/p/q confusion is common! The Letter Flip game uses kinesthetic tracing to build muscle memory.',
        priority: 'high',
      });
    }

    if (strugglingPhonemes.length === 0 && masteredPhonemes.length > 5) {
      suggestions.push({
        title: 'Ready for next Wilson step!',
        description: `${childName} has mastered most phonemes at this level. Consider advancing to the next step!`,
        priority: 'medium',
      });
    }

    return suggestions;
  }, [strugglingPhonemes, masteredPhonemes, childName]);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-welded-text bg-welded/30 border-welded-border';
    if (accuracy >= 70) return 'text-primary bg-primary/20 border-primary/30';
    if (accuracy >= 50) return 'text-digraph-text bg-digraph/30 border-digraph-border';
    return 'text-vowel-text bg-vowel/30 border-vowel-border';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consonant': return 'bg-consonant text-consonant-text';
      case 'vowel': return 'bg-vowel text-vowel-text';
      case 'digraph': return 'bg-digraph text-digraph-text';
      case 'blend': return 'bg-welded text-welded-text';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-vowel/20 p-4 rounded-2xl border-2 border-vowel-border text-center"
        >
          <AlertTriangle className="mx-auto mb-2 text-vowel-text" size={24} />
          <div className="text-2xl font-black text-vowel-text">{strugglingPhonemes.length}</div>
          <div className="text-xs font-bold text-vowel-text/80">Need Help</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/20 p-4 rounded-2xl border-2 border-primary/30 text-center"
        >
          <Target className="mx-auto mb-2 text-primary" size={24} />
          <div className="text-2xl font-black text-primary">{practicingPhonemes.length}</div>
          <div className="text-xs font-bold text-primary/80">Practicing</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-welded/20 p-4 rounded-2xl border-2 border-welded-border text-center"
        >
          <Star className="mx-auto mb-2 text-welded-text fill-welded-text" size={24} />
          <div className="text-2xl font-black text-welded-text">{masteredPhonemes.length}</div>
          <div className="text-xs font-bold text-welded-text/80">Mastered</div>
        </motion.div>
      </div>

      {/* Priority Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card p-5 rounded-2xl border-2 border-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-accent" size={20} />
            <h3 className="font-bold text-foreground">Practice Suggestions</h3>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => suggestion.phoneme && onPracticePhoneme?.(suggestion.phoneme)}
                className={`w-full p-4 rounded-xl text-left flex items-center gap-3 transition-all active:scale-98 ${
                  suggestion.priority === 'high' 
                    ? 'bg-accent/10 border-2 border-accent/30 hover:border-accent' 
                    : 'bg-muted border-2 border-border hover:border-primary/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  suggestion.priority === 'high' ? 'bg-accent/20' : 'bg-primary/20'
                }`}>
                  {suggestion.priority === 'high' ? (
                    <AlertTriangle className="text-accent" size={20} />
                  ) : (
                    <BookOpen className="text-primary" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-foreground">{suggestion.title}</div>
                  <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                </div>
                {suggestion.phoneme && <ChevronRight className="text-muted-foreground" size={20} />}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Struggling Phonemes Detail */}
      {strugglingPhonemes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card p-5 rounded-2xl border-2 border-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="text-vowel-text" size={20} />
            <h3 className="font-bold text-foreground">Sounds Needing Practice</h3>
          </div>

          <div className="space-y-3">
            {strugglingPhonemes.map((phoneme, i) => (
              <div
                key={phoneme.phoneme}
                className="p-4 bg-muted rounded-xl flex items-center gap-4"
              >
                <button
                  onClick={() => onSpeak?.(phoneme.phoneme)}
                  className={`w-14 h-14 rounded-xl text-2xl font-black flex items-center justify-center border-2 ${getTypeColor(phoneme.type)}`}
                >
                  {phoneme.phoneme}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{phoneme.phoneme}</span>
                    {phoneme.keywordEmoji && (
                      <span className="text-lg">{phoneme.keywordEmoji}</span>
                    )}
                    <span className="text-sm text-muted-foreground">"{phoneme.keyword}"</span>
                  </div>
                  
                  {/* Accuracy bar */}
                  <div className="mt-2 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-vowel-border rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${phoneme.accuracy}%` }}
                      transition={{ delay: i * 0.1 }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {phoneme.correct}/{phoneme.total} correct
                    </span>
                    <span className={`text-xs font-bold ${phoneme.accuracy < 50 ? 'text-vowel-text' : 'text-digraph-text'}`}>
                      {Math.round(phoneme.accuracy)}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onPracticePhoneme?.(phoneme.phoneme)}
                  className="p-3 bg-accent text-accent-foreground rounded-xl font-bold text-sm active:scale-95 transition-transform"
                >
                  Practice
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mastered Phonemes */}
      {masteredPhonemes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card p-5 rounded-2xl border-2 border-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-welded-text" size={20} />
            <h3 className="font-bold text-foreground">Mastered Sounds 🎉</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {masteredPhonemes.map((phoneme) => (
              <div
                key={phoneme.phoneme}
                className="px-4 py-2 bg-welded/20 border-2 border-welded-border rounded-xl flex items-center gap-2"
              >
                <span className="font-bold text-welded-text">{phoneme.phoneme}</span>
                <Star className="text-welded-text fill-welded-text" size={14} />
                <span className="text-xs text-welded-text">{Math.round(phoneme.accuracy)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {stats.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-foreground mb-2">No data yet!</h3>
          <p className="text-muted-foreground">
            {childName} needs to complete some activities to generate progress reports.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PhonemeProgressReport;
