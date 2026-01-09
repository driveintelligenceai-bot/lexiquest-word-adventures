import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PhonemePerformance {
  phoneme: string;
  phoneme_type: string;
  correct_count: number;
  incorrect_count: number;
  wilson_step: number;
}

interface ActivityResult {
  activity_type: string;
  word?: string;
  phonemes_tested: string[];
  correct: boolean;
  time_seconds?: number;
  hints_used?: number;
}

export function usePhonemeTracking(studentId: string | null) {
  const [performances, setPerformances] = useState<PhonemePerformance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch phoneme performance data
  const fetchPerformances = useCallback(async () => {
    if (!studentId) {
      setPerformances([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('phoneme_performance')
        .select('*')
        .eq('student_id', studentId);

      if (error) throw error;
      setPerformances(data || []);
    } catch (error) {
      console.error('Error fetching phoneme performance:', error);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchPerformances();
  }, [fetchPerformances]);

  // Record a phoneme result (correct or incorrect)
  const recordPhonemeResult = useCallback(async (
    phoneme: string,
    phonemeType: string,
    correct: boolean,
    wilsonStep: number = 1
  ) => {
    if (!studentId) return;

    try {
      // Try to get existing record
      const { data: existing } = await supabase
        .from('phoneme_performance')
        .select('*')
        .eq('student_id', studentId)
        .eq('phoneme', phoneme)
        .maybeSingle();

      if (existing) {
        // Update existing record
        await supabase
          .from('phoneme_performance')
          .update({
            correct_count: correct ? existing.correct_count + 1 : existing.correct_count,
            incorrect_count: correct ? existing.incorrect_count : existing.incorrect_count + 1,
            last_practiced: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        // Insert new record
        await supabase
          .from('phoneme_performance')
          .insert({
            student_id: studentId,
            phoneme,
            phoneme_type: phonemeType,
            wilson_step: wilsonStep,
            correct_count: correct ? 1 : 0,
            incorrect_count: correct ? 0 : 1,
          });
      }

      // Refresh data
      fetchPerformances();
    } catch (error) {
      console.error('Error recording phoneme result:', error);
    }
  }, [studentId, fetchPerformances]);

  // Record an activity result with multiple phonemes
  const recordActivityResult = useCallback(async (result: ActivityResult) => {
    if (!studentId) return;

    try {
      // Insert activity result
      await supabase
        .from('activity_results')
        .insert({
          student_id: studentId,
          activity_type: result.activity_type,
          word: result.word,
          phonemes_tested: result.phonemes_tested,
          correct: result.correct,
          time_seconds: result.time_seconds,
          hints_used: result.hints_used,
        });

      // Update phoneme performance for each phoneme tested
      for (const phoneme of result.phonemes_tested) {
        const phonemeType = ['a', 'e', 'i', 'o', 'u'].includes(phoneme.toLowerCase()) 
          ? 'vowel' 
          : phoneme.length > 1 
            ? 'digraph' 
            : 'consonant';
        
        await recordPhonemeResult(phoneme, phonemeType, result.correct);
      }
    } catch (error) {
      console.error('Error recording activity result:', error);
    }
  }, [studentId, recordPhonemeResult]);

  // Get struggling phonemes (accuracy < 70%)
  const getStrugglingPhonemes = useCallback(() => {
    return performances.filter(p => {
      const total = p.correct_count + p.incorrect_count;
      const accuracy = total > 0 ? (p.correct_count / total) * 100 : 100;
      return accuracy < 70 && total >= 3;
    });
  }, [performances]);

  // Get mastered phonemes (accuracy >= 90%)
  const getMasteredPhonemes = useCallback(() => {
    return performances.filter(p => {
      const total = p.correct_count + p.incorrect_count;
      const accuracy = total > 0 ? (p.correct_count / total) * 100 : 0;
      return accuracy >= 90 && total >= 5;
    });
  }, [performances]);

  return {
    performances,
    loading,
    recordPhonemeResult,
    recordActivityResult,
    getStrugglingPhonemes,
    getMasteredPhonemes,
    refresh: fetchPerformances,
  };
}
