import { useState, useEffect } from 'react';
import { Unlock, KeyRound, Shield, Eye } from 'lucide-react';
import { CopyButton } from '../components/CopyButton';

// Simple RSA implementation for demonstration purposes
// NOTE: This is NOT cryptographically secure and is for educational purposes only
class SimpleRSA {
  private p: number;
  private q: number;
  public n: number;
  public e: number;
  public d: number;

  constructor() {
    // Use small primes for demonstration
    this.p = 61;
    this.q = 53;
    this.n = this.p * this.q;
    this.e = 17; // Common choice for e
    this.d = this.calculatePrivateKey();
  }

  private gcd(a: number, b: number): number {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  private modInverse(a: number, m: number): number {
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) {
        return x;
      }
    }
    return 1;
  }

  private calculatePrivateKey(): number {
    const phi = (this.p - 1) * (this.q - 1);
    return this.modInverse(this.e, phi);
  }

  private modPow(base: number, exp: number, mod: number): number {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  }

  encrypt(message: string): string {
    return message
      .split('')
      .map(char => {
        const charCode = char.charCodeAt(0);
        if (charCode > 255) return char; // Skip non-ASCII
        const encrypted = this.modPow(charCode, this.e, this.n);
        return encrypted.toString();
      })
      .join(' ');
  }

  encryptWithSteps(message: string): { result: string, steps: Array<{char: string, ascii: number, encrypted: number, calculation: string}> } {
    const steps: Array<{char: string, ascii: number, encrypted: number, calculation: string}> = [];
    
    const result = message
      .split('')
      .map(char => {
        const charCode = char.charCodeAt(0);
        if (charCode > 255) return char; // Skip non-ASCII
        const encrypted = this.modPow(charCode, this.e, this.n);
        
        steps.push({
          char: char,
          ascii: charCode,
          encrypted: encrypted,
          calculation: `${charCode}^${this.e} mod ${this.n} = ${encrypted}`
        });
        
        return encrypted.toString();
      })
      .join(' ');
      
    return { result, steps };
  }

  decrypt(encryptedMessage: string): string {
    return encryptedMessage
      .split(' ')
      .map(num => {
        const encrypted = parseInt(num);
        if (isNaN(encrypted)) return num;
        const decrypted = this.modPow(encrypted, this.d, this.n);
        return String.fromCharCode(decrypted);
      })
      .join('');
  }

  decryptWithSteps(encryptedMessage: string): { result: string, steps: Array<{encrypted: number, decrypted: number, char: string, calculation: string}> } {
    const steps: Array<{encrypted: number, decrypted: number, char: string, calculation: string}> = [];
    
    const result = encryptedMessage
      .split(' ')
      .map(num => {
        const encrypted = parseInt(num);
        if (isNaN(encrypted)) return num;
        const decrypted = this.modPow(encrypted, this.d, this.n);
        const char = String.fromCharCode(decrypted);
        
        steps.push({
          encrypted: encrypted,
          decrypted: decrypted,
          char: char,
          calculation: `${encrypted}^${this.d} mod ${this.n} = ${decrypted}`
        });
        
        return char;
      })
      .join('');
      
    return { result, steps };
  }

  getPublicKey(): string {
    return `(${this.e}, ${this.n})`;
  }

  getPrivateKey(): string {
    return `(${this.d}, ${this.n})`;
  }
}

export default function AsymmetricPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [rsa, setRsa] = useState<SimpleRSA | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualSteps, setVisualSteps] = useState<Array<any>>([]);

  useEffect(() => {
    setRsa(new SimpleRSA());
  }, []);

  const handleConvert = () => {
    if (!input.trim() || !rsa) {
      setOutput('');
      setVisualSteps([]);
      return;
    }

    try {
      if (mode === 'encrypt') {
        const { result, steps } = rsa.encryptWithSteps(input);
        setOutput(result);
        setVisualSteps(steps);
      } else {
        const { result, steps } = rsa.decryptWithSteps(input);
        setOutput(result);
        setVisualSteps(steps);
      }
    } catch (error) {
      setOutput('Error: Invalid input for decryption');
      setVisualSteps([]);
    }
  };

  const generateNewKeys = () => {
    setRsa(new SimpleRSA());
    setInput('');
    setOutput('');
    setVisualSteps([]);
  };

  return (
    <div className="container mx-auto px-4 py-12 page-enter">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-crypto-green to-crypto-blue mb-4">
            <Unlock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Asymmetric Encryption
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore RSA public-key cryptography with different keys for encryption and decryption.
          </p>
        </div>

        {/* Key Information */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-accent" />
              <span className="font-medium">Public Key (Encryption)</span>
            </div>
            <div className="font-mono text-sm bg-background/50 p-2 rounded">
              {rsa ? rsa.getPublicKey() : 'Generating...'}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <span className="font-medium">Private Key (Decryption)</span>
            </div>
            <div className="font-mono text-sm bg-background/50 p-2 rounded">
              {rsa ? rsa.getPrivateKey() : 'Generating...'}
            </div>
          </div>
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
                  ? 'Enter text to encrypt with public key...'
                  : 'Enter encrypted numbers (space-separated) to decrypt...'
              }
              className="w-full h-32 p-4 rounded-lg bg-muted/50 border border-border/50 focus:border-primary/50 focus:outline-none resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleConvert}
                className="crypto-button flex-1"
              >
                {mode === 'encrypt' ? 'Encrypt with Public Key' : 'Decrypt with Private Key'}
              </button>
              <button
                onClick={() => setShowVisualization(!showVisualization)}
                className="copy-button flex items-center space-x-2"
                disabled={!output}
              >
                <Eye className="h-4 w-4" />
                <span>Visualize</span>
              </button>
              <button
                onClick={generateNewKeys}
                className="copy-button"
              >
                New Keys
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
                    ? 'Encrypted numbers will appear here...' 
                    : 'Decrypted text will appear here...'
                  }
                </span>
              )}
            </div>

            {showVisualization && visualSteps.length > 0 && (
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mb-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  RSA {mode === 'encrypt' ? 'Encryption' : 'Decryption'} Process
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {visualSteps.map((step, index) => (
                    <div key={index} className="p-3 bg-background/50 rounded text-sm border border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-medium text-base">
                          {mode === 'encrypt' ? step.char : step.encrypted}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-mono text-primary font-medium text-base">
                          {mode === 'encrypt' ? step.encrypted : step.char}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {mode === 'encrypt' ? (
                          <>
                            <div>ASCII: {step.ascii}</div>
                            <div className="font-mono">{step.calculation}</div>
                          </>
                        ) : (
                          <>
                            <div>Decrypted ASCII: {step.decrypted}</div>
                            <div className="font-mono">{step.calculation}</div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-2">RSA Encryption Info:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Public Key:</strong> Used for encryption (can be shared)</li>
                <li>• <strong>Private Key:</strong> Used for decryption (keep secret)</li>
                <li>• Each character becomes a number when encrypted</li>
                <li>• This is a simplified demo - not cryptographically secure</li>
              </ul>
              <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
                <strong>⚠️ Educational Purpose Only:</strong><br />
                This RSA implementation uses small keys and is not secure for real use.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}