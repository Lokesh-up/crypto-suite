import { useState } from 'react';
import { MessageSquare, Volume2, Eye } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

const morseCodeMap: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

const reverseMorseMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([key, value]) => [value, key])
);

export default function MorsePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualSteps, setVisualSteps] = useState<Array<{char: string, morse: string, isUpperCase?: boolean}>>([]);
  const [caseSensitive, setCaseSensitive] = useState(true);

  const textToMorse = (text: string): string => {
    if (!caseSensitive) {
      return text
        .toUpperCase()
        .split('')
        .map(char => morseCodeMap[char] || char)
        .join(' ');
    }
    
    // Case-sensitive mode: add markers for case
    return text
      .split('')
      .map(char => {
        if (char === ' ') return '/';
        if (char.match(/[a-zA-Z]/)) {
          const upperChar = char.toUpperCase();
          const morse = morseCodeMap[upperChar];
          if (morse) {
            return char === upperChar ? morse : morse.toLowerCase();
          }
        }
        return morseCodeMap[char] || char;
      })
      .join(' ');
  };

  const morseToText = (morse: string): string => {
    if (!caseSensitive) {
      return morse
        .split(' ')
        .map(code => reverseMorseMap[code] || code)
        .join('');
    }
    
    // Case-sensitive mode: detect case from morse pattern
    return morse
      .split(' ')
      .map(code => {
        if (code === '/') return ' ';
        
        // Check if it's lowercase morse (all lowercase dots and dashes)
        if (code.match(/^[.\-]+$/) && code === code.toLowerCase() && code.includes('.')) {
          const upperMorse = code.toUpperCase();
          const letter = reverseMorseMap[upperMorse];
          return letter ? letter.toLowerCase() : code;
        }
        
        return reverseMorseMap[code] || code;
      })
      .join('');
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      setVisualSteps([]);
      return;
    }

    if (mode === 'encode') {
      const result = textToMorse(input);
      setOutput(result);
      
      // Create visualization steps with case information
      const steps = input.split('').map(char => {
        if (char === ' ') {
          return {
            char: '[SPACE]',
            morse: '/',
            isUpperCase: undefined
          };
        }
        
        const isUpperCase = char === char.toUpperCase();
        const upperChar = char.toUpperCase();
        let morse = morseCodeMap[upperChar] || char;
        
        if (caseSensitive && char.match(/[a-zA-Z]/) && morse !== char) {
          morse = isUpperCase ? morse : morse.toLowerCase();
        }
        
        return {
          char: char,
          morse: morse,
          isUpperCase: char.match(/[a-zA-Z]/) ? isUpperCase : undefined
        };
      });
      setVisualSteps(steps);
    } else {
      const result = morseToText(input);
      setOutput(result);
      
      // Create visualization steps for decoding
      const morseLetters = input.split(' ');
      const steps = morseLetters.map(morse => {
        if (morse === '/') {
          return {
            char: '[SPACE]',
            morse: '/',
            isUpperCase: undefined
          };
        }
        
        let char = reverseMorseMap[morse.toUpperCase()] || morse;
        let isUpperCase = undefined;
        
        if (caseSensitive && morse.match(/^[.\-]+$/)) {
          const isLowerMorse = morse === morse.toLowerCase() && morse.includes('.');
          if (char.match(/[A-Z]/) && isLowerMorse) {
            char = char.toLowerCase();
            isUpperCase = false;
          } else if (char.match(/[A-Z]/)) {
            isUpperCase = true;
          }
        }
        
        return {
          char: char,
          morse: morse,
          isUpperCase: isUpperCase
        };
      });
      setVisualSteps(steps);
    }
  };

  const playMorse = () => {
    // Simple audio feedback for demonstration
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const dotTime = 100;
    const dashTime = dotTime * 3;
    const gapTime = dotTime;
    
    let currentTime = context.currentTime;
    
    output.split(' ').forEach(letter => {
      if (letter === '/') {
        currentTime += dashTime * 2 / 1000; // Word gap
        return;
      }
      
      letter.split('').forEach(symbol => {
        if (symbol === '.') {
          const oscillator = context.createOscillator();
          oscillator.frequency.setValueAtTime(800, currentTime);
          oscillator.connect(context.destination);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + dotTime / 1000);
          currentTime += (dotTime + gapTime) / 1000;
        } else if (symbol === '-') {
          const oscillator = context.createOscillator();
          oscillator.frequency.setValueAtTime(800, currentTime);
          oscillator.connect(context.destination);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + dashTime / 1000);
          currentTime += (dashTime + gapTime) / 1000;
        }
      });
      currentTime += gapTime / 1000; // Letter gap
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 page-enter">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-crypto-blue to-crypto-cyan mb-4">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Morse Code Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert text to Morse code and vice versa. Now with case-sensitive conversion options.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium">Input</label>
              <div className="flex rounded-lg bg-muted/50 p-1">
                <button
                  onClick={() => setMode('encode')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'encode'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Text → Morse
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'decode'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Morse → Text
                </button>
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encode'
                  ? caseSensitive 
                    ? 'Enter text with mixed case (A=.-, a=.- in lowercase)...'
                    : 'Enter text to convert to Morse code...'
                  : caseSensitive
                    ? 'Enter Morse code (CAPS=.-, lowercase=.- for lowercase letters)...'
                    : 'Enter Morse code (use spaces between letters, / for word breaks)...'
              }
              className="w-full h-32 p-4 rounded-lg bg-muted/50 border border-border/50 focus:border-primary/50 focus:outline-none resize-none"
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Case Sensitivity</label>
                <div className="flex rounded-lg bg-muted/50 p-1">
                  <button
                    onClick={() => setCaseSensitive(false)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      !caseSensitive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Ignore Case
                  </button>
                  <button
                    onClick={() => setCaseSensitive(true)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      caseSensitive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Preserve Case
                  </button>
                </div>
              </div>
              
              {caseSensitive && (
                <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  <strong>Case Mode:</strong> UPPERCASE = normal morse, lowercase = lowercase morse dots/dashes
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConvert}
                className="crypto-button flex-1"
              >
                Convert
              </button>
              <button
                onClick={() => setShowVisualization(!showVisualization)}
                className="copy-button flex items-center space-x-2"
                disabled={!output}
              >
                <Eye className="h-4 w-4" />
                <span>Visualize</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium">Output</label>
              <div className="flex gap-2">
                {output && mode === 'encode' && (
                  <button
                    onClick={playMorse}
                    className="copy-button flex items-center space-x-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Play</span>
                  </button>
                )}
                <CopyButton text={output} />
              </div>
            </div>

            <div className="output-area">
              {output || (
                <span className="text-muted-foreground">
                  {mode === 'encode' 
                    ? 'Morse code will appear here...' 
                    : 'Converted text will appear here...'
                  }
                </span>
              )}
            </div>

            {showVisualization && visualSteps.length > 0 && (
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mb-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Step-by-Step {mode === 'encode' ? 'Encoding' : 'Decoding'}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {visualSteps.map((step, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">
                          {mode === 'encode' ? step.char : step.morse}
                        </span>
                        {caseSensitive && step.isUpperCase !== undefined && (
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            step.isUpperCase 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-secondary/20 text-secondary'
                          }`}>
                            {step.isUpperCase ? 'UPPER' : 'lower'}
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-mono text-primary">
                        {mode === 'encode' ? step.morse : step.char}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-2">Morse Code Reference:</p>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <span>A: .-</span>
                <span>B: -...</span>
                <span>C: -.-.</span>
                <span>S: ...</span>
                <span>O: ---</span>
                <span>S: ...</span>
              </div>
              <div className="mt-3 space-y-1 text-xs">
                <p>• Use "/" for word breaks in Morse code input</p>
                {caseSensitive && (
                  <>
                    <p>• <strong>Case Mode:</strong> UPPERCASE letters = normal morse</p>
                    <p>• lowercase letters = lowercase dots/dashes (.- becomes .-)</p>
                    <p>• Example: "Hello" → ".... . .-.. .-.. ---" vs "HeLLo" → ".... . .-.. .-.. ---"</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}