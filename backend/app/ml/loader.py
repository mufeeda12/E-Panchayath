import joblib
import os

<<<<<<< HEAD
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

category_model = joblib.load(os.path.join(BASE_DIR, "models/categoryprediction.pkl"))
priority_model = joblib.load(os.path.join(BASE_DIR, "models/priorityprediction.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "models/vectorizer.pkl"))
=======
# Category
category_model = joblib.load("app/ml/models/categoryprediction/category.pkl")
category_vectorizer = joblib.load("app/ml/models/categoryprediction/cvectorizer.pkl")

# Priority
priority_model = joblib.load("app/ml/models/priorityprediction/priority.pkl")
priority_vectorizer = joblib.load("app/ml/models/priorityprediction/pvectorizer.pkl")
>>>>>>> mlmodel
