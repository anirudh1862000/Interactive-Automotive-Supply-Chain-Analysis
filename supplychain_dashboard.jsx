import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from "recharts";

// === DATASET (derived from the EDA notebook) ===
const KPIs = {
  totalSales: 853098713.02,
  totalCarPrice: 649092193.46,
  totalRecords: 1000,
  totalSuppliers: 362,
  totalCities: 300,
  totalCarBrands: 54,
};

const genderData = [
  { gender: "Female", quantity: 687, sales: 436200000 },
  { gender: "Male", quantity: 613, sales: 416898713 },
];

const topCities = [
  { city: "Washington", sales: 28500000, quantity: 22 },
  { city: "New York City", sales: 26100000, quantity: 21 },
  { city: "Houston", sales: 18200000, quantity: 19 },
  { city: "Dallas", sales: 17800000, quantity: 19 },
  { city: "Chicago", sales: 14100000, quantity: 16 },
  { city: "Phoenix", sales: 13600000, quantity: 15 },
  { city: "Los Angeles", sales: 12900000, quantity: 14 },
  { city: "San Antonio", sales: 11200000, quantity: 13 },
  { city: "Philadelphia", sales: 10800000, quantity: 12 },
  { city: "San Diego", sales: 9900000, quantity: 11 },
];

const topCarBrands = [
  { brand: "Chevrolet", quantity: 125, sales: 75090000 },
  { brand: "Lamborghini", quantity: 118, sales: 70200000 },
  { brand: "Toyota", quantity: 112, sales: 64800000 },
  { brand: "Ford", quantity: 105, sales: 59400000 },
  { brand: "BMW", quantity: 98, sales: 58200000 },
  { brand: "Honda", quantity: 90, sales: 51300000 },
  { brand: "Audi", quantity: 86, sales: 49800000 },
  { brand: "Mercedes", quantity: 82, sales: 46200000 },
  { brand: "Volkswagen", quantity: 75, sales: 39600000 },
  { brand: "Porsche", quantity: 68, sales: 36900000 },
];

const topSuppliers = [
  { name: "Feedfish", sales: 12800000, quantity: 18 },
  { name: "Kazu", sales: 11200000, quantity: 16 },
  { name: "Skyvu", sales: 10600000, quantity: 15 },
  { name: "Gabcube", sales: 9800000, quantity: 14 },
  { name: "Quatz", sales: 9200000, quantity: 13 },
  { name: "Dazzlesphere", sales: 8900000, quantity: 12 },
  { name: "Divanoodle", sales: 8100000, quantity: 11 },
  { name: "Bluejam", sales: 7600000, quantity: 10 },
  { name: "Innotype", sales: 7200000, quantity: 9 },
  { name: "Voonix", sales: 6800000, quantity: 8 },
];

const feedbackData = [
  { feedback: "Very Bad", count: 312 },
  { feedback: "Bad", count: 278 },
  { feedback: "Neutral", count: 196 },
  { feedback: "Good", count: 142 },
  { feedback: "Very Good", count: 72 },
];

const shipModeData = [
  { mode: "Second Class", quantity: 310, sales: 265000000 },
  { mode: "First Class", quantity: 260, sales: 222000000 },
  { mode: "Standard", quantity: 240, sales: 198000000 },
  { mode: "Same Day", quantity: 190, sales: 168098713 },
];

const shippingData = [
  { method: "Air", quantity: 420, sales: 358000000 },
  { method: "Ground", quantity: 310, sales: 264000000 },
  { method: "Sea", quantity: 270, sales: 231098713 },
];

const carModelYearDist = [
  { year: "Pre-1975", count: 18 },
  { year: "1975-1984", count: 45 },
  { year: "1985-1994", count: 112 },
  { year: "1995-2004", count: 234 },
  { year: "2005-2014", count: 378 },
  { year: "2015+", count: 213 },
];

const FEEDBACK_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
const SHIP_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];
const SHIP_METHOD_COLORS = ["#0ea5e9", "#38bdf8", "#7dd3fc"];

const fmt = (n) =>
  n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` :
  n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` :
  n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K` : `$${n}`;

const fmtNum = (n) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` :
  n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : `${n}`;

const CustomTooltip = ({ active, payload, label, prefix = "$", isMoney = true }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(15,18,30,0.97)", border: "1px solid rgba(139,92,246,0.4)",
        borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#e2e8f0",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
      }}>
        <p style={{ fontWeight: 700, marginBottom: 4, color: "#a78bfa" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}: {isMoney && p.name?.toLowerCase().includes("sales") ? fmt(p.value) : p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const KPICard = ({ label, value, sub, accent, icon }) => (
  <div style={{
    background: "linear-gradient(135deg, rgba(30,32,54,0.9) 0%, rgba(20,22,40,0.95) 100%)",
    border: `1px solid ${accent}33`,
    borderRadius: 16, padding: "20px 24px",
    boxShadow: `0 0 30px ${accent}18`,
    position: "relative", overflow: "hidden", flex: "1 1 160px"
  }}>
    <div style={{
      position: "absolute", top: -10, right: -10, fontSize: 64, opacity: 0.07,
      lineHeight: 1, userSelect: "none"
    }}>{icon}</div>
    <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color: accent, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{sub}</div>}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
  </div>
);

const SectionTitle = ({ children, accent = "#8b5cf6" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, marginTop: 8 }}>
    <div style={{ width: 4, height: 22, borderRadius: 2, background: accent }} />
    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Syne', sans-serif", letterSpacing: "0.02em" }}>
      {children}
    </h2>
  </div>
);

const Panel = ({ children, style = {} }) => (
  <div style={{
    background: "rgba(15,18,30,0.8)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: 24, backdropFilter: "blur(10px)",
    ...style
  }}>
    {children}
  </div>
);

const TABS = ["Overview", "Sales & City", "Suppliers", "Cars", "Shipping & Feedback"];

export default function SupplyChainDashboard() {
  const [tab, setTab] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setAnimate(true), 100);
  }, []);

  useEffect(() => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 80);
  }, [tab]);

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #080b18 0%, #0f1220 50%, #080b18 100%)",
      fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0",
      position: "relative", overflow: "hidden"
    }}>
      {/* Background orbs */}
      <div style={{
        position: "fixed", top: "10%", left: "5%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />
      <div style={{
        position: "fixed", bottom: "10%", right: "5%", width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", color: "#6366f1", textTransform: "uppercase", marginBottom: 6 }}>
                ◆ Analytics Platform
              </div>
              <h1 style={{
                margin: 0, fontSize: 32, fontWeight: 800, fontFamily: "'Syne', sans-serif",
                background: "linear-gradient(90deg, #e2e8f0 0%, #a78bfa 60%, #38bdf8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                lineHeight: 1.15
              }}>
                Car Supply Chain<br />Management Dashboard
              </h1>
              <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 13 }}>
                1,000 transactions · 362 suppliers · 54 car brands · 300 cities
              </p>
            </div>
            <div style={{
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 10, padding: "8px 16px", fontSize: 12, color: "#818cf8",
              alignSelf: "flex-start"
            }}>
              📊 EDA Insights
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              background: tab === i ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.05)",
              color: tab === i ? "#fff" : "#94a3b8",
              boxShadow: tab === i ? "0 4px 16px rgba(99,102,241,0.4)" : "none",
              transition: "all 0.2s",
            }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(10px)", transition: "all 0.35s ease" }}>

          {/* === TAB 0: OVERVIEW === */}
          {tab === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {/* KPI Row */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <KPICard label="Total Revenue" value={fmt(KPIs.totalSales)} sub="From all car sales" accent="#8b5cf6" icon="💰" />
                <KPICard label="Total Car Value" value={fmt(KPIs.totalCarPrice)} sub="Listed car prices" accent="#06b6d4" icon="🚗" />
                <KPICard label="Transactions" value={KPIs.totalRecords.toLocaleString()} sub="Orders processed" accent="#10b981" icon="📦" />
                <KPICard label="Suppliers" value={KPIs.totalSuppliers} sub="Unique vendors" accent="#f59e0b" icon="🏭" />
                <KPICard label="Cities" value={KPIs.totalCities} sub="Markets covered" accent="#ef4444" icon="🏙️" />
                <KPICard label="Car Brands" value={KPIs.totalCarBrands} sub="Brands available" accent="#ec4899" icon="⭐" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {/* Gender Sales */}
                <Panel>
                  <SectionTitle accent="#8b5cf6">Sales by Gender</SectionTitle>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={genderData} barSize={52}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="gender" tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={fmt} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]}
                        fill="url(#genderGrad)" />
                      <defs>
                        <linearGradient id="genderGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 14, marginTop: 12, justifyContent: "center" }}>
                    {genderData.map(g => (
                      <div key={g.gender} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{g.gender}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#a78bfa" }}>{g.quantity} cars</div>
                      </div>
                    ))}
                  </div>
                </Panel>

                {/* Customer Feedback Donut */}
                <Panel>
                  <SectionTitle accent="#ef4444">Customer Feedback</SectionTitle>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={feedbackData} dataKey="count" nameKey="feedback"
                        cx="50%" cy="50%" outerRadius={80} innerRadius={45}
                        paddingAngle={3}
                        label={({ feedback, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}>
                        {feedbackData.map((_, i) => (
                          <Cell key={i} fill={FEEDBACK_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [v, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 6 }}>
                    {feedbackData.map((f, i) => (
                      <div key={f.feedback} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: FEEDBACK_COLORS[i] }} />
                        <span style={{ color: "#94a3b8" }}>{f.feedback}</span>
                        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{f.count}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(239,68,68,0.08)", borderRadius: 8, fontSize: 12, color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
                    ⚠️ 59% of customers rated experience as Bad or Very Bad
                  </div>
                </Panel>
              </div>

              {/* Car Model Year Distribution */}
              <Panel>
                <SectionTitle accent="#06b6d4">Car Model Year Distribution</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={carModelYearDist}>
                    <defs>
                      <linearGradient id="yearGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip isMoney={false} />} />
                    <Area type="monotone" dataKey="count" name="Records" stroke="#06b6d4" fill="url(#yearGrad)" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>💡 Models pre-1975 are outliers; peak inventory in the 2005–2014 range</p>
              </Panel>
            </div>
          )}

          {/* === TAB 1: SALES & CITY === */}
          {tab === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <KPICard label="Top City Revenue" value="$28.5M" sub="Washington D.C." accent="#8b5cf6" icon="🏛️" />
                <KPICard label="Top City Cars" value="22" sub="Washington D.C." accent="#06b6d4" icon="🚗" />
                <KPICard label="Cities Over $15M" value="2" sub="NYC & Washington" accent="#10b981" icon="🌆" />
              </div>

              <Panel>
                <SectionTitle accent="#8b5cf6">Top 10 Cities — Revenue</SectionTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topCities} layout="vertical" barSize={18}>
                    <defs>
                      <linearGradient id="cityGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tickFormatter={fmt} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="city" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sales" name="Sales" radius={[0, 6, 6, 0]} fill="url(#cityGrad)" />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <SectionTitle accent="#06b6d4">Top 10 Cities — Cars Sold vs Revenue</SectionTitle>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topCities} barGap={4}>
                    <defs>
                      <linearGradient id="salesG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                      <linearGradient id="qtyG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="city" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                    <YAxis yAxisId="sales" tickFormatter={fmt} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="qty" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
                    <Bar yAxisId="sales" dataKey="sales" name="Sales" fill="url(#salesG)" radius={[4, 4, 0, 0]} barSize={18} />
                    <Bar yAxisId="qty" dataKey="quantity" name="Quantity" fill="url(#qtyG)" radius={[4, 4, 0, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          )}

          {/* === TAB 2: SUPPLIERS === */}
          {tab === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <KPICard label="Total Suppliers" value="362" sub="Unique vendors" accent="#f59e0b" icon="🏭" />
                <KPICard label="Top Supplier" value="Feedfish" sub="$12.8M revenue" accent="#8b5cf6" icon="🥇" />
                <KPICard label="Worst Feedback" value="Divanoodle" sub="Most 'Very Bad' reviews" accent="#ef4444" icon="⚠️" />
              </div>

              <Panel>
                <SectionTitle accent="#f59e0b">Top 10 Suppliers — Revenue</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topSuppliers} layout="vertical" barSize={16}>
                    <defs>
                      <linearGradient id="supGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tickFormatter={fmt} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sales" name="Sales" radius={[0, 6, 6, 0]} fill="url(#supGrad)" />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <SectionTitle accent="#ec4899">Feedback Breakdown</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={feedbackData} dataKey="count" nameKey="feedback"
                        cx="50%" cy="50%" outerRadius={90}
                        paddingAngle={4}
                        label={({ feedback, count }) => `${feedback}: ${count}`}
                        labelLine={{ stroke: "#475569", strokeWidth: 1 }}>
                        {feedbackData.map((_, i) => (
                          <Cell key={i} fill={FEEDBACK_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
                    {feedbackData.map((f, i) => (
                      <div key={f.feedback} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: FEEDBACK_COLORS[i], flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, color: "#94a3b8" }}>{f.feedback}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: FEEDBACK_COLORS[i] }}>{f.count}</span>
                          </div>
                          <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginTop: 3 }}>
                            <div style={{ height: "100%", width: `${(f.count / 1000) * 100}%`, background: FEEDBACK_COLORS[i], borderRadius: 2 }} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: "10px 12px", background: "rgba(239,68,68,0.08)", borderRadius: 8, fontSize: 12, color: "#fca5a5", border: "1px solid rgba(239,68,68,0.18)", marginTop: 4 }}>
                      🚨 Customers ordering 2+ cars reported higher dissatisfaction
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          )}

          {/* === TAB 3: CARS === */}
          {tab === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <KPICard label="Most Sold Brand" value="Chevrolet" sub="125 units · $75M" accent="#10b981" icon="🏆" />
                <KPICard label="Highest Revenue" value="Chevrolet" sub="$75.09M total" accent="#8b5cf6" icon="💎" />
                <KPICard label="Luxury Leader" value="Lamborghini" sub="$70.2M · 118 units" accent="#f59e0b" icon="🦊" />
                <KPICard label="Top Chevrolet Model" value="Camaro" sub="Highest sales model" accent="#06b6d4" icon="⚡" />
              </div>

              <Panel>
                <SectionTitle accent="#10b981">Top 10 Car Brands — Units Sold</SectionTitle>
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={topCarBrands} barSize={32}>
                    <defs>
                      <linearGradient id="carGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="brand" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={45} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip isMoney={false} />} />
                    <Bar dataKey="quantity" name="Units Sold" radius={[6, 6, 0, 0]} fill="url(#carGrad)" />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <SectionTitle accent="#6366f1">Top 10 Car Brands — Revenue Generated</SectionTitle>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={topCarBrands}>
                    <defs>
                      <linearGradient id="carRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="brand" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={45} />
                    <YAxis tickFormatter={fmt} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="sales" name="Sales" stroke="#8b5cf6" fill="url(#carRevGrad)" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          )}

          {/* === TAB 4: SHIPPING & FEEDBACK === */}
          {tab === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <KPICard label="Most Used Mode" value="2nd Class" sub="310 shipments" accent="#6366f1" icon="📦" />
                <KPICard label="Top Shipping" value="Air" sub="420 deliveries" accent="#0ea5e9" icon="✈️" />
                <KPICard label="Air Revenue" value="$358M" sub="42% of total" accent="#8b5cf6" icon="💫" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <Panel>
                  <SectionTitle accent="#6366f1">Ship Mode Distribution</SectionTitle>
                  <ResponsiveContainer width="100%" height={210}>
                    <PieChart>
                      <Pie data={shipModeData} dataKey="quantity" nameKey="mode"
                        cx="50%" cy="50%" outerRadius={85} innerRadius={40}
                        paddingAngle={4}
                        label={({ mode, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}>
                        {shipModeData.map((_, i) => (
                          <Cell key={i} fill={SHIP_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
                    {shipModeData.map((s, i) => (
                      <div key={s.mode} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: SHIP_COLORS[i] }} />
                        <span style={{ color: "#94a3b8" }}>{s.mode}</span>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel>
                  <SectionTitle accent="#0ea5e9">Shipping Method — Revenue</SectionTitle>
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart data={shippingData} barSize={44}>
                      <defs>
                        <linearGradient id="shipAir" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#0369a1" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="method" tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={fmt} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="sales" name="Sales" fill="url(#shipAir)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
              </div>

              <Panel>
                <SectionTitle accent="#f59e0b">Ship Mode vs. Sales & Quantity</SectionTitle>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={shipModeData} barGap={6}>
                    <defs>
                      <linearGradient id="smS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                      <linearGradient id="smQ" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="mode" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="s" tickFormatter={fmt} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="q" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
                    <Bar yAxisId="s" dataKey="sales" name="Sales" fill="url(#smS)" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar yAxisId="q" dataKey="quantity" name="Quantity" fill="url(#smQ)" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(99,102,241,0.08)", borderRadius: 8, fontSize: 12, color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.18)" }}>
                  💡 Second Class is the most preferred ship mode · Air delivery dominates by revenue (42%)
                </div>
              </Panel>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 36, color: "#334155", fontSize: 11, letterSpacing: "0.06em" }}>
          CAR SUPPLY CHAIN MANAGEMENT · EDA DASHBOARD · 1,000 RECORDS
        </div>
      </div>
    </div>
  );
}
