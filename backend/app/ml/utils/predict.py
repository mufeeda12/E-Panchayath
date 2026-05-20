# function for predictions
from app.ml.loader import (
    category_model,
    priority_model,
    category_vectorizer,
    priority_vectorizer
)

CATEGORY_LABELS = {
    1: "Drainage Issue",
    0: "Electricity Issue",
    2: "Public Service",
    3: "Health Issue",
    4: "Road Issue",
    5: "Garbage Issue",
    6: "Water Supply Issue",
}

def predict_category(text: str):
    vec = category_vectorizer.transform([text])
    label = category_model.predict(vec)[0]
    return CATEGORY_LABELS.get(label, str(label))


def get_category_label(category):
    if category is None:
        return None
    try:
        label = int(category)
    except (TypeError, ValueError):
        return category
    return CATEGORY_LABELS.get(label, str(label))


def predict_priority(text: str):
    vec = priority_vectorizer.transform([text])
    return priority_model.predict(vec)[0]