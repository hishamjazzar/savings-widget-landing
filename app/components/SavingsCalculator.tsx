'use client';
import { useState, useEffect } from 'react';
export default function SavingsWidget() {
  const [trades, setTrades] = useState(10); // monthly trades
  const [avgTradeValue, setAvgTradeValue] = useState(100000); // value per trade
  const [savings, setSavings] = useState<number | null>(null);
  const yearlyMultiplier = 12;
  const feeRate = 0.001;
  const monthlySubFee = 245;
  useEffect(() => {
    const totalMonthlyTradeValue = avgTradeValue * trades;
    const standardCommission = totalMonthlyTradeValue * yearlyMultiplier * feeRate;
    const flatTradeFees = trades * 2 * yearlyMultiplier; // EGP 2 per trade
    const standardCost = standardCommission + flatTradeFees;
    const subscriptionCost = monthlySubFee * yearlyMultiplier;
    const userSavings = Math.max(0, Math.round(standardCost - subscriptionCost));
    setSavings(userSavings);
  }, [trades, avgTradeValue]);
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
        {savings !== null && (
          <div className="text-center space-y-1 mb-5">
            <div className="text-xl font-bold text-gray-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Annual Savings
            </div>
            <div className="flex justify-center items-end gap-1">
              <span className="text-3xl font-bold text-[#FFD700]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                EGP {savings.toLocaleString()}
              </span>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center space-y-10">
          {/* Trades per month */}
          <div className="space-y-6 w-full max-w-md mb-6">
            <h3 className="text-xl font-semibold text-gray-800 text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Your number of trades per month (on average)
            </h3>
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
          {/* Average trade value */}
          <div className="space-y-6 w-full max-w-md mb-1">
            <h3 className="text-xl font-semibold text-gray-800 text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Average traded value per trade
            </h3>
            <div className="flex items-center justify-center gap-4">
              <button className={buttonClass} onClick={() => setAvgTradeValue(v => Math.max(10000, v - 10000))}>−</button>
              <div className={valueBox}>EGP {avgTradeValue.toLocaleString()}</div>
              <button className={buttonClass} onClick={() => setAvgTradeValue(v => Math.min(1000000, v + 10000))}>+</button>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={avgTradeValue}
              onChange={(e) => setAvgTradeValue(parseInt(e.target.value))}
              className={`${sliderClass} ${thumbClass}`}
              style={{ accentColor: '#FFD700' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}