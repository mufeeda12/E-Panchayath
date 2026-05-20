import re
import string
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

from app.ml.loader import (
    category_model,
    priority_model,
    category_vectorizer,
    priority_vectorizer
)

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.stem.porter import PorterStemmer

    ps = PorterStemmer()
    nltk.download("punkt", quiet=True)
    nltk.download("stopwords", quiet=True)
    HAVE_NLTK = True
except ImportError:
    HAVE_NLTK = False

PRIORITY_LABELS = {
    0: "High",
    1: "Low",
    2: "Medium",
}


def transform_text(text: str) -> str:
    text = text.lower()
    if HAVE_NLTK:
        tokens = nltk.word_tokenize(text)
        tokens = [token for token in tokens if token.isalnum()]
        tokens = [token for token in tokens if token not in stopwords.words("english")]
        tokens = [ps.stem(token) for token in tokens]
    else:
        tokens = re.findall(r"\b[a-z0-9]+\b", text)
        tokens = [token for token in tokens if token not in ENGLISH_STOP_WORDS]
    return " ".join(tokens)


def predict_category(text: str):
    vec = category_vectorizer.transform([transform_text(text)])
    return category_model.predict(vec)[0]


def predict_priority(text: str):
    vec = priority_vectorizer.transform([transform_text(text)])
    prediction = priority_model.predict(vec)[0]
    return PRIORITY_LABELS.get(prediction, "Low")
