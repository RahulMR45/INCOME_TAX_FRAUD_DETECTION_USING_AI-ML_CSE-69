import React, { useState } from "react";
import './App.css';

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

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      alert(`Fraud Detected: ${result.Fraud_Detected}`);
    }
  };

  return (
    <div>
      <h1>Income Tax Fraud Detection</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name="incomeDeclared" placeholder="Income Declared" onChange={handleChange} />
        <input type="text" name="businessRevenue" placeholder="Business Revenue" onChange={handleChange} />
        <input type="text" name="livingCost" placeholder="Living Cost" onChange={handleChange} />
        <input type="text" name="luxurySpending" placeholder="Luxury Spending" onChange={handleChange} />
        <input type="text" name="onlineSpending" placeholder="Online Spending" onChange={handleChange} />
        <input type="text" name="propertyTax" placeholder="Property Tax" onChange={handleChange} />
        <input type="text" name="carMaintenance" placeholder="Car Maintenance" onChange={handleChange} />
        <input type="text" name="employeeSalary" placeholder="Employee Salary" onChange={handleChange} />

        {/* Model Selection */}
        <select name="modelType" onChange={handleChange} required>
          <option value="">--Select Model--</option>
          <option value="logistic_regression">Logistic Regression</option>
          <option value="random_forest">Random Forest</option>
          <option value="decision_tree">Decision Tree</option>
          <option value="svm">Support Vector Machine</option>
        </select>

        <button type="submit">Check for Fraud</button>
      </form>
    </div>
  );
};

export default FraudDetectionForm;
