'use client';
import { useState, useEffect } from 'react';
import { useTranslations, type Locale } from '../hooks/useTranslations';

type SubscriptionType = 'none' | 'old';

interface SavingsWidgetProps {
  locale?: Locale;
}

export default function SavingsWidget({ locale = 'en' }: SavingsWidgetProps) {
  const [trades, setTrades] = useState(5); // monthly trades
  const [avgTradeValue, setAvgTradeValue] = useState(10000); // value per trade
  const [savings, setSavings] = useState<number | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>('none');
  const { t, isRTL } = useTranslations(locale);

  const yearlyMultiplier = 12;
  const feeRate = 0.001;
  const monthlySubFee = 245;
  const oldMonthlySubFee = 125;

  useEffect(() => {
    const totalMonthlyTradeValue = avgTradeValue * trades;
  
    // Old subscription cost (what existing subscribers are currently paying)
    const oldSubscriptionFeeAnnual = oldMonthlySubFee * yearlyMultiplier;
    const oldSubscriberCommission = totalMonthlyTradeValue * yearlyMultiplier * feeRate;
    const oldSubscriberFlatFees = trades * 2 * yearlyMultiplier;
    const oldSubscriberCost = oldSubscriptionFeeAnnual + oldSubscriberCommission + oldSubscriberFlatFees;
  
    // New subscription cost
    const newSubscriptionFeeAnnual = monthlySubFee * yearlyMultiplier;
    let newSubscriberCost = newSubscriptionFeeAnnual;
  
    // For trades over 50, add commission and flat fees
    if (trades > 50) {
      const paidTrades = trades - 50;
      const paidTradeValue = avgTradeValue * paidTrades;
  
      const extraCommission = paidTradeValue * yearlyMultiplier * feeRate;
      const extraFlatFees = paidTrades * 2 * yearlyMultiplier;
  
      newSubscriberCost += extraCommission + extraFlatFees;
    }
  
    // Calculate savings based on subscription type
    const existingSubscriberSavings = oldSubscriberCost - newSubscriberCost;
    const userSavings = subscriptionType === 'old' 
      ? existingSubscriberSavings 
      : existingSubscriberSavings + 1500;
    
    setSavings(Math.max(0, Math.round(userSavings)));
  }, [trades, avgTradeValue, subscriptionType]);
  
  const buttonClass = `
    h-7 w-7 rounded-full border border-white text-white
    hover:bg-gray-800 transition-all duration-200 
    flex items-center justify-center bg-transparent
  `;
  const valueBox = `
    text-white text-lg font-medium border-[3px] border-white 
    rounded-full flex items-center justify-center bg-transparent
    shadow-sm px-6 py-2 min-w-[140px]
  `;
  const sliderClass =
    'w-full appearance-none h-[3px] bg-gray-600 rounded outline-none cursor-pointer';
  const thumbClass = `
    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 
    [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full 
    [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-0 
    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm
  `;
  const toggleClass = `
    relative inline-flex items-center gap-2 bg-[#0A0A0A] rounded-full p-1 w-[340px] h-[52px] shadow-sm
    transition-colors duration-200 ease-in-out cursor-pointer
  `;
  const toggleButtonClass = `
    absolute ${subscriptionType === 'old' ? 'right-1' : 'left-1'}
    inline-block h-[44px] w-[164px] transform rounded-full bg-[#45396D] shadow-sm
    transition duration-200 ease-in-out
  `;
  const toggleTextClass = `
    z-10 w-[164px] text-center text-sm transition-colors duration-200
  `;

  const MinusIcon = () => (
    <svg width="10" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 1H0" stroke="white" strokeWidth="2"/>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0V14M14 7H0" stroke="white" strokeWidth="2"/>
    </svg>
  );

  const handleAvgTradeValueChange = (newValue: number) => {
    // Ensure the value is rounded to the nearest 1000
    const roundedValue = Math.round(newValue / 1000) * 1000;
    // Ensure the value stays within bounds
    const boundedValue = Math.min(250000, Math.max(10000, roundedValue));
    setAvgTradeValue(boundedValue);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto mt-10 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-br from-[#181818] via-[#111111] to-[#111111] rounded-3xl border border-gray-800 shadow-xl p-8">
        {/* Subscription Toggle */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <button
            onClick={() => setSubscriptionType(subscriptionType === 'none' ? 'old' : 'none')}
            className={toggleClass}
            role="switch"
            aria-checked={subscriptionType === 'old'}
          >
            <span className={toggleButtonClass} />
            <span className={`${toggleTextClass} ${subscriptionType === 'none' ? 'text-white' : 'text-gray-400'}`}
                  style={{ fontFamily: isRTL ? 'Kalligraaf Arabic' : 'DM Sans, sans-serif' }}>
              {t.savings.toggleLabels.nonSubscriber}
            </span>
            <span className={`${toggleTextClass} ${subscriptionType === 'old' ? 'text-white' : 'text-gray-400'}`}
                  style={{ fontFamily: isRTL ? 'Kalligraaf Arabic' : 'DM Sans, sans-serif' }}>
              {t.savings.toggleLabels.existingSubscriber}
            </span>
          </button>
          <p className="text-gray-400 text-center text-xs font-normal max-w-sm"
             style={{ fontFamily: isRTL ? 'Kalligraaf Arabic' : 'DM Sans, sans-serif' }}>
            {subscriptionType === 'none' 
              ? t.savings.nonSubscriberMessage
              : t.savings.oldSubscriberMessage}
          </p>
        </div>

        {savings !== null && (
          <div className="text-center mb-4">
            <div className={`text-2xl font-medium text-white mb-2 ${isRTL ? 'text-2xl' : ''}`}
                 style={{ fontFamily: isRTL ? 'Kalligraaf Arabic' : 'DM Sans, sans-serif' }}>
              {t.savings.annualSavings}
            </div>
            <div className="flex justify-center items-end">
              <div className="flex items-center gap-1">
                {t.savings.currencyPosition === 'left' && (
                  <span className="text-sm text-[#B892FF]" 
                        style={{ fontFamily: locale === 'en' ? 'DM Sans, sans-serif' : 'Kalligraaf Arabic' }}>
                    {t.savings.currency}
                  </span>
                )}
                <span className={`text-2xl font-bold text-[#B892FF] ${isRTL ? 'text-3xl' : ''}`}
                      style={{ fontFamily: isRTL ? 'Kalligraaf Arabic' : 'DM Sans, sans-serif' }}>
                  {savings.toLocaleString('en-US')}
                </span>
                {t.savings.currencyPosition === 'right' && (
                  <span className="text-sm text-[#B892FF]"
                        style={{ fontFamily: locale === 'en' ? 'DM Sans, sans-serif' : 'Kalligraaf Arabic' }}>
                    {t.savings.currency}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center space-y-6">
          {/* Trades per month */}
          <div className="space-y-3 w-full max-w-md">
            <h3 className="text-base font-medium text-white text-center mb-4"
                style={{ fontFamily: isRTL ? 'Kalligraaf Arabic' : 'DM Sans, sans-serif' }}>
              {t.savings.tradesPerMonth}
            </h3>
            <div className="flex items-center justify-center gap-3 mb-2">
              <button className={buttonClass} onClick={() => setTrades(t => Math.max(1, t - 1))}>
                <MinusIcon />
              </button>
              <div className={valueBox} style={{ fontFamily: isRTL ? 'Kalligraaf Arabic' : 'DM Sans, sans-serif' }}>
                {trades.toLocaleString('en-US')}
              </div>
              <button className={buttonClass} onClick={() => setTrades(t => Math.min(100, t + 1))}>
                <PlusIcon />
              </button>
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
                style={{ accentColor: 'white' }}
              />
            </div>
          </div>

          {/* Average trade value */}
          <div className="space-y-3 w-full max-w-md">
            <h3 className="text-base font-medium text-white text-center mb-4"
                style={{ fontFamily: isRTL ? 'Kalligraaf Arabic' : 'DM Sans, sans-serif' }}>
              {t.savings.valuePerTrade}
            </h3>
            <div className="flex items-center justify-center gap-3 mb-2">
              <button className={buttonClass} onClick={() => handleAvgTradeValueChange(avgTradeValue - 1000)}>
                <MinusIcon />
              </button>
              <div className={`${valueBox} relative`}>
                <div className="flex items-center gap-1" style={{ fontFamily: isRTL ? 'Kalligraaf Arabic' : 'DM Sans, sans-serif' }}>
                  {t.savings.currencyPosition === 'left' && (
                    <span className="text-sm text-white">{t.savings.currency}</span>
                  )}
                  {avgTradeValue.toLocaleString('en-US')}
                  {t.savings.currencyPosition === 'right' && (
                    <span className="text-sm text-white">{t.savings.currency}</span>
                  )}
                </div>
              </div>
              <button className={buttonClass} onClick={() => handleAvgTradeValueChange(avgTradeValue + 1000)}>
                <PlusIcon />
              </button>
            </div>
            <div className="px-8">
              <input
                type="range"
                min="10000"
                max="250000"
                step="1000"
                value={avgTradeValue}
                onChange={(e) => handleAvgTradeValueChange(parseInt(e.target.value))}
                className={`${sliderClass} ${thumbClass}`}
                style={{ accentColor: 'white' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}