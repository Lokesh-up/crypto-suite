import { useState } from 'react';
import { Lock, Key, Eye } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

export default function SymmetricPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualSteps, setVisualSteps] = useState<Array<{original: string, shifted: string, process: string}>>([]);

  const caesarCipher = (text: string, shiftAmount: number, encrypt: boolean): string => {
    const actualShift = encrypt ? shiftAmount : -shiftAmount;
    
    return text
      .split('')
      .map(char => {
        if (char.match(/[a-z]/i)) {
          const isUpperCase = char === char.toUpperCase();
          const charCode = char.toLowerCase().charCodeAt(0);
          const shifted = ((charCode - 97 + actualShift + 26) % 26) + 97;
          const result = String.fromCharCode(shifted);
          return isUpperCase ? result.toUpperCase() : result;
        }
        return char;
      })
      .join('');
  };

  const caesarCipherWithSteps = (text: string, shiftAmount: number, encrypt: boolean) => {
    const actualShift = encrypt ? shiftAmount : -shiftAmount;
    const steps: Array<{original: string, shifted: string, process: string}> = [];
    
    const result = text
      .split('')
      .map(char => {
        if (char.match(/[a-z]/i)) {
          const isUpperCase = char === char.toUpperCase();
          const charCode = char.toLowerCase().charCodeAt(0);
          const originalPos = charCode - 97;
          const shiftedPos = (originalPos + actualShift + 26) % 26;
          const shifted = ((charCode - 97 + actualShift + 26) % 26) + 97;
          const result = String.fromCharCode(shifted);
          const finalResult = isUpperCase ? result.toUpperCase() : result;
          
          steps.push({
            original: char,
            shifted: finalResult,
            process: `${char} (pos ${originalPos}) + ${actualShift} = ${finalResult} (pos ${shiftedPos})`
          });
          
          return finalResult;
        } else {
          steps.push({
            original: char,
            shifted: char,
            process: `${char} (unchanged)`
          });
          return char;
        }
      })
      .join('');
      
    return { result, steps };
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      setVisualSteps([]);
      return;
    }

    const { result, steps } = caesarCipherWithSteps(input, shift, mode === 'encrypt');
    setOutput(result);
    setVisualSteps(steps);
  };

  const generateRandomKey = () => {
    const randomShift = Math.floor(Math.random() * 25) + 1;
    setShift(randomShift);
  };

  return (
    <div className="container mx-auto px-4 py-12 page-enter">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-crypto-purple to-crypto-orange mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Symmetric Encryption
          </h1>
          <p className="text-lg text-muted-foreground">
            Encrypt and decrypt messages using the Caesar cipher algorithm.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium">Input</label>
              <div className="flex rounded-lg bg-muted/50 p-1">
                <button
                  onClick={() => setMode('encrypt')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'encrypt'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setMode('decrypt')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'decrypt'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Decrypt
                </button>
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'encrypt'
                  ? 'Enter text to encrypt...'
                  : 'Enter encrypted text to decrypt...'
              }
              className="w-full h-32 p-4 rounded-lg bg-muted/50 border border-border/50 focus:border-primary/50 focus:outline-none resize-none"
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Shift Amount: {shift}
                </label>
                <button
                  onClick={generateRandomKey}
                  className="copy-button text-xs"
                >
                  Random
                </button>
              </div>
              
              <input
                type="range"
                min="1"
                max="25"
                value={shift}
                onChange={(e) => setShift(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>13</span>
                <span>25</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConvert}
                className="crypto-button flex-1"
              >
                {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
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
              <CopyButton text={output} />
            </div>

            <div className="output-area">
              {output || (
                <span className="text-muted-foreground">
                  {mode === 'encrypt' 
                    ? 'Encrypted text will appear here...' 
                    : 'Decrypted text will appear here...'
                  }
                </span>
              )}
            </div>

            {showVisualization && visualSteps.length > 0 && (
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mb-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Caesar Cipher Process (Shift: {mode === 'encrypt' ? '+' : '-'}{shift})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {visualSteps.map((step, index) => (
                    <div key={index} className="p-2 bg-background/50 rounded text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-medium text-lg">
                          {step.original}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-mono text-primary font-medium text-lg">
                          {step.shifted}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {step.process}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-2">Caesar Cipher Info:</p>
              <ul className="space-y-1 text-xs">
                <li>• Each letter is shifted by a fixed amount</li>
                <li>• Same key is used for encryption and decryption</li>
                <li>• Numbers and special characters remain unchanged</li>
                <li>• Case is preserved (A→D, a→d with shift of 3)</li>
              </ul>
              <div className="mt-3 p-2 bg-background/50 rounded font-mono text-xs">
                <strong>Example (shift=3):</strong><br />
                Hello → Khoor
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}