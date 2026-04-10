import joblib

# Category
category_model = joblib.load("app/ml/models/categoryprediction/category.pkl")
category_vectorizer = joblib.load("app/ml/models/categoryprediction/cvectorizer.pkl")

# Priority
priority_model = joblib.load("app/ml/models/priorityprediction/priority.pkl")
priority_vectorizer = joblib.load("app/ml/models/priorityprediction/pvectorizer.pkl")