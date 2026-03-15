import { Link } from 'react-router-dom';
import { MessageSquare, Lock, Unlock } from 'lucide-react';

export default function Index() {
  return (
    <div className="container mx-auto px-4 py-12 page-enter">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Welcome to Crypto Suite
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore the fascinating world of cryptography with interactive tools for encoding, 
          encryption, and secure communication.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Morse Code Card */}
        <Link to="/morse" className="crypto-card morse group">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-8 w-8 text-white mr-3" />
            <h2 className="text-2xl font-bold text-white">Morse Code</h2>
          </div>
          <p className="text-white/90 mb-6 leading-relaxed">
            Convert text to Morse code and back. The classic communication method 
            used in telegraphs and emergency signals.
          </p>
          <div className="flex items-center text-white/80 text-sm">
            <span>• • • — — — • • •</span>
            <span className="ml-auto group-hover:translate-x-2 transition-transform">→</span>
          </div>
        </Link>

        {/* Symmetric Encryption Card */}
        <Link to="/symmetric" className="crypto-card symmetric group">
          <div className="flex items-center mb-4">
            <Lock className="h-8 w-8 text-white mr-3" />
            <h2 className="text-2xl font-bold text-white">Symmetric Encryption</h2>
          </div>
          <p className="text-white/90 mb-6 leading-relaxed">
            Encrypt and decrypt messages using symmetric algorithms like Caesar cipher. 
            Same key for both operations.
          </p>
          <div className="flex items-center text-white/80 text-sm">
            <span>Caesar • Shift • Secure</span>
            <span className="ml-auto group-hover:translate-x-2 transition-transform">→</span>
          </div>
        </Link>

        {/* Asymmetric Encryption Card */}
        <Link to="/asymmetric" className="crypto-card asymmetric group">
          <div className="flex items-center mb-4">
            <Unlock className="h-8 w-8 text-white mr-3" />
            <h2 className="text-2xl font-bold text-white">Asymmetric Encryption</h2>
          </div>
          <p className="text-white/90 mb-6 leading-relaxed">
            Explore public-key cryptography with RSA. Different keys for 
            encryption and decryption ensure secure communication.
          </p>
          <div className="flex items-center text-white/80 text-sm">
            <span>RSA • Public Key • Private Key</span>
            <span className="ml-auto group-hover:translate-x-2 transition-transform">→</span>
          </div>
        </Link>
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          Click on any card to start exploring that encryption method
        </p>
      </div>
    </div>
  );
}