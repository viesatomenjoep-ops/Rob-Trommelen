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
        className="bg-transparent border-none text-accent hover:text-white text-base md:text-lg lg:text-xl font-serif cursor-pointer focus:ring-0 outline-none flex items-center bg-white/5 px-2 py-1 rounded border border-white/10"
      >
        {symbol}
        <svg className="w-3 h-3 ml-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      
      <div id={id} className="hidden absolute top-full left-0 md:right-0 mt-2 bg-white rounded-md shadow-2xl overflow-hidden z-[70] border border-gray-100 flex flex-col min-w-[80px]">
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

const AdvancedRoiCalculator = ({ lang = 'en', inputCurrency = 'USD', setInputCurrency, outputCurrency = 'EUR', setOutputCurrency, rates = {EUR:1, USD:1.1, GBP:0.85} }) => {
  const inputSymbol = inputCurrency === 'USD' ? '$' : inputCurrency === 'GBP' ? '£' : '€';
  
  const [purchaseCurr, setPurchaseCurr] = useState(inputCurrency);
  const [saleCurr, setSaleCurr] = useState('USD'); // Default sale to USD to show cross-currency power
  
  const [data, setData] = useState({
    purchasePrice: 250000,
    ownershipPercentage: 100,
    monthsHeld: 24,
    monthlyBoardingTraining: 2500,
    monthlyVetFarrier: 500,
    monthlyShowTransport: 1500,
    insuranceRateYearly: 3.5,
    expectedSalePrice: 400000,
  });

  const translations = {
    en: {
      title: 'Syndicate TCO & ROI Calculator',
      subtitle: 'Advanced Financial Modeling',
      purchase: 'Acquisition',
      syndicateShare: 'Syndicate Share',
      duration: 'Duration',
      expectedSale: 'Target Sale Value',
      monthlyOps: 'Monthly Operational Assets (Target)',
      training: 'Training & Boarding ($/',
      vet: 'Vet & Farrier ($/',
      shows: 'Shows & Logistics ($/',
      insurance: 'Annual Insurance (%)',
      yourFinancials: 'Financial Profile',
      yourPurchase: 'Capital Acquisition',
      yourTco: 'Operational TCO',
      totalInvestment: 'Total Investment',
      netProfit: 'Net Profit',
      expectedRoi: 'Yield (ROI)',
      mo: 'mo)',
      months: 'months',
      pct: '%'
    },
    nl: {
      title: 'Syndicaat TCO & ROI Calculator',
      subtitle: 'Geavanceerd Financieel Model',
      purchase: 'Aanschafwaarde',
      syndicateShare: 'Syndicaat Aandeel',
      duration: 'Looptijd (mnd)',
      expectedSale: 'Verwachte Verkoop',
      monthlyOps: 'Maandelijkse Operationele Kosten',
      training: 'Training & Stalling (€/',
      vet: 'Dierenarts & Smid (€/',
      shows: 'Shows & Transport (€/',
      insurance: 'Jaarlijkse Verzekering (%)',
      yourFinancials: 'Financieel Profiel',
      yourPurchase: 'Aanschaf',
      yourTco: 'Operationele TCO',
      totalInvestment: 'Totaal Investering',
      netProfit: 'Netto Winst',
      expectedRoi: 'Rendement (ROI)',
      mo: 'mnd)',
      months: 'maanden',
      pct: '%'
    },
    de: {
      title: 'Syndikat TCO & ROI-Rechner',
      subtitle: 'Erweitertes Finanzmodell',
      purchase: 'Anschaffungswert',
      syndicateShare: 'Syndikatsanteil',
      duration: 'Laufzeit',
      expectedSale: 'Erwarteter Verkauf',
      monthlyOps: 'Monatliche Betriebskosten',
      training: 'Training & Unterbringung (€/',
      vet: 'Tierarzt & Hufschmied (€/',
      shows: 'Turniere & Transport (€/',
      insurance: 'Jährliche Versicherung (%)',
      yourFinancials: 'Finanzprofil',
      yourPurchase: 'Kaufanteil',
      yourTco: 'Betriebskosten',
      totalInvestment: 'Gesamtinvestition',
      netProfit: 'Nettogewinn',
      expectedRoi: 'Rendite (ROI)',
      mo: 'mon)',
      months: 'monate',
      pct: '%'
    },
    es: {
      title: 'Calculadora de TCO y ROI',
      subtitle: 'Modelo Financiero Avanzado',
      purchase: 'Adquisición',
      syndicateShare: 'Participación',
      duration: 'Duración',
      expectedSale: 'Venta Esperada',
      monthlyOps: 'Costos Operativos Mensuales',
      training: 'Entrenamiento y Alojamiento (€/',
      vet: 'Veterinario y Herrador (€/',
      shows: 'Shows y Transporte (€/',
      insurance: 'Seguro Anual (%)',
      yourFinancials: 'Perfil Financiero',
      yourPurchase: 'Adquisición',
      yourTco: 'Costos (TCO)',
      totalInvestment: 'Inversión',
      netProfit: 'Beneficio Neto',
      expectedRoi: 'Rendimiento (ROI)',
      mo: 'mes)',
      months: 'meses',
      pct: '%'
    }
  };

  const t = translations[lang] || translations.en;
  
  const formatInput = new Intl.NumberFormat(lang === 'nl' || lang === 'de' || lang === 'es' ? 'nl-NL' : 'en-US', {
    style: 'currency',
    currency: inputCurrency,
    maximumFractionDigits: 0,
  });

  const formatOutput = new Intl.NumberFormat(lang === 'nl' || lang === 'de' || lang === 'es' ? 'nl-NL' : 'en-US', {
    style: 'currency',
    currency: outputCurrency,
    maximumFractionDigits: 0,
  });

  const handleChange = (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 0;
    
    if (e.target.name === 'ownershipPercentage' && val > 100) val = 100;
    if (e.target.name === 'ownershipPercentage' && val < 0) val = 0;
    if (e.target.name === 'insuranceRateYearly' && val > 20) val = 20;

    setData({ ...data, [e.target.name]: val });
  };

  const calc = useMemo(() => {
    const fraction = data.ownershipPercentage / 100;
    
    // Normalize properties to EUR base
    const myPurchasePriceEUR = (data.purchasePrice * fraction) / rates[purchaseCurr];
    
    // Insurance is usually % of purchase price. Calculate it in purchaseCurr, then to EUR
    const yearlyInsuranceEUR = (data.purchasePrice * (data.insuranceRateYearly / 100)) / rates[purchaseCurr];
    const totalInsuranceEUR = (yearlyInsuranceEUR / 12) * data.monthsHeld;
    
    // Ops costs are assumed to be generated in 'inputCurrency'
    const monthlyTotalCost = data.monthlyBoardingTraining + data.monthlyVetFarrier + data.monthlyShowTransport;
    const monthlyTotalCostEUR = monthlyTotalCost / rates[inputCurrency];
    const totalOperationalCostsEUR = (monthlyTotalCostEUR * data.monthsHeld) + totalInsuranceEUR;
    
    const myOperationalCostsEUR = totalOperationalCostsEUR * fraction;
    const myTotalInvestmentEUR = myPurchasePriceEUR + myOperationalCostsEUR;
    
    const myExpectedReturnEUR = (data.expectedSalePrice * fraction) / rates[saleCurr];
    const myNetProfitEUR = myExpectedReturnEUR - myTotalInvestmentEUR;
    const roiPercentage = myTotalInvestmentEUR > 0 ? (myNetProfitEUR / myTotalInvestmentEUR) * 100 : 0;

    return { 
      myPurchasePriceBase: myPurchasePriceEUR, 
      myOperationalCostsBase: myOperationalCostsEUR, 
      myTotalInvestmentBase: myTotalInvestmentEUR, 
      myExpectedReturnBase: myExpectedReturnEUR,
      myNetProfitBase: myNetProfitEUR, 
      roiPercentage 
    };
  }, [data, purchaseCurr, saleCurr, inputCurrency, rates]);


  return (
    <div className="bg-primary p-6 md:p-10 shadow-2xl relative overflow-hidden text-white w-full max-w-7xl mx-auto rounded-none border-y border-white/10">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-8">
        
        <div className="xl:col-span-8 flex flex-col space-y-8">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2 block">{t.subtitle}</span>
            <h2 className="text-base md:text-lg lg:text-2xl font-serif text-white">{t.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-5 flex flex-col items-start focus-within:border-accent transition-colors gap-3">
              <label className="text-white/60 text-[11px] md:text-sm font-bold uppercase tracking-[0.25em] w-full">{t.purchase}</label>
              <div className="flex items-center w-full justify-start mt-auto">
                <CurrencyDropdown currency={purchaseCurr} setCurrency={setPurchaseCurr} id="adv-drop-1" />
                <input type="number" name="purchasePrice" value={data.purchasePrice === 0 ? '' : data.purchasePrice} onChange={handleChange} className="bg-transparent text-left text-lg md:text-xl lg:text-2xl font-serif text-white outline-none w-full tabular-nums" />
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-5 flex flex-col items-start focus-within:border-accent transition-colors gap-3">
              <label className="text-white/60 text-[11px] md:text-sm font-bold uppercase tracking-[0.25em] w-full">{t.expectedSale}</label>
              <div className="flex items-center w-full justify-start mt-auto">
                <CurrencyDropdown currency={saleCurr} setCurrency={setSaleCurr} id="adv-drop-2" />
                <input type="number" name="expectedSalePrice" value={data.expectedSalePrice === 0 ? '' : data.expectedSalePrice} onChange={handleChange} className="bg-transparent text-left text-lg md:text-xl lg:text-2xl font-serif text-accent outline-none w-full tabular-nums" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 flex flex-col items-start focus-within:border-accent transition-colors gap-3">
              <label className="text-white/60 text-[11px] md:text-sm font-bold uppercase tracking-[0.25em] w-full">{t.duration}</label>
              <div className="flex items-center w-full justify-start mt-auto">
                <span className="text-white/50 text-xl font-serif mr-3">#</span>
                <input type="number" name="monthsHeld" value={data.monthsHeld || ''} onChange={handleChange} className="bg-transparent text-left text-lg md:text-xl lg:text-2xl font-serif text-white outline-none w-full tabular-nums" />
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/30 p-5 flex flex-col items-start focus-within:border-accent transition-colors relative overflow-hidden gap-3">
              <div className="absolute left-0 top-0 w-1 h-full bg-accent"></div>
              <label className="text-accent text-[11px] md:text-sm font-bold uppercase tracking-[0.25em] w-full ml-1">{t.syndicateShare}</label>
              <div className="flex items-center w-full justify-start mt-auto ml-1">
                <span className="text-accent/50 text-xl font-serif mr-3">%</span>
                <input type="number" name="ownershipPercentage" value={data.ownershipPercentage || ''} onChange={handleChange} className="bg-transparent text-left text-lg md:text-xl lg:text-2xl font-serif text-white outline-none w-full tabular-nums" />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="text-base font-serif mb-4 text-white/80">{t.monthlyOps}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white/5 border border-white/5 p-4 flex flex-col justify-between focus-within:border-accent/50 transition-colors">
                <label className="text-white/50 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 leading-relaxed">{t.training.replace(/[€$£]/, inputSymbol)}{t.mo}</label>
                <input type="number" name="monthlyBoardingTraining" value={data.monthlyBoardingTraining === 0 ? '' : data.monthlyBoardingTraining} onChange={handleChange} className="bg-transparent text-left text-lg md:text-xl lg:text-2xl font-serif text-white outline-none w-full border-b border-white/20 pb-1 focus:border-accent transition-colors tabular-nums" />
              </div>
              <div className="bg-white/5 border border-white/5 p-4 flex flex-col justify-between focus-within:border-accent/50 transition-colors">
                <label className="text-white/50 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 leading-relaxed">{t.vet.replace(/[€$£]/, inputSymbol)}{t.mo}</label>
                <input type="number" name="monthlyVetFarrier" value={data.monthlyVetFarrier === 0 ? '' : data.monthlyVetFarrier} onChange={handleChange} className="bg-transparent text-left text-lg md:text-xl lg:text-2xl font-serif text-white outline-none w-full border-b border-white/20 pb-1 focus:border-accent transition-colors tabular-nums" />
              </div>
              <div className="bg-white/5 border border-white/5 p-4 flex flex-col justify-between focus-within:border-accent/50 transition-colors">
                <label className="text-white/50 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 leading-relaxed">{t.shows.replace(/[€$£]/, inputSymbol)}{t.mo}</label>
                <input type="number" name="monthlyShowTransport" value={data.monthlyShowTransport === 0 ? '' : data.monthlyShowTransport} onChange={handleChange} className="bg-transparent text-left text-lg md:text-xl lg:text-2xl font-serif text-white outline-none w-full border-b border-white/20 pb-1 focus:border-accent transition-colors tabular-nums" />
              </div>
              <div className="bg-white/5 border border-white/5 p-4 flex flex-col justify-between focus-within:border-accent/50 transition-colors">
                <label className="text-white/50 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 leading-relaxed">{t.insurance}</label>
                <input type="number" step="0.1" name="insuranceRateYearly" value={data.insuranceRateYearly === 0 ? '' : data.insuranceRateYearly} onChange={handleChange} className="bg-transparent text-left text-lg md:text-xl lg:text-2xl font-serif text-white outline-none w-full border-b border-white/20 pb-1 focus:border-accent transition-colors tabular-nums" />
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 mt-8 xl:mt-0 xl:pl-8 xl:border-l border-white/10 flex flex-col justify-center">
          <div className="bg-silver/40 p-6 md:p-8 border border-accent/20 shadow-[0_0_40px_rgba(212,175,55,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/20"></div>
            
            <h3 className="text-lg md:text-xl font-serif text-white mb-2">{t.yourFinancials}</h3>
            <p className="text-accent font-bold uppercase tracking-widest text-[10px] md:text-[11px] lg:text-xs mb-6">@ {data.ownershipPercentage}% Ownership | {data.monthsHeld} {t.months}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/10 pb-3">
                <span className="text-white/60 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">{t.yourPurchase}</span>
                <span className="text-lg md:text-xl lg:text-2xl font-serif text-white tabular-nums">{formatOutput.format(calc.myPurchasePriceBase * rates[outputCurrency])}</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/10 pb-3">
                <span className="text-white/60 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">{t.yourTco}</span>
                <span className="text-lg md:text-xl lg:text-2xl font-serif text-white tabular-nums">{formatOutput.format(calc.myOperationalCostsBase * rates[outputCurrency])}</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/30 pb-4 mt-4">
                <span className="text-white font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] flex items-center">{t.totalInvestment}</span>
                <span className="text-xl md:text-2xl lg:text-3xl font-serif text-white font-bold tabular-nums flex items-center"><CurrencyDropdown currency={outputCurrency} setCurrency={setOutputCurrency} id="adv-drop-3" /> {formatOutput.format(calc.myTotalInvestmentBase * rates[outputCurrency])}</span>
              </div>
              
              <div className="flex justify-between items-end pt-4">
                <span className="text-white/80 font-bold uppercase tracking-[0.2em] text-[10px] md:text-[11px] mb-1 flex items-center">{t.netProfit}</span>
                <span className={`text-xl md:text-2xl lg:text-3xl font-serif font-bold tabular-nums flex items-center ${calc.myNetProfitBase >= 0 ? 'text-accent' : 'text-red-400'}`}>
                  <CurrencyDropdown currency={outputCurrency} setCurrency={setOutputCurrency} id="adv-drop-4" /> {calc.myNetProfitBase >= 0 ? '+' : ''}{formatOutput.format(calc.myNetProfitBase * rates[outputCurrency])}
                </span>
              </div>
              
              <div className="mt-6 pt-5 border-t border-accent/20 text-center bg-white/5 rounded-xl border border-white/10 p-5">
                <span className="block text-white/50 text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-bold mb-2">{t.expectedRoi}</span>
                <div className={`text-2xl md:text-3xl lg:text-4xl font-serif font-bold tracking-tighter ${calc.roiPercentage >= 0 ? 'text-white' : 'text-red-400'}`}>
                  {calc.roiPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdvancedRoiCalculator;
