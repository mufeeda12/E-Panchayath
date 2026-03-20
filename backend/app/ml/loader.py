import joblib

category_model = joblib.load("app/ml/models/categoryprediction.pkl")
priority_model = joblib.load("app/ml/models/priorityprediction.pkl")
vectogit branchrizer = joblib.load("app/ml/models/vectorizer.pkl")