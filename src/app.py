from flask import Flask, request, jsonify
from flask_cors import CORS  
import numpy as np
from models.logistic_regression import predict_logistic_regression
from models.random_forest import predict_random_forest
from models.decision_tree import predict_decision_tree
from models.svm import predict_svm

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Validate and extract input data
        required_fields = ['incomeDeclared', 'businessRevenue', 'livingCost', 
                           'luxurySpending', 'onlineSpending', 'propertyTax', 
                           'carMaintenance', 'employeeSalary', 'modelType']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Convert inputs to float
        income_declared = float(data['incomeDeclared'])
        business_revenue = float(data['businessRevenue'])
        living_cost = float(data['livingCost'])
        luxury_spending = float(data['luxurySpending'])
        online_spending = float(data['onlineSpending'])
        property_tax = float(data['propertyTax'])
        car_maintenance = float(data['carMaintenance'])
        employee_salary = float(data['employeeSalary'])
        model_type = data['modelType']

        # Feature engineering
        expenses = living_cost + luxury_spending + online_spending + property_tax + car_maintenance + employee_salary
        income_to_expense_ratio = income_declared / expenses if expenses != 0 else 0
        estimated_income = business_revenue * 0.20
        income_difference = estimated_income - income_declared
        total_expenditure = living_cost + luxury_spending + online_spending
        spending_to_income_ratio = total_expenditure / income_declared if income_declared != 0 else 0
        high_value_purchase_flag = 1 if luxury_spending > 100000 else 0
        excessive_spending_flag = 1 if spending_to_income_ratio > 0.8 else 0

        # Create feature vector
        feature_vector = np.array([[income_declared, business_revenue, living_cost, luxury_spending,
                                    online_spending, property_tax, car_maintenance, employee_salary, expenses,
                                    income_to_expense_ratio, estimated_income, income_difference,
                                    total_expenditure, spending_to_income_ratio,
                                    high_value_purchase_flag, excessive_spending_flag]])

        # Predict using the selected model
        if model_type == 'logistic_regression':
            prediction = predict_logistic_regression(feature_vector)
        elif model_type == 'random_forest':
            prediction = predict_random_forest(feature_vector)
        elif model_type == 'decision_tree':
            prediction = predict_decision_tree(feature_vector)
        elif model_type == 'svm':
            prediction = predict_svm(feature_vector)
        else:
            return jsonify({'error': 'Invalid model type'}), 400

        # Return prediction result
        result = {'Fraud_Detected': bool(prediction)}
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
