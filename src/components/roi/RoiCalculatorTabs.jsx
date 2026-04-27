"use client";
import React, { useState, useEffect } from 'react';
import SimpleRoiCalculator from './SimpleRoiCalculator';
import AdvancedRoiCalculator from './AdvancedRoiCalculator';

export default function RoiCalculatorTabs({ lang = 'en' }) {
  const [activeTab, setActiveTab] = useState('advanced');
  const [inputCurrency, setInputCurrency] = useState('USD');
  const [outputCurrency, setOutputCurrency] = useState('EUR');
  const [rates, setRates] = useState({ EUR: 1, USD: 1.1, GBP: 0.85 });

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/EUR')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setRates({
            EUR: 1,
            USD: data.rates.USD || 1.1,
            GBP: data.rates.GBP || 0.85
          });
        }
      })
      .catch(err => console.error("Could not fetch exchange rates:", err));
  }, []);

  const translations = {
    en: { simpleTab: 'Investment Profit Estimator', advancedTab: 'Advanced Syndicate TCO' },
    nl: { simpleTab: 'Investerings Winstschatter', advancedTab: 'Geavanceerde TCO Simulator' },
    de: { simpleTab: 'Investitionsgewinnschätzer', advancedTab: 'Erweiterter TCO-Simulator' },
    es: { simpleTab: 'Estimador de Inversión', advancedTab: 'Simulador TCO Avanzado' },
  };
  
  const t = translations[lang] || translations.en;

  const calculatorProps = {
    lang,
    inputCurrency,
    setInputCurrency,
    outputCurrency,
    setOutputCurrency,
    rates
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative mb-10 w-full max-w-lg mx-auto z-20 shadow-2xl rounded-full drop-shadow-xl group">
        <select 
          value={activeTab} 
          onChange={(e) => setActiveTab(e.target.value)}
          className="appearance-none w-full bg-white border border-primary/10 text-primary font-bold uppercase tracking-widest sm:tracking-[0.2em] py-4 px-6 md:py-5 md:px-8 rounded-full outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer text-xs md:text-sm text-center transition-all shadow-inner hover:bg-gray-50"
        >
          <option value="advanced" className="font-sans font-medium">{t.advancedTab}</option>
          <option value="simple" className="font-sans font-medium">{t.simpleTab}</option>
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-accent group-hover:text-primary transition-colors">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <div className="w-full animate-fade-in transition-all duration-500 relative z-30">
        {activeTab === 'simple' && <SimpleRoiCalculator {...calculatorProps} />}
        {activeTab === 'advanced' && <AdvancedRoiCalculator {...calculatorProps} />}
      </div>
    </div>
  );
}
