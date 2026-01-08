import React, { useState, useMemo } from 'react';
import { Shield, X } from 'lucide-react';

interface ParentGateProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const ParentGate: React.FC<ParentGateProps> = ({ onSuccess, onClose }) => {
  const [shake, setShake] = useState(false);
  
  // Generate a random math problem
  const { num1, num2, answer, options } = useMemo(() => {
    const n1 = Math.floor(Math.random() * 7) + 4; // 4-10
    const n2 = Math.floor(Math.random() * 7) + 4; // 4-10
    const ans = n1 + n2;
    
    // Generate wrong options around the answer
    const wrongOptions = new Set<number>();
    while (wrongOptions.size < 5) {
      const wrong = ans + Math.floor(Math.random() * 7) - 3;
      if (wrong !== ans && wrong > 0) wrongOptions.add(wrong);
    }
    
    const allOptions = [ans, ...Array.from(wrongOptions).slice(0, 5)];
    allOptions.sort(() => Math.random() - 0.5);
    
    return { num1: n1, num2: n2, answer: ans, options: allOptions };
  }, []);

  const handleAnswer = (selected: number) => {
    if (selected === answer) {
      onSuccess();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/95 p-4 backdrop-blur-sm animate-zoom-in">
      <div className={`max-w-xs w-full text-center ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        <Shield size={48} className="mx-auto mb-6 text-muted-foreground" />
        <h3 className="text-2xl font-bold mb-4 text-background">Guardian Check</h3>
        <p className="mb-6 text-muted-foreground font-mono text-xl">
          What is {num1} + {num2}?
        </p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {options.map((n) => (
            <button
              key={n}
              onClick={() => handleAnswer(n)}
              className="p-4 bg-background/10 rounded-xl text-xl font-bold text-background hover:bg-background/20 border border-background/10 active:scale-95 transition-transform"
            >
              {n}
            </button>
          ))}
        </div>
        <button 
          onClick={onClose} 
          className="text-muted-foreground underline hover:text-background transition-colors flex items-center gap-2 mx-auto"
        >
          <X size={16} /> Cancel
        </button>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};
