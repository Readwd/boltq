import React from 'react';
import { Shield, AlertTriangle, TrendingDown, Lock } from 'lucide-react';
import type { RiskSettings } from '../App';

interface RiskManagementProps {
  settings: RiskSettings;
  onSettingsChange: (settings: RiskSettings) => void;
  dailyPnL: number;
}

export function RiskManagement({ settings, onSettingsChange, dailyPnL }: RiskManagementProps) {
  const handleSettingChange = (key: keyof RiskSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const isRiskLimitReached = dailyPnL <= -settings.maxDailyLoss;
  const riskPercentage = Math.abs(dailyPnL) / settings.maxDailyLoss * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Risk Status Overview */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-orange-500/20 p-3 rounded-lg">
            <Shield className="text-orange-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Risk Management</h2>
            <p className="text-purple-200">Configure your trading risk parameters</p>
          </div>
        </div>

        {/* Daily Loss Monitor */}
        <div className={`p-4 rounded-lg mb-6 ${
          isRiskLimitReached 
            ? 'bg-red-500/20 border border-red-500/30' 
            : riskPercentage > 75
            ? 'bg-yellow-500/20 border border-yellow-500/30'
            : 'bg-green-500/20 border border-green-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isRiskLimitReached ? (
                <Lock className="text-red-400" size={20} />
              ) : riskPercentage > 75 ? (
                <AlertTriangle className="text-yellow-400" size={20} />
              ) : (
                <Shield className="text-green-400" size={20} />
              )}
              <span className={`font-medium ${
                isRiskLimitReached 
                  ? 'text-red-400' 
                  : riskPercentage > 75 
                  ? 'text-yellow-400'
                  : 'text-green-400'
              }`}>
                {isRiskLimitReached 
                  ? 'Trading Stopped - Daily Loss Limit Reached'
                  : riskPercentage > 75
                  ? 'Warning - Approaching Daily Loss Limit'
                  : 'Risk Level Normal'
                }
              </span>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-semibold ${dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${dailyPnL.toFixed(2)}
              </div>
              <div className="text-sm text-purple-300">
                Limit: -${settings.maxDailyLoss}
              </div>
            </div>
          </div>
          
          {dailyPnL < 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-purple-300 mb-1">
                <span>Daily Loss Progress</span>
                <span>{Math.min(riskPercentage, 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    riskPercentage > 90 ? 'bg-red-500' :
                    riskPercentage > 75 ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(riskPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Risk Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trading Limits */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Trading Limits</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Maximum Daily Loss ($)
              </label>
              <input
                type="number"
                value={settings.maxDailyLoss}
                onChange={(e) => handleSettingChange('maxDailyLoss', Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                min="1"
                step="1"
              />
              <p className="text-xs text-purple-300 mt-1">
                Trading will stop when daily losses reach this amount
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Maximum Trade Amount ($)
              </label>
              <input
                type="number"
                value={settings.maxTradeAmount}
                onChange={(e) => handleSettingChange('maxTradeAmount', Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                min="1"
                step="1"
              />
              <p className="text-xs text-purple-300 mt-1">
                Maximum amount per individual trade
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Stop Loss Percentage (%)
              </label>
              <input
                type="number"
                value={settings.stopLossPercentage}
                onChange={(e) => handleSettingChange('stopLossPercentage', Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                min="1"
                max="50"
                step="1"
              />
              <p className="text-xs text-purple-300 mt-1">
                Stop trading after losing this percentage of balance
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Maximum Consecutive Losses
              </label>
              <input
                type="number"
                value={settings.maxConsecutiveLosses}
                onChange={(e) => handleSettingChange('maxConsecutiveLosses', Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                min="1"
                max="10"
                step="1"
              />
              <p className="text-xs text-purple-300 mt-1">
                Stop trading after this many consecutive losses
              </p>
            </div>
          </div>
        </div>

        {/* Auto-Trading Controls */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Auto-Trading Controls</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="font-medium text-white">Enable Auto-Trading</div>
                <p className="text-sm text-purple-300">
                  Automatically execute trades from Telegram signals
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAutoTrading}
                  onChange={(e) => handleSettingChange('enableAutoTrading', e.target.checked)}
                  className="sr-only peer"
                  disabled={isRiskLimitReached}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {isRiskLimitReached && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="text-red-400" size={16} />
                  <span className="text-red-400 font-medium">Auto-trading disabled</span>
                </div>
                <p className="text-red-300 text-sm mt-1">
                  Daily loss limit has been reached. Reset tomorrow or adjust limits.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-white">Risk Warnings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2 text-yellow-400">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Automated trading carries significant financial risk</span>
                </div>
                <div className="flex items-start space-x-2 text-yellow-400">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Past performance does not guarantee future results</span>
                </div>
                <div className="flex items-start space-x-2 text-yellow-400">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Only invest what you can afford to lose</span>
                </div>
                <div className="flex items-start space-x-2 text-yellow-400">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Always test with demo accounts first</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleSettingChange('maxDailyLoss', 100);
                handleSettingChange('maxTradeAmount', 10);
                handleSettingChange('stopLossPercentage', 5);
                handleSettingChange('maxConsecutiveLosses', 3);
                handleSettingChange('enableAutoTrading', false);
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Reset to Default Settings
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-red-400 mb-4">Emergency Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleSettingChange('enableAutoTrading', false)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <AlertTriangle size={16} />
            <span>Stop All Auto-Trading</span>
          </button>
          
          <button
            onClick={() => {
              // In a real implementation, this would close all open positions
              alert('All open positions closed (Demo Mode)');
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <TrendingDown size={16} />
            <span>Close All Positions</span>
          </button>
        </div>
        
        <p className="text-red-300 text-sm mt-4">
          Use these controls only in emergency situations. All automated trading will be stopped immediately.
        </p>
      </div>
    </div>
  );
}