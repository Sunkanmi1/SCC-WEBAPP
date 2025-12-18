import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/AnalyticsDashboard.css";
import { Case } from "../App";
import html2pdf from "html2pdf.js";

const COLORS = ["#4361ee", "#4cc9f0", "#3a0ca3", "#2ec4b6", "#ff9f1c"];

const AnalyticsDashboard: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch(`http://localhost:9090/search`);

        if (!response.ok) {
          throw new Error("Failed to fetch cases");
        }

        const data = await response.json();

        console.log("data", data);
        setCases(data.results || data); // supports both response shapes
      } catch (err) {
        setError("Unable to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const totalCases = cases.length;

  const casesByYear = useMemo(() => {
    const map: Record<string, number> = {};
    cases?.forEach((c) => {
      const year = c.date.split("-")[0];
      map[year] = (map[year] || 0) + 1;
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, count]) => ({ year, count }));
  }, [cases]);

  const casesByType = useMemo(() => {
    const map: Record<string, number> = {};
    cases.forEach((c) => {
      const type = c.type || "Unknown";
      map[type] = (map[type] || 0) + 1;
    });

    return Object.entries(map).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }));
  }, [cases]);

  const mostActiveJudges = useMemo(() => {
    const map: Record<string, number> = {};

    cases.forEach((c) => {
      c.judges.split(",").forEach((j) => {
        const judge = j.trim();
        if (judge) map[judge] = (map[judge] || 0) + 1;
      });
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [cases]);

  const usageTrends = useMemo(() => {
    const map: Record<string, number> = {};

    cases.forEach((c) => {
      const month = c.date.slice(0, 7); // YYYY-MM
      map[month] = (map[month] || 0) + 1;
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month,
        searches: count,
      }));
  }, [cases]);

  const exportCSV = () => {
    const rows = [
      ["Case ID", "Title", "Date", "Court", "Judges"],
      ...cases.map((c) => [c.caseId, c.title, c.date, c.court, c.judges]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "case-analytics.csv";
    link.click();
  };

  const exportPDF = () => {
    if (!dashboardRef.current) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: "case-analytics.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(dashboardRef.current)
      .save();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="analytics-dashboard">Loading analytics…</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="analytics-dashboard error">{error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div ref={dashboardRef} className="analytics-dashboard">
        <h1>Analytics & Insights</h1>

        {/* SUMMARY */}
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Cases</h3>
            <p>{totalCases.toLocaleString()}</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="charts-grid">
          {/* CASES BY YEAR */}
          <div className="chart-card">
            <h3>Cases by Year</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={casesByYear}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Cases" fill="#4361ee" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* CASE TYPE DISTRIBUTION */}
          <section className="pdf-page-break">
            <div className="chart-card">
              <h3>Case Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={casesByType}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {casesByType.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* MOST ACTIVE JUDGES */}
          <section className="pdf-page-break">
            <div className="chart-card">
              <h3>Most Active Judges</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={mostActiveJudges}
                  layout="vertical"
                  margin={{ left: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Cases Handled" fill="#4cc9f0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="pdf-page-break">
            <div className="chart-card">
              <h3>Search & Usage Trends</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={usageTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="searches"
                    name="Search Activity"
                    stroke="#4361ee"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="analytics-actions">
          <button onClick={exportPDF}>Export PDF</button>
          <button onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AnalyticsDashboard;
