'use client';
import { useState, useEffect } from 'react';

type SubscriptionType = 'none' | 'old';

export default function SavingsWidget() {
  const [trades, setTrades] = useState(10); // monthly trades
  const [avgTradeValue, setAvgTradeValue] = useState(100000); // value per trade
  const [savings, setSavings] = useState<number | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>('none');

  const yearlyMultiplier = 12;
  const feeRate = 0.001;
  const monthlySubFee = 245;
  const oldMonthlySubFee = 125;

  useEffect(() => {
    const totalMonthlyTradeValue = avgTradeValue * trades;
  
    // Standard cost (non-subscriber)
    const standardCommission = totalMonthlyTradeValue * yearlyMultiplier * feeRate;
    const flatTradeFees = trades * 2 * yearlyMultiplier;
    const standardCost = standardCommission + flatTradeFees;
  
    // Old subscription cost
    const oldSubscriptionFeeAnnual = oldMonthlySubFee * yearlyMultiplier;
    const oldSubscriberCommission = totalMonthlyTradeValue * yearlyMultiplier * feeRate;
    const oldSubscriberFlatFees = trades * 2 * yearlyMultiplier;
    const oldSubscriberCost = oldSubscriptionFeeAnnual + oldSubscriberCommission + oldSubscriberFlatFees;
  
    // New subscription cost
    const newSubscriptionFeeAnnual = monthlySubFee * yearlyMultiplier;
    let newSubscriberCost = newSubscriptionFeeAnnual;
  
    if (trades > 50) {
      const paidTrades = trades - 50;
      const paidTradeValue = avgTradeValue * paidTrades;
  
      const extraCommission = paidTradeValue * yearlyMultiplier * feeRate;
      const extraFlatFees = paidTrades * 2 * yearlyMultiplier;
  
      newSubscriberCost += extraCommission + extraFlatFees;
    }
  
    // Calculate relevant savings based on subscription type
    const userSavings = Math.max(0, Math.round(
      subscriptionType === 'old' 
        ? oldSubscriberCost - newSubscriberCost 
        : standardCost - newSubscriberCost
    ));
    
    setSavings(userSavings);
  }, [trades, avgTradeValue, subscriptionType]);
  
  const buttonClass = `
    h-7 w-7 rounded-full border border-[#FFD700] text-[#FFD700] 
    hover:bg-yellow-50 transition-all duration-200 
    flex items-center justify-center font-medium text-base bg-white
  `;
  const valueBox = `
    text-gray-600 text-lg font-medium border-[3px] border-[#FFD700] 
    rounded-full flex items-center justify-center bg-white 
    shadow-sm px-6 py-2 min-w-[140px]
  `;
  const sliderClass =
    'w-full appearance-none h-[3px] bg-gray-200 rounded outline-none cursor-pointer';
  const thumbClass = `
    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
    [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
    [&::-webkit-slider-thumb]:bg-[#FFD700] [&::-webkit-slider-thumb]:border-0 
    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm
  `;
  const toggleClass = `
    relative inline-flex items-center gap-2 bg-white rounded-full p-1 w-[340px] h-[52px] shadow-sm
    transition-colors duration-200 ease-in-out cursor-pointer
  `;
  const toggleButtonClass = `
    absolute ${subscriptionType === 'old' ? 'right-1' : 'left-1'}
    inline-block h-[44px] w-[164px] transform rounded-full bg-[#FFD700] shadow-sm
    transition duration-200 ease-in-out
  `;
  const toggleTextClass = `
    z-10 w-[164px] text-center text-sm transition-colors duration-200
  `;

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-xl p-8">
        {/* Subscription Toggle */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <button
            onClick={() => setSubscriptionType(subscriptionType === 'none' ? 'old' : 'none')}
            className={toggleClass}
            role="switch"
            aria-checked={subscriptionType === 'old'}
          >
            <span className={toggleButtonClass} />
            <span className={`${toggleTextClass} ${subscriptionType === 'none' ? 'text-white' : 'text-gray-600'}`}>
              Non-Subscriber
            </span>
            <span className={`${toggleTextClass} ${subscriptionType === 'old' ? 'text-white' : 'text-gray-600'}`}>
              Existing Subscriber
            </span>
          </button>
          <p className="text-gray-500 text-center text-xs font-normal max-w-sm">
            {subscriptionType === 'none' 
              ? "See how much you could save with our subscription plan"
              : "Compare your current plan (125 EGP/month) with our new plan"}
          </p>
        </div>

        {savings !== null && (
          <div className="text-center mb-4">
            <div className="text-2xl font-medium text-gray-600 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Annual Savings
            </div>
            <div className="flex justify-center items-end">
              <span className="text-2xl font-bold text-[#FFD700]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                EGP {savings.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center space-y-6">
          {/* Trades per month */}
          <div className="space-y-3 w-full max-w-md">
            <h3 className="text-base font-medium text-gray-600 text-center mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Your average number of trades per month
            </h3>
            <div className="flex items-center justify-center gap-3 mb-2">
              <button className={buttonClass} onClick={() => setTrades(t => Math.max(1, t - 1))}>−</button>
              <div className={valueBox}>
                {trades}
              </div>
              <button className={buttonClass} onClick={() => setTrades(t => Math.min(100, t + 1))}>+</button>
            </div>
            <div className="px-8">
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
          </div>

          {/* Average trade value */}
          <div className="space-y-3 w-full max-w-md">
            <h3 className="text-base font-medium text-gray-600 text-center mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Your average value per trade (EGP)
            </h3>
            <div className="flex items-center justify-center gap-3 mb-2">
              <button className={buttonClass} onClick={() => setAvgTradeValue(v => Math.max(10000, v - 10000))}>−</button>
              <div className={valueBox}>
                {avgTradeValue.toLocaleString()}
              </div>
              <button className={buttonClass} onClick={() => setAvgTradeValue(v => Math.min(250000, v + 10000))}>+</button>
            </div>
            <div className="px-8">
              <input
                type="range"
                min="10000"
                max="250000"
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
    </div>
  );
}