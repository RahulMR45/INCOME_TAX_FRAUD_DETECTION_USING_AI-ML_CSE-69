import React, { useState, useEffect } from "react";
import './App.css';

const WelcomeScreen = ({ onEnter }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUW3JaGNz-dHba3TiXA2cVTZJtA39l95ELcA&s" alt="income_tax" />
        <h1 className="welcome-title">Welcome Tax Officer</h1>
        <h2 className="welcome-subtitle">Income Tax Fraud Detection System</h2>
        <p className="welcome-text">
          Access the advanced fraud detection system to analyze and verify tax declarations.
          This system uses machine learning models to identify potential fraudulent cases.
        </p>
        <h5>Powered by : Team 67</h5>
        <button className="enter-button" onClick={onEnter}>
          Enter System
        </button>
      </div>
    </div>
  );
};

const ModelSelector = ({ selectedModel, onModelSelect }) => {
  const models = [
    { id: 'logistic_regression', name: 'Logistic Regression', description: 'Best for linear decision boundaries' },
    { id: 'random_forest', name: 'Random Forest', description: 'Excellent for complex patterns' },
    { id: 'decision_tree', name: 'Decision Tree', description: 'Simple and interpretable' },
    { id: 'svm', name: 'Support Vector Machine', description: 'Effective for high-dimensional data' }
  ];

  return (
    <div className="model-selector-container">
      <label className="model-selection-label">Select Model:</label>
      <div className="model-grid">
        {models.map((model) => (
          <div
            key={model.id}
            className={`model-box ${selectedModel === model.id ? 'selected' : ''}`}
            onClick={() => onModelSelect(model.id)}
          >
            <h3>{model.name}</h3>
            <p>{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FraudDetectionForm = () => {
  const [formData, setFormData] = useState({
    incomeDeclared: '',
    businessRevenue: '',
    expenses: '',
    livingCost: '',
    luxurySpending: '',
    onlineSpending: '',
    propertyTax: '',
    carMaintenance: '',
    employeeSalary: '',
    modelType: ''
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModelSelect = (modelType) => {
    setFormData(prev => ({ ...prev, modelType }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.error) {
        setResult({ message: `Error: ${data.error}`, isError: true });
      } else {
        setResult({
          message: data.Fraud_Detected ? "FRAUD DETECTED!" : "NO FRAUD DETECTED",
          isFraud: data.Fraud_Detected
        });
      }
    } catch (error) {
      setResult({ message: "Error connecting to server", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [result]);

  return (
    <div className="form-container">
      <h1>Income Tax Fraud Detection</h1>
      <form onSubmit={handleSubmit}>
        <center><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUW3JaGNz-dHba3TiXA2cVTZJtA39l95ELcA&s" alt="income_tax" /></center>

        <input
          type="text"
          name="incomeDeclared"
          placeholder="Income Declared"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="businessRevenue"
          placeholder="Business Revenue"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="livingCost"
          placeholder="Living Cost"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="luxurySpending"
          placeholder="Luxury Spending"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="onlineSpending"
          placeholder="Online Spending"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="propertyTax"
          placeholder="Property Tax"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="carMaintenance"
          placeholder="Car Maintenance"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="employeeSalary"
          placeholder="Employee Salary"
          onChange={handleChange}
          required
        />

        <ModelSelector
          selectedModel={formData.modelType}
          onModelSelect={handleModelSelect}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Checking..." : "Check for Fraud"}
        </button>

        {result && (
          <h1 className={`result-message ${result.isFraud ? 'fraud' : result.isError ? 'error' : 'no-fraud'}`}>
            {result.message}
          </h1>
        )}
      </form>
    </div>
  );
};

const App = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="app">
      {!showForm ? (
        <WelcomeScreen onEnter={() => setShowForm(true)} />
      ) : (
        <FraudDetectionForm />
      )}
    </div>
  );
};

export default App;
