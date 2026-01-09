import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ChevronRight, Eye, EyeOff, Sparkles, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'select' | 'login' | 'signup';
type UserType = 'child' | 'parent';

interface AuthPageProps {
  onSuccess: (userType: UserType) => void;
  onSkip?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onSkip }) => {
  const [mode, setMode] = useState<AuthMode>('select');
  const [userType, setUserType] = useState<UserType>('child');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      const detectedType = roleData?.role === 'parent' ? 'parent' : 'child';
      
      toast({
        title: "Welcome back! 🎉",
        description: `Logged in as ${data.user.email}`,
      });

      onSuccess(detectedType);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            display_name: displayName || email.split('@')[0],
            user_type: userType,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Assign role
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: userType === 'parent' ? 'parent' : 'student',
        });

        toast({
          title: "Account created! 🎉",
          description: "Welcome to Dyslexio Adventures!",
        });

        onSuccess(userType);
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-[100dvh] flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, hsl(215 70% 52%) 0%, hsl(215 75% 40%) 100%)',
      }}
    >
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['✨', '⭐', '📚', '🦉', '🌟'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              y: -50 
            }}
            animate={{ 
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 900,
            }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              repeat: Infinity,
              delay: i * 2 
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Role Selection */}
        {mode === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                className="text-6xl mb-4"
                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🦉
              </motion.div>
              <h1 className="text-2xl font-black text-foreground">Dyslexio Adventures</h1>
              <p className="text-muted-foreground mt-2">Who's playing today?</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => { setUserType('child'); setMode('login'); }}
                className="w-full p-6 bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 rounded-2xl flex items-center gap-4 transition-all active:scale-98"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-3xl">
                  🧒
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-lg text-foreground">I'm a Kid!</div>
                  <div className="text-sm text-muted-foreground">Start learning adventures</div>
                </div>
                <ChevronRight className="text-primary" />
              </button>

              <button
                onClick={() => { setUserType('parent'); setMode('login'); }}
                className="w-full p-6 bg-accent/10 hover:bg-accent/20 border-2 border-accent/30 rounded-2xl flex items-center gap-4 transition-all active:scale-98"
              >
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-3xl">
                  👨‍👩‍👧
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-lg text-foreground">I'm a Parent</div>
                  <div className="text-sm text-muted-foreground">Track progress & reward learning</div>
                </div>
                <ChevronRight className="text-accent" />
              </button>
            </div>

            {onSkip && (
              <button
                onClick={onSkip}
                className="w-full mt-6 p-3 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Continue without account →
              </button>
            )}
          </motion.div>
        )}

        {/* Login/Signup Form */}
        {(mode === 'login' || mode === 'signup') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl"
          >
            <button
              onClick={() => setMode('select')}
              className="text-muted-foreground hover:text-foreground mb-4 text-sm font-medium"
            >
              ← Back
            </button>

            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{userType === 'child' ? '🧒' : '👨‍👩‍👧'}</div>
              <h2 className="text-xl font-bold text-foreground">
                {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {userType === 'child' ? "Let's continue your adventure!" : "Track your child's progress"}
              </p>
            </div>

            <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    placeholder={userType === 'child' ? "Your name" : "Your name"}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-muted border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-14 pl-12 pr-4 bg-muted border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  style={{ fontSize: '16px' }}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-14 pl-12 pr-12 bg-muted border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  style={{ fontSize: '16px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    ⏳
                  </motion.div>
                ) : mode === 'login' ? (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Log In
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Log in"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
