import React, { useState, useMemo } from 'react';
import { Shield, X } from 'lucide-react';

interface ParentGateProps {
  onSuccess: () => void;
  onClose: () => void;
  title?: string;
}

export const ParentGate: React.FC<ParentGateProps> = ({ 
  onSuccess, 
  onClose,
  title = "Tutor Access"
}) => {
  const [error, setError] = useState(false);

  const { num1, num2, answer, options } = useMemo(() => {
    const n1 = Math.floor(Math.random() * 6) + 5; // 5-10
    const n2 = Math.floor(Math.random() * 6) + 4; // 4-9
    const ans = n1 + n2;
    
    const wrongOptions = new Set<number>();
    while (wrongOptions.size < 5) {
      const wrong = ans + Math.floor(Math.random() * 6) - 3;
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
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-foreground/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className={`bg-card rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl ${error ? 'animate-shake' : ''}`}>
        <Shield size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="mb-6 text-muted-foreground font-mono text-lg">
          What is {num1} + {num2}?
        </p>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {options.map((n) => (
            <button
              key={n}
              onClick={() => handleAnswer(n)}
              className="p-3 bg-muted rounded-xl font-bold text-lg hover:bg-primary/10 border border-border transition-colors"
            >
              {n}
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground font-bold uppercase tracking-wider hover:text-foreground flex items-center gap-2 mx-auto"
        >
          <X size={16} /> Cancel
        </button>
      </div>
    </div>
  );
};
