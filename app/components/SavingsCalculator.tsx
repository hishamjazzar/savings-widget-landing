'use client';

import { useState, useEffect } from 'react';

export default function SavingsCalculator() {
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
    'border border-green-400 text-green-400 bg-black hover:bg-green-400 hover:text-black px-2 py-1 rounded';
  const valueBox = 'text-white text-sm px-3 py-1 border border-green-400 rounded';
  const sliderClass =
    'w-full appearance-none h-1 bg-white rounded outline-none cursor-pointer';

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 bg-black text-white rounded-lg shadow-lg border border-zinc-700">
      <h2 className="text-center text-xl font-bold">See How Much You Can Save</h2>

      {/* Trade Count Control */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Number of Trades per Month</h3>
        <div className="flex items-center justify-center gap-4">
          <button className={buttonClass} onClick={() => setTrades(t => Math.max(1, t - 1))}>–</button>
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
          className={sliderClass}
          style={{ accentColor: '#22c55e' }}
        />
      </div>

      {/* Monthly Volume Control */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Average Monthly Trade Value (EGP)</h3>
        <div className="flex items-center justify-center gap-4">
          <button className={buttonClass} onClick={() => setMonthlyTradeValue(v => Math.max(10000, v - 10000))}>–</button>
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
          className={sliderClass}
          style={{ accentColor: '#22c55e' }}
        />
      </div>

      {savings !== null && (
        <div className="text-center text-xl font-semibold">
          You save <span className="text-green-400">EGP {savings.toLocaleString()}</span> per year 🎉
        </div>
      )}
    </div>
  );
}
