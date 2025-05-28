'use client';

import { useState, useEffect } from 'react';

export default function SavingsWidget() {
  const [trades, setTrades] = useState(10);
  const [monthlyTradeValue, setMonthlyTradeValue] = useState(100000);
  const [savings, setSavings] = useState<number | null>(null);

  const yearlyMultiplier = 12;
  const feeRate = 0.0015;
  const baseSubFee = 250;

  useEffect(() => {
    const avgTradeValue = monthlyTradeValue / Math.max(trades, 1);
    const standardCost = monthlyTradeValue * yearlyMultiplier * feeRate;
    const extraVolume = Math.max(0, trades - 50) * avgTradeValue;
    const subscriptionCost =
      baseSubFee * yearlyMultiplier + extraVolume * yearlyMultiplier * feeRate;
    const userSavings = Math.max(0, Math.round(standardCost - subscriptionCost));
    setSavings(userSavings);
  }, [trades, monthlyTradeValue]);

  const buttonClass =
    'h-12 w-12 rounded-full border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-500 transition-all duration-200 flex items-center justify-center font-bold text-xl';
  const valueBox =
    'text-black text-lg font-semibold border-2 border-yellow-400 rounded-xl flex items-center justify-center bg-white shadow-sm px-4 py-2';
  const sliderClass =
    'w-full appearance-none h-2 bg-gray-200 rounded outline-none cursor-pointer';
  const thumbClass =
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-yellow-400';

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            How much could you be saving?
          </h2>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>Number of Trades per Month</h3>
          <div className="flex items-center justify-center gap-4">
            <button className={buttonClass} onClick={() => setTrades(t => Math.max(1, t - 1))}>−</button>
            <div className={valueBox}>{trades}</div>
            <button className={buttonClass} onClick={() => setTrades(t => Math.min(100, t + 1))}>+</button>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={trades}
            onChange={(e) => setTrades(parseInt(e.target.value))}
            className={`${sliderClass} ${thumbClass}`}
            style={{ accentColor: '#FFD700' }}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>Average Monthly Trade Value (EGP)</h3>
          <div className="flex items-center justify-center gap-4">
            <button className={buttonClass} onClick={() => setMonthlyTradeValue(v => Math.max(10000, v - 10000))}>−</button>
            <div className={valueBox}>{monthlyTradeValue.toLocaleString()}</div>
            <button className={buttonClass} onClick={() => setMonthlyTradeValue(v => Math.min(1000000, v + 10000))}>+</button>
          </div>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={monthlyTradeValue}
            onChange={(e) => setMonthlyTradeValue(parseInt(e.target.value))}
            className={`${sliderClass} ${thumbClass}`}
            style={{ accentColor: '#FFD700' }}
          />
        </div>

        {savings !== null && (
          <div className="text-center py-6">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
              <p className="text-lg md:text-xl font-bold text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                You save <span className="text-yellow-600">EGP {savings.toLocaleString()}</span> per year <span className="text-2xl">🤑</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
