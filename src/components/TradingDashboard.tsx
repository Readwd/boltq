import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Play, Pause, AlertTriangle } from 'lucide-react';
import type { Trade, RiskSettings, TelegramConfig } from '../App';

interface TradingDashboardProps {
  trades: Trade[];
  balance: number;
  dailyPnL: number;
  riskSettings: RiskSettings;
  telegramConfig: TelegramConfig;
  onAddTrade: (trade: Omit<Trade, 'id' | 'timestamp' | 'status'>) => void;
}

export function TradingDashboard({ 
  trades, 
  balance, 
  dailyPnL, 
  riskSettings, 
  telegramConfig,
  onAddTrade 
}: TradingDashboardProps) {
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [manualTrade, setManualTrade] = useState({
    pair: 'EUR/USD',
    direction: 'CALL' as 'CALL' | 'PUT',
    amount: 10,
    duration: 60
  });

  const recentTrades = trades.slice(0, 5);
  const todayWins = trades.filter(t => 
    t.timestamp.toDateString() === new Date().toDateString() && t.status === 'won'
  ).length;
  const todayLosses = trades.filter(t => 
    t.timestamp.toDateString() === new Date().toDateString() && t.status === 'lost'
  ).length;
  const winRate = todayWins + todayLosses > 0 ? (todayWins / (todayWins + todayLosses) * 100) : 0;

  const handleManualTrade = () => {
    onAddTrade({
      ...manualTrade,
      signal: 'Manual Trade'
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Balance</p>
              <p className="text-2xl font-bold text-white">${balance.toFixed(2)}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <TrendingUp className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Daily P&L</p>
              <p className={`text-2xl font-bold ${dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {dailyPnL >= 0 ? '+' : ''}${dailyPnL.toFixed(2)}
              </p>
            </div>
            <div className={`${dailyPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} p-3 rounded-lg`}>
              {dailyPnL >= 0 ? 
                <TrendingUp className="text-green-400" size={24} /> :
                <TrendingDown className="text-red-400" size={24} />
              }
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</p>
              <p className="text-sm text-purple-300">{todayWins}W / {todayLosses}L</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <TrendingUp className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Auto Trading</p>
              <p className={`text-lg font-semibold ${isAutoTrading ? 'text-green-400' : 'text-red-400'}`}>
                {isAutoTrading ? 'Active' : 'Inactive'}
              </p>
              <p className={`text-sm ${telegramConfig.isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                {telegramConfig.isConnected ? 'Telegram Connected' : 'Telegram Disconnected'}
              </p>
            </div>
            <button
              onClick={() => setIsAutoTrading(!isAutoTrading)}
              className={`p-3 rounded-lg transition-colors ${
                isAutoTrading ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}
            >
              {isAutoTrading ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Trading */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Manual Trading</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Currency Pair
              </label>
              <select
                value={manualTrade.pair}
                onChange={(e) => setManualTrade(prev => ({ ...prev, pair: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="EUR/USD">EUR/USD</option>
                <option value="GBP/USD">GBP/USD</option>
                <option value="USD/JPY">USD/JPY</option>
                <option value="AUD/USD">AUD/USD</option>
                <option value="USD/CAD">USD/CAD</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Direction
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setManualTrade(prev => ({ ...prev, direction: 'CALL' }))}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      manualTrade.direction === 'CALL'
                        ? 'bg-green-600 text-white'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    CALL
                  </button>
                  <button
                    onClick={() => setManualTrade(prev => ({ ...prev, direction: 'PUT' }))}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      manualTrade.direction === 'PUT'
                        ? 'bg-red-600 text-white'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    PUT
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={manualTrade.amount}
                  onChange={(e) => setManualTrade(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  min="1"
                  max={riskSettings.maxTradeAmount}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Duration (seconds)
              </label>
              <select
                value={manualTrade.duration}
                onChange={(e) => setManualTrade(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={900}>15 minutes</option>
                <option value={1800}>30 minutes</option>
                <option value={3600}>1 hour</option>
              </select>
            </div>

            <button
              onClick={handleManualTrade}
              disabled={manualTrade.amount > riskSettings.maxTradeAmount || manualTrade.amount > balance}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Place Trade
            </button>

            {manualTrade.amount > riskSettings.maxTradeAmount && (
              <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                <AlertTriangle size={16} />
                <span>Amount exceeds maximum trade limit (${riskSettings.maxTradeAmount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Trades</h3>
          
          <div className="space-y-3">
            {recentTrades.length === 0 ? (
              <p className="text-purple-300 text-center py-4">No trades yet</p>
            ) : (
              recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{trade.pair}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.direction === 'CALL'
                              ? 'bg-green-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {trade.direction}
                        </span>
                      </div>
                      <p className="text-sm text-purple-300">
                        ${trade.amount} • {trade.duration}s • {trade.signal}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          trade.status === 'won'
                            ? 'text-green-400'
                            : trade.status === 'lost'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        {trade.status === 'pending' ? 'Pending' : 
                         trade.status === 'won' ? `+$${(trade.payout! - trade.amount).toFixed(2)}` :
                         `-$${trade.amount.toFixed(2)}`}
                      </div>
                      <p className="text-xs text-purple-300">
                        {trade.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}