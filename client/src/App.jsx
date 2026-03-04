import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, X, Activity, Globe, RefreshCcw, ArrowRightLeft } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('Günlük');
  // Çevirici için gerekli state'ler
  const [amount, setAmount] = useState(1);
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [calcResult, setCalcResult] = useState(0);

  useEffect(() => {
    fetchRates();
  }, []);

const fetchRates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/market');
      setData(response.data);
      // Veri geldiğinde ilk döviz kodunu otomatik seç (Boşlukları temizleyerek)
// Opsiyonel zincirleme (?.) ve fallback (|| '') kullanarak çökmesini engelliyoruz
if (response.data && response.data.length > 0) {
  const firstCode = response.data[0].CurrencyCode?.trim() || response.data[0].Isim?.trim() || '';
  setTargetCurrency(firstCode);
}
    } catch (error) {
      console.error('Veri hatası:', error);
    }
  };
  // Miktar veya döviz değiştiğinde otomatik hesapla
useEffect(() => {
  // Hem CurrencyCode hem de Isim üzerinden arama yapıyoruz ki hata payı kalmasın
  const selected = data.find(c => 
    (c.CurrencyCode?.trim() === targetCurrency?.trim()) || 
    (c.Isim?.trim() === targetCurrency?.trim())
  );
  
  if (selected) {
    const buyingPrice = parseFloat(selected.ForexBuying);
    const inputAmount = parseFloat(amount) || 0;
    setCalcResult((inputAmount * buyingPrice).toFixed(2));
  }
}, [amount, targetCurrency, data]);

  const generateChartData = (baseValue, range) => {
    const points = range === 'Günlük' ? 12 : range === 'Haftalık' ? 7 : 30;
    const newData = Array.from({ length: points }, (_, i) => ({
      name: range === 'Günlük' ? `${i * 2}:00` : `Gün ${i + 1}`,
      fiyat: Number(
        baseValue + (Math.random() - 0.5) * (baseValue * 0.03)
      ).toFixed(4)
    }));
    setChartData(newData);
  };

  const handleCardClick = (item) => {
    setSelectedCurrency(item);
    generateChartData(parseFloat(item.ForexBuying), 'Günlük');
    setTimeRange('Günlük');
  };

  // Hover efektlerini sadece hover destekleyen cihazlarda aktif et
  const hoverCapable = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches;
  }, []);

  const styles = {
    page: {
      backgroundColor: '#0f172a',
      minHeight: '100vh',
      width: '100%',
      color: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
      padding: 'clamp(12px, 3vw, 20px)',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + clamp(12px, 3vw, 20px))',
      paddingBottom:
        'calc(env(safe-area-inset-bottom, 0px) + clamp(12px, 3vw, 20px))'
    },converterBox: {
      maxWidth: '1600px',
      margin: '0 auto 30px auto',
      backgroundColor: '#1e293b',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid #334155',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '15px',
      justifyContent: 'center'
    },
    input: { 
      backgroundColor: '#0f172a', 
      border: '1px solid #334155', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '8px', 
      fontSize: '1rem', 
      width: '100px',
      outline: 'none'
    },
    select: { 
      backgroundColor: '#0f172a', 
      border: '1px solid #334155', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '8px', 
      fontSize: '1rem', 
      cursor: 'pointer',
      outline: 'none'
    },

    header: {
      maxWidth: '1600px',
      margin: '0 auto clamp(16px, 3vw, 30px) auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px'
    },

    titleWrap: { display: 'flex', alignItems: 'center', gap: '10px' },

    title: {
      fontSize: 'clamp(1.25rem, 4vw, 2.2rem)',
      margin: 0,
      lineHeight: 1.1
    },

    refreshBtn: {
      backgroundColor: '#1e293b',
      color: 'white',
      border: '1px solid #334155',
      padding: '10px 14px',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: '0.3s',
      width: 'fit-content',
      // mobilde buton çok büyümesin
      fontSize: 'clamp(0.9rem, 2.8vw, 1rem)'
    },

    main: {
      maxWidth: '1600px',
      margin: '0 auto',
      display: 'grid',
      // mobilde kartlar daha rahat sığsın
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 'clamp(12px, 2vw, 20px)'
    },
    

    card: {
      backgroundColor: '#1e293b',
      padding: 'clamp(14px, 3vw, 25px)',
      borderRadius: '16px',
      border: '1px solid #334155',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      minWidth: 0 // text taşmalarını azaltır
    },

    cardTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
      color: '#94a3b8',
      fontSize: 'clamp(0.8rem, 2.8vw, 0.95rem)'
    },

    cardName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },

    cardPrice: {
      fontSize: 'clamp(1.35rem, 5vw, 2rem)',
      fontWeight: 800,
      margin: 'clamp(10px, 2vw, 15px) 0',
      lineHeight: 1.1,
      wordBreak: 'break-word'
    },

    tryLabel: {
      fontSize: 'clamp(0.85rem, 2.8vw, 1rem)',
      color: '#38bdf8',
      marginLeft: 6
    },

    cardBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
      fontSize: 'clamp(0.78rem, 2.7vw, 0.9rem)'
    },

    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      padding: 'clamp(10px, 3vw, 18px)'
    },

    modal: {
      backgroundColor: '#1e293b',
      padding: 'clamp(14px, 4vw, 34px)',
      borderRadius: '24px',
      width: '100%',
      maxWidth: '1000px',
      position: 'relative',
      border: '1px solid #334155',
      // mobilde yükseklik taşarsa scroll
      maxHeight: 'calc(100vh - 24px)',
      overflow: 'auto'
    },

    modalHeaderRow: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '12px',
      paddingRight: '44px' // close buton boşluğu
    },

    closeBtn: {
      position: 'absolute',
      right: '16px',
      top: '16px',
      border: 'none',
      background: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: 6,
      borderRadius: 10
    },

    modalTitle: {
      margin: 0,
      fontSize: 'clamp(1.1rem, 4vw, 1.6rem)'
    },

    modalSubtitle: {
      color: '#94a3b8',
      marginTop: 6,
      marginBottom: 'clamp(16px, 3.5vw, 25px)',
      fontSize: 'clamp(0.9rem, 3vw, 1rem)'
    },

    rangeRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: 'clamp(14px, 3vw, 22px)',
      flexWrap: 'wrap' // mobilde alt satıra geçsin
    },

    rangeBtn: (active) => ({
      padding: '10px 14px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: active ? '#38bdf8' : '#334155',
      color: 'white',
      cursor: 'pointer',
      transition: '0.2s',
      fontWeight: 800,
      fontSize: 'clamp(0.85rem, 2.8vw, 1rem)',
      flex: '1 1 110px' // mobilde 2-3’lü dizilsin
    }),

    chartWrap: {
      width: '100%',
      height: 'clamp(240px, 45vh, 450px)'
    }
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.titleWrap}>
          <Globe size={32} color="#38bdf8" />
          <h1 style={styles.title}>Global Piyasalar</h1>
        </div>

        <button
          onClick={fetchRates}
          style={styles.refreshBtn}
          onMouseOver={(e) => {
            if (!hoverCapable) return;
            e.currentTarget.style.backgroundColor = '#334155';
          }}
          onMouseOut={(e) => {
            if (!hoverCapable) return;
            e.currentTarget.style.backgroundColor = '#1e293b';
          }}
        >
          <RefreshCcw size={18} /> Verileri Yenile
        </button>
      </header>
          {/* DÖVİZ ÇEVİRİCİ BÖLÜMÜ */}
      <section style={styles.converterBox}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            style={styles.input}
          />
<select 
  value={targetCurrency} 
  onChange={(e) => setTargetCurrency(e.target.value.trim())} // Buraya da trim ekledik
  style={styles.select}
>
{data.map((item, index) => (
  // item.CurrencyCode yoksa item.Isim kullan, o da yoksa index kullan
  <option key={index} value={(item.CurrencyCode || item.Isim || '').trim()}>
    {item.Isim}
  </option>
))}
</select>
        </div>
        
        <ArrowRightLeft size={24} color="#94a3b8" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#38bdf8' }}>{calcResult}</span>
          <span style={{ fontWeight: 'bold', color: '#94a3b8' }}>TRY (TL)</span>
        </div>
      </section>
      {/* CARD GRID */}
      <main style={styles.main}>
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(item)}
            style={styles.card}
            onMouseOver={(e) => {
              if (!hoverCapable) return;
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#38bdf8';
            }}
            onMouseOut={(e) => {
              if (!hoverCapable) return;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#334155';
            }}
          >
            <div style={styles.cardTop}>
              <span style={styles.cardName}>{item.Isim}</span>
              <Activity size={18} />
            </div>

            <div style={styles.cardPrice}>
              {item.ForexBuying}
              <span style={styles.tryLabel}>TRY</span>
            </div>

            <div style={styles.cardBottom}>
              <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={14} />
                <span style={{ whiteSpace: 'nowrap' }}>Satış: {item.ForexSelling}</span>
              </span>
              <span style={{ color: '#94a3b8' }}>{item.CurrencyCode}</span>
            </div>
          </div>
        ))}
      </main>

      {/* MODAL & CHART */}
      {selectedCurrency && (
        <div style={styles.overlay} onClick={() => setSelectedCurrency(null)}>
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()} // dışa tıklayınca kapanırken modal içi tıklamayı engelle
          >
            <button onClick={() => setSelectedCurrency(null)} style={styles.closeBtn} aria-label="Kapat">
              <X size={28} />
            </button>

            <div style={styles.modalHeaderRow}>
              <div>
                <h2 style={styles.modalTitle}>{selectedCurrency.Isim} Analizi</h2>
                <p style={styles.modalSubtitle}>
                  Piyasa Değeri: {selectedCurrency.ForexBuying} TRY
                </p>
              </div>
            </div>

            <div style={styles.rangeRow}>
              {['Günlük', 'Haftalık', 'Aylık'].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setTimeRange(r);
                    generateChartData(parseFloat(selectedCurrency.ForexBuying), r);
                  }}
                  style={styles.rangeBtn(timeRange === r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <div style={styles.chartWrap}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                  <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="fiyat"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;