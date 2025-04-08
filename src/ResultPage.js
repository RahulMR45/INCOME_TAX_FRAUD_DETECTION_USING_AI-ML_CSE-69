import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './App.css';
Chart.register(...registerables);

const ResultPage = ({ result, selectedModel, onRetry, onHome }) => {
  const modelImages = {
    logistic_regression: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAjDJm-n8hMETs2cNjrbM09wr5cZSHb6uRfw&s",
    random_forest: "https://www.analytixlabs.co.in/blog/wp-content/uploads/2023/09/Random-Forest-Regression.jpg",
    decision_tree: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-fBwyH61an50bb16cn2KJHD0xI2LGOSIPQg&s",
    svm: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRclzN5ZIEFQJm0fjq4HdzdBdsTQRJ2zr-Muw&s"
  };

  const modelNames = {
    logistic_regression: "Logistic Regression",
    random_forest: "Random Forest",
    decision_tree: "Decision Tree",
    svm: "Support Vector Machine"
  };

  // If there's an error or no result data
  if (result.isError || !result.confidence) {
    return (
      <div className="result-container">
        <h1 className="error">{result.message}</h1>
        <div className="result-buttons">
          <button onClick={onRetry}>Retry Detection</button>
          <button onClick={onHome}>Home</button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: result.top_contributing_factors.map(factor => factor.feature),
    datasets: [
      {
        label: 'Feature Importance',
        data: result.top_contributing_factors.map(factor => factor.importance * 100),
        backgroundColor: result.fraud_detected ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)',
        borderColor: result.fraud_detected ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Importance (%)'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Top Factors Contributing to Detection'
      }
    }
  };

  return (
    <div className="result-container">
      <div className="model-details">
        <h2>Model Used: {modelNames[selectedModel]}</h2>
        <img 
          src={modelImages[selectedModel]} 
          alt={modelNames[selectedModel]} 
          className="model-image" 
        />
      </div>
      
      <h1 className={`result-message ${result.fraud_detected ? 'fraud' : 'no-fraud'}`}>
        {result.fraud_detected ? "FRAUD DETECTED!" : "NO FRAUD DETECTED"}
      </h1>
      
      <div className="confidence-meter">
        <h3>Confidence Level: {(result.confidence * 100).toFixed(2)}%</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${result.confidence * 100}%`,
              backgroundColor: result.fraud_detected ? 
                `rgba(255, 0, 0, ${0.3 + result.confidence * 0.7})` : 
                `rgba(0, 255, 0, ${0.3 + result.confidence * 0.7})`
            }}
          ></div>
        </div>
        <p>Threshold: {(result.threshold * 100).toFixed(2)}%</p>
      </div>

      <div className="factors-container">
        <h3>Top Contributing Factors:</h3>
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
        
        <div className="factors-details">
          {result.top_contributing_factors.map((factor, index) => (
            <div key={index} className="factor-item">
              <h4>{factor.feature}</h4>
              <p>Value: {factor.value.toFixed(2)}</p>
              <p>Importance: {(factor.importance * 100).toFixed(2)}%</p>
              <p>Direction: <span className={factor.direction === "high" ? "high-value" : "low-value"}>
                {factor.direction}
              </span></p>
            </div>
          ))}
        </div>
      </div>

      <div className="key-metrics">
        <h3>Key Metrics:</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <h4>Income Difference:</h4>
            <p className={result.feature_values.income_difference > 0 ? "suspicious" : "normal"}>
              ${result.feature_values.income_difference.toFixed(2)}
            </p>
          </div>
          <div className="metric-item">
            <h4>Spending to Income Ratio:</h4>
            <p className={result.feature_values.spending_to_income_ratio > 0.8 ? "suspicious" : "normal"}>
              {(result.feature_values.spending_to_income_ratio * 100).toFixed(2)}%
            </p>
          </div>
          <div className="metric-item">
            <h4>Income to Expense Ratio:</h4>
            <p className={result.feature_values.income_to_expense_ratio < 1 ? "suspicious" : "normal"}>
              {result.feature_values.income_to_expense_ratio.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="result-buttons">
        <button onClick={onRetry}>Retry Detection</button>
        <button onClick={onHome}>Home</button>
      </div>
    </div>
  );
};

export default ResultPage;