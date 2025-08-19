import React, { useState } from 'react';
import { MessageCircle, Check, X, AlertCircle, Copy } from 'lucide-react';
import type { TelegramConfig } from '../App';

interface TelegramConfigProps {
  config: TelegramConfig;
  onConfigChange: (config: TelegramConfig) => void;
}

export function TelegramConfig({ config, onConfigChange }: TelegramConfigProps) {
  const [formData, setFormData] = useState({
    botToken: config.botToken,
    chatId: config.chatId
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');

  const handleConnect = async () => {
    if (!formData.botToken || !formData.chatId) {
      setConnectionMessage('Please fill in both Bot Token and Chat ID');
      return;
    }

    setIsConnecting(true);
    setConnectionMessage('Connecting to Telegram...');

    // Simulate API connection
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        onConfigChange({
          ...formData,
          isConnected: true
        });
        setConnectionMessage('Successfully connected to Telegram!');
      } else {
        setConnectionMessage('Failed to connect. Please check your Bot Token and Chat ID.');
      }
      
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    onConfigChange({
      ...config,
      isConnected: false
    });
    setConnectionMessage('Disconnected from Telegram');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <MessageCircle className="text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Telegram Configuration</h2>
            <p className="text-purple-200">Connect your bot to receive trading signals</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className={`p-4 rounded-lg mb-6 ${
          config.isConnected 
            ? 'bg-green-500/20 border border-green-500/30' 
            : 'bg-red-500/20 border border-red-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {config.isConnected ? (
                <Check className="text-green-400" size={20} />
              ) : (
                <X className="text-red-400" size={20} />
              )}
              <span className={`font-medium ${config.isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {config.isConnected ? 'Connected to Telegram' : 'Not Connected'}
              </span>
            </div>
            
            {config.isConnected && (
              <button
                onClick={handleDisconnect}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>

        {/* Configuration Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Bot Token
            </label>
            <div className="flex space-x-2">
              <input
                type="password"
                value={formData.botToken}
                onChange={(e) => setFormData(prev => ({ ...prev, botToken: e.target.value }))}
                placeholder="Enter your Telegram Bot Token"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-300"
              />
              <button
                onClick={() => copyToClipboard(formData.botToken)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-purple-200 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
            <p className="text-sm text-purple-300 mt-1">
              Get this from @BotFather on Telegram
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Chat ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.chatId}
                onChange={(e) => setFormData(prev => ({ ...prev, chatId: e.target.value }))}
                placeholder="Enter your Chat ID"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-300"
              />
              <button
                onClick={() => copyToClipboard(formData.chatId)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-purple-200 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
            <p className="text-sm text-purple-300 mt-1">
              Get this from @userinfobot on Telegram
            </p>
          </div>

          {connectionMessage && (
            <div className="flex items-center space-x-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <AlertCircle className="text-blue-400" size={16} />
              <span className="text-blue-200 text-sm">{connectionMessage}</span>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isConnecting || config.isConnected}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Connecting...</span>
              </>
            ) : config.isConnected ? (
              <span>Connected</span>
            ) : (
              <span>Connect to Telegram</span>
            )}
          </button>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Setup Instructions</h3>
          <ol className="space-y-3 text-sm text-purple-200">
            <li className="flex space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">1</span>
              <span>Open Telegram and search for @BotFather</span>
            </li>
            <li className="flex space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">2</span>
              <span>Send /newbot command and follow instructions to create your bot</span>
            </li>
            <li className="flex space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">3</span>
              <span>Copy the Bot Token from @BotFather</span>
            </li>
            <li className="flex space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">4</span>
              <span>Search for @userinfobot and send /start to get your Chat ID</span>
            </li>
            <li className="flex space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">5</span>
              <span>Enter both values above and click Connect</span>
            </li>
          </ol>
        </div>

        {/* Signal Format */}
        <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Expected Signal Format</h3>
          <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400">EURUSD CALL 60s $10</div>
            <div className="text-red-400 mt-1">GBPUSD PUT 300s $25</div>
          </div>
          <p className="text-purple-300 text-sm mt-2">
            Format: PAIR DIRECTION DURATION AMOUNT
          </p>
        </div>
      </div>
    </div>
  );
}