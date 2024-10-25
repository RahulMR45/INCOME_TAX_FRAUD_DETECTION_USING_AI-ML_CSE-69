import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import joblib

# Assuming df is your DataFrame
# Prepare the data
df=pd.read_csv("income_tax_fraud_detection_data.csv")
X = df.drop(columns=['potential_tax_fraud'])
y = df['potential_tax_fraud']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=30)

# Apply SMOTE
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# Standardize features
scaler = StandardScaler()
X_train_resampled = scaler.fit_transform(X_train_resampled)
X_test = scaler.transform(X_test)

# Train the model
logistic_model = LogisticRegression(C=0.5, solver='liblinear')
logistic_model.fit(X_train_resampled, y_train_resampled)

# Save the model
joblib.dump(logistic_model, 'logistic_model.pkl')
joblib.dump(scaler, 'logistic_scaler.pkl')

# Make predictions function
def predict_logistic_regression(input_data):
    scaler = joblib.load('logistic_scaler.pkl')
    model = joblib.load('logistic_model.pkl')
    feature_names = ['income_declared', 'business_revenue', 'living_cost', 
                     'luxury_spending', 'online_spending', 'property_tax', 
                     'car_maintenance', 'employee_salary', 'expenses', 
                     'income_to_expense_ratio', 'estimated_income', 
                     'income_difference', 'total_expenditure', 
                     'spending_to_income_ratio', 'high_value_purchase_flag', 
                     'excessive_spending_flag']

    input_data_df = pd.DataFrame(input_data, columns=feature_names)
    
    # Preprocess input
    input_data_scaled = scaler.transform(input_data_df)  
    prediction = model.predict(input_data_scaled)
    
    #print(prediction)
    return prediction[0] 
