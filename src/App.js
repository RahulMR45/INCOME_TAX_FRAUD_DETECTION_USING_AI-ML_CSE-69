import React, { useState } from "react";
import './App.css';
import EnhancedResultPage from './ResultPage';
import LoginPage from './LoginPage';

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

const FraudDetectionForm = ({ onResultComplete }) => {
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
        onResultComplete({ 
          message: `Error: ${data.error}`, 
          isError: true 
        }, formData.modelType);
      } else {
        // Pass the complete response data directly
        onResultComplete(data, formData.modelType);
      }
    } catch (error) {
      onResultComplete({ 
        message: "Error connecting to server", 
        isError: true 
      }, formData.modelType);
    } finally {
      setIsLoading(false);
    }
  };

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
      </form>
    </div>
  );
};

const App = () => {
  const [screen, setScreen] = useState("login");
  const [result, setResult] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");

  const handleResultComplete = (resultData, model) => {
    setResult(resultData);
    setSelectedModel(model);
    setScreen("result");
  };

  return (
    <div className="app">
      {screen === "login" && (
        <LoginPage onLogin={() => setScreen("welcome")} />
      )}
      {screen === "welcome" && (
        <WelcomeScreen onEnter={() => setScreen("detection")} />
      )}
      {screen === "detection" && (
        <FraudDetectionForm onResultComplete={handleResultComplete} />
      )}
      {screen === "result" && (
        <EnhancedResultPage 
          result={result}
          selectedModel={selectedModel}
          onRetry={() => setScreen("detection")}
          onHome={() => setScreen("welcome")}
        />
      )}
    </div>
  );
};

export default App;