import React, { useState, useEffect } from "react";
import { generateInsights, analyzeTrend } from "../utils/aiInsights";

// Professional icon mapping with clean symbols
const getIconSymbol = (iconName) => {
  const icons = {
    Analytics: "📊",
    Success: "✅",
    Savings: "💰",
    Warning: "⚠️",
    Search: "🔍",
    Forecast: "📈",
    TrendUp: "📈",
    TrendDown: "📉",
    Lightbulb: "💡",
    Optimize: "⚡",
    Shield: "🛡️"
  };
  return icons[iconName] || "📋";
};

function AIInsights({ transactions }) {
  const [aiData, setAiData] = useState({ insights: [], predictions: [], recommendations: [] });
  const [trend, setTrend] = useState(null);
  const [showSection, setShowSection] = useState("insights");

  useEffect(() => {
    console.log("AI Insights received transactions:", transactions);
    if (transactions && transactions.length > 0) {
      const data = generateInsights(transactions);
      const trendData = analyzeTrend(transactions, 7);
      console.log("Generated AI data:", data);
      console.log("Trend data:", trendData);
      setAiData(data);
      setTrend(trendData);
    }
  }, [transactions]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="ai-insights-container">
        <div className="ai-header">
          <h3>AI Insights</h3>
          <p className="ai-subtitle">Add transactions to get personalized insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-insights-container">
      <div className="ai-header">
        <h3>AI Insights</h3>
        <p className="ai-subtitle">Smart analysis of your financial patterns</p>
      </div>

      {/* Spending Trend Badge */}
      {trend && (
        <div className={`trend-badge trend-${trend.trend}`}>
          <span className="trend-icon">
            {trend.trend === "increasing" ? "📈" : trend.trend === "decreasing" ? "📉" : "➡️"}
          </span>
          <span className="trend-text">{trend.message}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="ai-tabs">
        <button
          className={`ai-tab ${showSection === "insights" ? "active" : ""}`}
          onClick={() => setShowSection("insights")}
        >
          Insights ({aiData.insights.length})
        </button>
        <button
          className={`ai-tab ${showSection === "predictions" ? "active" : ""}`}
          onClick={() => setShowSection("predictions")}
        >
          Forecasts ({aiData.predictions.length})
        </button>
        <button
          className={`ai-tab ${showSection === "recommendations" ? "active" : ""}`}
          onClick={() => setShowSection("recommendations")}
        >
          Recommendations ({aiData.recommendations.length})
        </button>
      </div>

      {/* Content */}
      <div className="ai-content">
        {showSection === "insights" && (
          <div className="ai-cards">
            {aiData.insights.length > 0 ? (
              aiData.insights.map((insight, index) => (
                <div key={index} className={`ai-card ai-card-${insight.type}`}>
                  <div className="ai-card-icon">
                    {getIconSymbol(insight.icon)}
                  </div>
                  <div className="ai-card-content">
                    <h4>{insight.title}</h4>
                    <p>{insight.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="ai-empty">No insights available yet. Keep tracking!</p>
            )}
          </div>
        )}

        {showSection === "predictions" && (
          <div className="ai-cards">
            {aiData.predictions.length > 0 ? (
              aiData.predictions.map((prediction, index) => (
                <div key={index} className="ai-card ai-card-prediction">
                  <div className="ai-card-icon">
                    {getIconSymbol(prediction.icon)}
                  </div>
                  <div className="ai-card-content">
                    <h4>{prediction.title}</h4>
                    <p>{prediction.message}</p>
                    <span className="confidence-badge">
                      Confidence: {prediction.confidence}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="ai-empty">Need more data for predictions</p>
            )}
          </div>
        )}

        {showSection === "recommendations" && (
          <div className="ai-cards">
            {aiData.recommendations.length > 0 ? (
              aiData.recommendations.map((rec, index) => (
                <div key={index} className="ai-card ai-card-recommendation">
                  <div className="ai-card-icon">
                    {getIconSymbol(rec.icon)}
                  </div>
                  <div className="ai-card-content">
                    <h4>{rec.title}</h4>
                    <p>{rec.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="ai-empty">You're doing great! No recommendations yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIInsights;
