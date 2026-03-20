# function for predictions
from app.ml.loader import category_model, priority_model, vectorizer

def predict_category(text: str):
    vec = vectorizer.transform([text])
    return category_model.predict(vec)[0]

def predict_priority(text: str):
    vec = vectorizer.transform([text])
    return priority_model.predict(vec)[0]