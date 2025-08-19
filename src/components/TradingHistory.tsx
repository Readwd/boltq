import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Filter, Search } from 'lucide-react';
import type { Trade } from '../App';

interface TradingHistoryProps {
  trades: Trade[];
}

export function TradingHistory({ trades }: TradingHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'won' | 'lost' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredTrades = trades.filter(trade => {
    const matchesFilter = filter === 'all' || trade.status === filter;
    const matchesSearch = trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.signal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || 
                       trade.timestamp.toISOString().split('T')[0] === dateFilter;
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const stats = {
    totalTrades: trades.length,
    wonTrades: trades.filter(t => t.status === 'won').length,
    lostTrades: trades.filter(t => t.status === 'lost').length,
    pendingTrades: trades.filter(t => t.status === 'pending').length,
    totalProfit: trades.reduce((sum, t) => {
      if (t.status === 'won') return sum + (t.payout! - t.amount);
      if (t.status === 'lost') return sum - t.amount;
      return sum;
    }, 0),
    winRate: trades.filter(t => t.status !== 'pending').length > 0 
      ? (trades.filter(t => t.status === 'won').length / trades.filter(t => t.status !== 'pending').length * 100)
      : 0
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total Trades</p>
              <p className="text-2xl font-bold text-white">{stats.totalTrades}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Calendar className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-white">{stats.winRate.toFixed(1)}%</p>
              <p className="text-sm text-purple-300">{stats.wonTrades}W / {stats.lostTrades}L</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <TrendingUp className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total P&L</p>
              <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
              </p>
            </div>
            <div className={`${stats.totalProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} p-3 rounded-lg`}>
              {stats.totalProfit >= 0 ? (
                <TrendingUp className="text-green-400" size={24} />
              ) : (
                <TrendingDown className="text-red-400" size={24} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pendingTrades}</p>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Calendar className="text-yellow-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="text-purple-200" size={20} />
            <span className="text-purple-200 font-medium">Filters:</span>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Trades</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="pending">Pending</option>
          </select>

          <div className="flex items-center space-x-2">
            <Search className="text-purple-200" size={20} />
            <input
              type="text"
              placeholder="Search pair or signal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-300"
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          />

          <button
            onClick={() => {
              setFilter('all');
              setSearchTerm('');
              setDateFilter('');
            }}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Trading History ({filteredTrades.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 text-purple-200 font-medium">Time</th>
                <th className="text-left p-4 text-purple-200 font-medium">Pair</th>
                <th className="text-left p-4 text-purple-200 font-medium">Direction</th>
                <th className="text-left p-4 text-purple-200 font-medium">Amount</th>
                <th className="text-left p-4 text-purple-200 font-medium">Duration</th>
                <th className="text-left p-4 text-purple-200 font-medium">Signal</th>
                <th className="text-left p-4 text-purple-200 font-medium">Status</th>
                <th className="text-right p-4 text-purple-200 font-medium">P&L</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-purple-300">
                    No trades found matching your filters
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade, index) => (
                  <tr key={trade.id} className={`border-t border-white/10 ${index % 2 === 0 ? 'bg-white/2' : ''}`}>
                    <td className="p-4 text-white">
                      <div className="text-sm">
                        {trade.timestamp.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-purple-300">
                        {trade.timestamp.toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-white">{trade.pair}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {trade.direction === 'CALL' ? (
                          <TrendingUp className="text-green-400" size={16} />
                        ) : (
                          <TrendingDown className="text-red-400" size={16} />
                        )}
                        <span className={`font-medium ${
                          trade.direction === 'CALL' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.direction}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-white">${trade.amount}</td>
                    <td className="p-4 text-white">{trade.duration}s</td>
                    <td className="p-4">
                      <span className="text-purple-200 text-sm">{trade.signal}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trade.status === 'won'
                          ? 'bg-green-600 text-white'
                          : trade.status === 'lost'
                          ? 'bg-red-600 text-white'
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {trade.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {trade.status === 'pending' ? (
                        <span className="text-yellow-400">-</span>
                      ) : (
                        <span className={`font-medium ${
                          trade.status === 'won' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trade.status === 'won' ? '+' : '-'}${
                            trade.status === 'won' 
                              ? (trade.payout! - trade.amount).toFixed(2)
                              : trade.amount.toFixed(2)
                          }
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}