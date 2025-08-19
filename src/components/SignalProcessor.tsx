import React, { useState, useEffect } from 'react';
import { Radio, TrendingUp, TrendingDown, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import type { Trade, RiskSettings } from '../App';

interface SignalProcessorProps {
  onAddTrade: (trade: Omit<Trade, 'id' | 'timestamp' | 'status'>) => void;
  riskSettings: RiskSettings;
}

interface Signal {
  id: string;
  timestamp: Date;
  raw: string;
  pair: string;
  direction: 'CALL' | 'PUT';
  duration: number;
  amount: number;
  processed: boolean;
  valid: boolean;
  error?: string;
}

export function SignalProcessor({ onAddTrade, riskSettings }: SignalProcessorProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Simulate receiving signals
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      // Simulate random signals
      const pairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'];
      const directions = ['CALL', 'PUT'];
      const durations = [60, 300, 900];
      const amounts = [5, 10, 15, 20, 25];

      const rawSignal = `${pairs[Math.floor(Math.random() * pairs.length)]} ${
        directions[Math.floor(Math.random() * directions.length)]
      } ${durations[Math.floor(Math.random() * durations.length)]}s $${
        amounts[Math.floor(Math.random() * amounts.length)]
      }`;

      const newSignal = processSignal(rawSignal);
      setSignals(prev => [newSignal, ...prev.slice(0, 19)]);

      // Auto-execute if valid and auto-trading is enabled
      if (newSignal.valid && riskSettings.enableAutoTrading) {
        setTimeout(() => {
          onAddTrade({
            pair: newSignal.pair,
            direction: newSignal.direction,
            amount: newSignal.amount,
            duration: newSignal.duration,
            signal: `Telegram: ${newSignal.raw}`
          });
          
          setSignals(prev => prev.map(s => 
            s.id === newSignal.id ? { ...s, processed: true } : s
          ));
        }, 1000);
      }
    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds

    return () => clearInterval(interval);
  }, [isListening, onAddTrade, riskSettings.enableAutoTrading]);

  const processSignal = (raw: string): Signal => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const timestamp = new Date();
    
    try {
      // Parse signal format: "EURUSD CALL 60s $10"
      const parts = raw.trim().split(' ');
      
      if (parts.length !== 4) {
        throw new Error('Invalid signal format');
      }

      const pair = parts[0].replace('/', '');
      const direction = parts[1].toUpperCase();
      const durationStr = parts[2];
      const amountStr = parts[3];

      if (!['CALL', 'PUT'].includes(direction)) {
        throw new Error('Invalid direction');
      }

      const duration = parseInt(durationStr.replace('s', ''));
      const amount = parseFloat(amountStr.replace('$', ''));

      if (isNaN(duration) || isNaN(amount)) {
        throw new Error('Invalid duration or amount');
      }

      if (amount > riskSettings.maxTradeAmount) {
        throw new Error(`Amount exceeds maximum trade limit ($${riskSettings.maxTradeAmount})`);
      }

      return {
        id,
        timestamp,
        raw,
        pair: pair.replace(/([A-Z]{3})([A-Z]{3})/, '$1/$2'),
        direction: direction as 'CALL' | 'PUT',
        duration,
        amount,
        processed: false,
        valid: true
      };
    } catch (error) {
      return {
        id,
        timestamp,
        raw,
        pair: '',
        direction: 'CALL',
        duration: 0,
        amount: 0,
        processed: false,
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const handleManualProcess = (signal: Signal) => {
    if (!signal.valid) return;

    onAddTrade({
      pair: signal.pair,
      direction: signal.direction,
      amount: signal.amount,
      duration: signal.duration,
      signal: `Manual: ${signal.raw}`
    });

    setSignals(prev => prev.map(s => 
      s.id === signal.id ? { ...s, processed: true } : s
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${isListening ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
              <Radio className={isListening ? 'text-green-400' : 'text-gray-400'} size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Signal Processor</h2>
              <p className="text-purple-200">
                {isListening ? 'Listening for signals...' : 'Signal processing stopped'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsListening(!isListening)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>

        {riskSettings.enableAutoTrading && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-green-400" size={16} />
              <span className="text-green-400 font-medium">Auto-trading enabled</span>
            </div>
          </div>
        )}
      </div>

      {/* Signals List */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Signals</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {signals.length === 0 ? (
            <div className="text-center py-8">
              <Radio className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-purple-300">
                {isListening ? 'Waiting for signals...' : 'Start listening to receive signals'}
              </p>
            </div>
          ) : (
            signals.map((signal) => (
              <div
                key={signal.id}
                className={`border rounded-lg p-4 ${
                  signal.valid
                    ? signal.processed
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-white/5 border-white/10'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-mono text-sm text-purple-200 bg-slate-800 px-2 py-1 rounded">
                        {signal.raw}
                      </span>
                      {signal.processed && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          EXECUTED
                        </span>
                      )}
                    </div>
                    
                    {signal.valid ? (
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <span className="text-purple-300">Pair:</span>
                          <span className="text-white font-medium">{signal.pair}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {signal.direction === 'CALL' ? (
                            <TrendingUp className="text-green-400" size={16} />
                          ) : (
                            <TrendingDown className="text-red-400" size={16} />
                          )}
                          <span className={signal.direction === 'CALL' ? 'text-green-400' : 'text-red-400'}>
                            {signal.direction}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="text-blue-400" size={16} />
                          <span className="text-blue-400">{signal.duration}s</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <DollarSign className="text-yellow-400" size={16} />
                          <span className="text-yellow-400">${signal.amount}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-red-400">
                        <AlertTriangle size={16} />
                        <span>{signal.error}</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-purple-400 mt-2">
                      {signal.timestamp.toLocaleString()}
                    </div>
                  </div>
                  
                  {signal.valid && !signal.processed && !riskSettings.enableAutoTrading && (
                    <button
                      onClick={() => handleManualProcess(signal)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Execute Trade
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}