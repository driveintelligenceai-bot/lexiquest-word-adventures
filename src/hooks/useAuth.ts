import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'parent' | 'student' | null;

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole;
  loading: boolean;
  studentId: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    loading: true,
    studentId: null,
  });

  // Fetch user role from database
  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole> => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      return (data?.role as UserRole) || null;
    } catch {
      return null;
    }
  }, []);

  // Fetch student ID if user is a student
  const fetchStudentId = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const { data } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      return data?.id || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          const studentId = role === 'student' ? await fetchStudentId(session.user.id) : null;
          
          setAuthState({
            user: session.user,
            session,
            role,
            loading: false,
            studentId,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            role: null,
            loading: false,
            studentId: null,
          });
        }
      }
    );

    // THEN check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        const studentId = role === 'student' ? await fetchStudentId(session.user.id) : null;
        
        setAuthState({
          user: session.user,
          session,
          role,
          loading: false,
          studentId,
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRole, fetchStudentId]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const createStudentProfile = useCallback(async (
    characterName: string,
    avatarEmoji: string,
    parentUserId?: string
  ): Promise<string | null> => {
    if (!authState.user) return null;

    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          user_id: authState.user.id,
          character_name: characterName,
          avatar_emoji: avatarEmoji,
          parent_user_id: parentUserId,
        })
        .select('id')
        .single();

      if (error) throw error;
      
      setAuthState(prev => ({ ...prev, studentId: data.id }));
      return data.id;
    } catch (error) {
      console.error('Error creating student profile:', error);
      return null;
    }
  }, [authState.user]);

  return {
    ...authState,
    signOut,
    createStudentProfile,
    isAuthenticated: !!authState.user,
    isParent: authState.role === 'parent',
    isStudent: authState.role === 'student',
  };
}
