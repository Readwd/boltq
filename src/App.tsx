import React, { useState, useEffect } from 'react';
import { TradingDashboard } from './components/TradingDashboard';
import { TelegramConfig } from './components/TelegramConfig';
import { SignalProcessor } from './components/SignalProcessor';
import { TradingHistory } from './components/TradingHistory';
import { RiskManagement } from './components/RiskManagement';
import { Activity, TrendingUp, Settings, History, Shield } from 'lucide-react';

export interface Trade {
  id: string;
  timestamp: Date;
  pair: string;
  direction: 'CALL' | 'PUT';
  amount: number;
  duration: number;
  signal: string;
  status: 'pending' | 'won' | 'lost';
  payout?: number;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  isConnected: boolean;
}

export interface RiskSettings {
  maxDailyLoss: number;
  maxTradeAmount: number;
  stopLossPercentage: number;
  maxConsecutiveLosses: number;
  enableAutoTrading: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    botToken: '',
    chatId: '',
    isConnected: false
  });
  const [riskSettings, setRiskSettings] = useState<RiskSettings>({
    maxDailyLoss: 100,
    maxTradeAmount: 10,
    stopLossPercentage: 5,
    maxConsecutiveLosses: 3,
    enableAutoTrading: false
  });
  const [balance, setBalance] = useState(1000);
  const [dailyPnL, setDailyPnL] = useState(0);

  const addTrade = (trade: Omit<Trade, 'id' | 'timestamp' | 'status'>) => {
    const newTrade: Trade = {
      ...trade,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'pending'
    };
    setTrades(prev => [newTrade, ...prev]);
    
    // Simulate trade execution after 1-5 seconds
    setTimeout(() => {
      const isWin = Math.random() > 0.45; // 55% win rate simulation
      const payout = isWin ? trade.amount * 1.8 : 0;
      const profit = payout - trade.amount;
      
      setTrades(prev => prev.map(t => 
        t.id === newTrade.id 
          ? { ...t, status: isWin ? 'won' : 'lost', payout }
          : t
      ));
      
      setBalance(prev => prev + profit);
      setDailyPnL(prev => prev + profit);
    }, Math.random() * 4000 + 1000);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'signals', label: 'Signals', icon: TrendingUp },
    { id: 'telegram', label: 'Telegram', icon: Settings },
    { id: 'history', label: 'History', icon: History },
    { id: 'risk', label: 'Risk Management', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Quotex Trading Bot
              </h1>
              <p className="text-purple-200">
                Automated trading with Telegram signals integration
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                ${balance.toFixed(2)}
              </div>
              <div className={`text-sm ${dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                Daily P&L: {dailyPnL >= 0 ? '+' : ''}${dailyPnL.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-purple-200 hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <TradingDashboard 
              trades={trades}
              balance={balance}
              dailyPnL={dailyPnL}
              riskSettings={riskSettings}
              telegramConfig={telegramConfig}
              onAddTrade={addTrade}
            />
          )}
          
          {activeTab === 'signals' && (
            <SignalProcessor 
              onAddTrade={addTrade}
              riskSettings={riskSettings}
            />
          )}
          
          {activeTab === 'telegram' && (
            <TelegramConfig 
              config={telegramConfig}
              onConfigChange={setTelegramConfig}
            />
          )}
          
          {activeTab === 'history' && (
            <TradingHistory trades={trades} />
          )}
          
          {activeTab === 'risk' && (
            <RiskManagement 
              settings={riskSettings}
              onSettingsChange={setRiskSettings}
              dailyPnL={dailyPnL}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;