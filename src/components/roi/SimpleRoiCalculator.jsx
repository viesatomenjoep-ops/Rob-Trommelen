"use client";
import React, { useState, useMemo } from 'react';

function CurrencyDropdown({ currency, setCurrency, id }) {
  const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€';
  return (
    <div className="relative inline-block z-[60] ml-2 mr-2">
      <button 
        type="button" 
        onClick={(e) => {
           e.preventDefault();
           const el = document.getElementById(id);
           if(el) el.classList.toggle('hidden');
        }}
        className="bg-transparent border-none text-accent md:text-white/70 hover:text-white text-base md:text-lg lg:text-xl font-serif cursor-pointer focus:ring-0 outline-none flex items-center bg-white/5 md:bg-transparent px-2 py-1 md:py-0 rounded border border-white/10 md:border-transparent"
      >
        {symbol}
        <svg className="w-3 h-3 ml-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      
      <div id={id} className="hidden absolute top-full left-0 mt-2 bg-white rounded-md shadow-2xl overflow-hidden z-[70] border border-gray-100 flex flex-col min-w-[80px]">
        {['EUR', 'USD', 'GBP'].map(opt => (
          <button 
            key={opt}
            type="button"
            onClick={(e) => { 
              e.preventDefault();
              if(setCurrency) setCurrency(opt); 
              document.getElementById(id).classList.add('hidden');
            }} 
            className={`px-4 py-2 text-left font-serif text-lg hover:bg-silver transition-colors flex items-center gap-2 ${currency === opt ? 'text-accent font-bold bg-accent/5' : 'text-primary'}`}
          >
            <span>{opt === 'EUR' ? '€' : opt === 'USD' ? '$' : '£'}</span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-50">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const SimpleRoiCalculator = ({ lang = 'en', inputCurrency = 'USD', setInputCurrency, outputCurrency = 'EUR', setOutputCurrency, rates = {EUR:1, USD:1.1, GBP:0.85} }) => {
  const inputSymbol = inputCurrency === 'USD' ? '$' : inputCurrency === 'GBP' ? '£' : '€';
  const outputSymbol = outputCurrency === 'USD' ? '$' : outputCurrency === 'GBP' ? '£' : '€';
  
  const [amount, setAmount] = useState(100000);
  const [activeYear, setActiveYear] = useState(0);

  const conversionRate = rates[outputCurrency] / rates[inputCurrency];

  const translations = {
    en: {
      title: 'Investment ROI Calculator',
      inputLabel: 'Amount to Invest',
      minLabel: 'Min: €15.000',
      maxLabel: 'Max: €1.000.000+',
      year1: '3-6 Months',
      year2: '6-12 Months',
      year3: '12-36 Months',
      shortTerm: 'Short Term Investment',
      mediumTerm: 'Medium Term Project',
      longTerm: 'Long Term Investment',
      range: 'Projected Profit',
      totalReturn: 'Total Return (Incl. Inv.)',
      cta: 'Request Investment Plan',
      potential: 'Potential',
    },
    nl: {
      title: 'ROI Calculator',
      inputLabel: 'Investeringsbedrag',
      minLabel: 'Min: €15.000',
      maxLabel: 'Max: €1.000.000+',
      year1: '3-6 Maanden',
      year2: '6-12 Maanden',
      year3: '12-36 Maanden',
      shortTerm: 'Korte Termijn Investering',
      mediumTerm: 'Middellange Termijn Project',
      longTerm: 'Lange Termijn Investering',
      range: 'Verwachte Winst',
      totalReturn: 'Totale Opbrengst (Incl. Inleg)',
      cta: 'Plan Aanvragen',
      potential: 'Potentieel',
    },
    de: {
      title: 'ROI-Rechner',
      inputLabel: 'Investitionsbetrag',
      minLabel: 'Min: €15.000',
      maxLabel: 'Max: €1.000.000+',
      year1: '3-6 Monate',
      year2: '6-12 Monate',
      year3: '12-36 Monate',
      shortTerm: 'Kurzfristige Investition',
      mediumTerm: 'Mittelfristiges Projekt',
      longTerm: 'Langfristige Investition',
      range: 'Erwarteter Gewinn',
      totalReturn: 'Gesamtertrag (Inkl. Investition)',
      cta: 'Investitionsplan Anfordern',
      potential: 'Potenzial',
    },
    es: {
      title: 'Calculadora de ROI',
      inputLabel: 'Monto de Inversión',
      minLabel: 'Min: €15.000',
      maxLabel: 'Max: €1.000.000+',
      year1: '3-6 Meses',
      year2: '6-12 Meses',
      year3: '12-36 Meses',
      shortTerm: 'Inversión a Corto Plazo',
      mediumTerm: 'Proyecto a Medio Plazo',
      longTerm: 'Inversión a Largo Plazo',
      range: 'Beneficio Proyectado',
      totalReturn: 'Retorno Total (Incl. Inv.)',
      cta: 'Solicitar Plan de Inversión',
      potential: 'Potencial',
    }
  };

  const t = translations[lang] || translations.en;

  const results = useMemo(() => [
    { year: t.year1, label: t.shortTerm, min: 0.3, max: 0.75 },
    { year: t.year2, label: t.mediumTerm, min: 0.5, max: 1.5 },
    { year: t.year3, label: t.longTerm, min: 0.75, max: 3.0 },
  ], [t]);

  const formatOutput = new Intl.NumberFormat(lang === 'nl' || lang === 'de' || lang === 'es' ? 'nl-NL' : 'en-US', {
    style: 'currency',
    currency: outputCurrency,
    maximumFractionDigits: 0,
  });

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    const numVal = val === '' ? 0 : parseInt(val, 10);
    setAmount(Math.min(numVal, 10000000));
  };

  return (
    <div className="bg-secondary p-5 md:p-8 lg:p-10 shadow-2xl border-l-[12px] border-accent relative overflow-hidden rounded-r-2xl mx-auto w-full max-w-4xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-light/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 lg:gap-6 lg:mb-10">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-serif text-white">{t.title}</h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 lg:px-5 lg:py-4 flex flex-col items-start md:items-end group focus-within:border-accent/40 transition-colors w-full md:w-auto">
            <label className="text-accent/90 text-[11px] md:text-sm font-bold uppercase tracking-[0.25em] mb-1.5 md:mb-2">{t.inputLabel}</label>
            <div className="flex items-center w-full md:w-auto mt-2 md:mt-0">
              <CurrencyDropdown currency={inputCurrency} setCurrency={setInputCurrency} id="simple-drop-1" />
              <input 
                type="text" 
                value={amount.toLocaleString(lang === 'nl' ? 'nl-NL' : 'en-US')}
                onChange={handleInputChange}
                className="bg-transparent border-none text-white text-lg md:text-xl lg:text-2xl font-serif tabular-nums outline-none w-32 md:w-48 text-right p-0 focus:ring-0"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6 md:mb-8 px-2 max-w-4xl mx-auto">
          <div className="relative h-1 bg-white/10 rounded-full group mb-4">
            <input 
              type="range" 
              min="15000" 
              max="1000000" 
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30 touch-none"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-accent rounded-full"
              style={{ width: `${Math.min(((amount - 15000) / 985000) * 100, 100)}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)] rounded-full scale-100 group-hover:scale-125 pointer-events-none border-[3px] border-accent transition-transform"></div>
            </div>
          </div>
          <div className="flex justify-between text-[11px] md:text-sm font-bold uppercase tracking-widest text-white/50 tabular-nums">
            <span>{t.minLabel.replace('€', inputSymbol)}</span>
            <span>{t.maxLabel.replace('€', inputSymbol)}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-5 md:p-8 lg:p-10 rounded-xl lg:rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
          
          {(() => {
            const res = results[activeYear];
            return (
              <div className="flex flex-col space-y-10">
                
                <div className="text-center space-y-3 pb-10 border-b border-white/10">
                  <span className="text-accent/80 text-[11px] md:text-sm lg:text-base font-bold uppercase tracking-[0.25em] flex justify-center items-center gap-2">{t.totalReturn} <CurrencyDropdown currency={outputCurrency} setCurrency={setOutputCurrency} id="simple-drop-2" /></span>
                  <div className="text-xl md:text-2xl lg:text-3xl font-serif text-white flex flex-col md:flex-row justify-center items-center gap-2 md:gap-3 drop-shadow-lg tabular-nums leading-tight">
                    <span>{formatOutput.format((amount + (amount * res.min)) * conversionRate)}</span>
                    <span className="text-white/30 hidden md:block">—</span>
                    <span className="text-white/30 block md:hidden text-lg italic">{lang === 'nl' ? 'tot' : lang === 'de' ? 'bis' : lang === 'es' ? 'a' : 'to'}</span>
                    <span>{formatOutput.format((amount + (amount * res.max)) * conversionRate)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row bg-black/20 rounded-2xl p-2 gap-2 max-w-2xl mx-auto w-full border border-white/5">
                  {results.map((r, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveYear(idx)}
                      className={`flex-1 py-3 px-3 md:py-4 md:px-5 lg:px-6 rounded-lg lg:rounded-xl text-sm md:text-base lg:text-lg font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all ${activeYear === idx ? 'bg-accent text-white shadow-lg scale-[1.02]' : 'text-white/50 hover:text-white/90 hover:bg-white/5'}`}
                    >
                      {r.year}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center bg-accent/10 border border-accent/20 rounded-2xl p-6 lg:p-10 gap-6">
                  <div className="text-center lg:text-left w-full">
                    <span className="text-accent text-[11px] md:text-sm lg:text-base font-bold uppercase tracking-[0.25em] mb-2 flex items-center justify-center lg:justify-start gap-2">{t.range} (Net Profit) <CurrencyDropdown currency={outputCurrency} setCurrency={setOutputCurrency} id="simple-drop-3" /></span>
                    <div className="text-lg md:text-xl lg:text-2xl font-serif text-accent flex flex-col md:flex-row items-center justify-center lg:justify-start gap-2 md:gap-3 tabular-nums">
                      <span>+{formatOutput.format((amount * res.min) * conversionRate)}</span>
                      <span className="text-accent/40 hidden md:block">—</span>
                      <span className="text-accent/40 block md:hidden text-base italic">{lang === 'nl' ? 'tot' : lang === 'de' ? 'bis' : lang === 'es' ? 'a' : 'to'}</span>
                      <span>+{formatOutput.format((amount * res.max) * conversionRate)}</span>
                    </div>
                  </div>
                  <div className="bg-accent text-white px-5 py-3 lg:px-6 lg:py-4 rounded-md text-xs md:text-sm lg:text-base font-bold uppercase tracking-[0.25em] text-center shadow-lg transform transition-transform hover:scale-105">
                    +{(res.max * 100).toFixed(0)}% {t.potential}
                  </div>
                </div>

              </div>
            );
          })()}
        </div>

        <div className="mt-8 lg:mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
          <p className="text-white/50 text-[11px] md:text-xs max-w-sm font-medium uppercase tracking-widest leading-relaxed text-center md:text-left">
            * Calculations are based on professional benchmarks for the trade and sport of 5-star Grand Prix jumpers. Actual results may vary.
          </p>
          <a href="#contact" className="w-full md:w-auto bg-accent text-white px-6 py-4 lg:px-10 lg:py-5 text-[11px] md:text-sm font-bold uppercase tracking-[0.25em] hover:bg-primary hover:text-white hover:scale-105 transition-all shadow-xl text-center relative z-20">
            {t.cta}
          </a>
        </div>
      </div>

      <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="absolute bottom-6 left-12 z-0 w-16 h-16 opacity-[0.04] hover:opacity-[0.15] transition-all duration-700 cursor-pointer focus:outline-none hidden md:block">
        <img src="/images/logo.webp" alt="Scroll to top" loading="lazy" width="64" height="64" className="w-full h-full object-contain brightness-0 invert animate-slow-spin" style={{willChange: 'transform'}} />
      </button>
    </div>
  );
};

export default SimpleRoiCalculator;

