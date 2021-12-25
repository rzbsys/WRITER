from math import log10
from konlpy.tag import Okt

okt = Okt()

def f(t, d):
    return d.count(t)

def tf(t, d):
    return 0.5 + 0.5*f(t,d)/max([f(w,d) for w in d])

def idf(t, D):
    numerator = len(D)
    denominator = 1 + len([ True for d in D if t in d])
    return log10(numerator/denominator)

def tfidf(t, d, D):
    return tf(t,d)*idf(t, D)

def keyword_extractor(text):
    tokens = okt.nouns(text)
    tokens = [token for token in tokens if len(token) > 1]  # 한 글자인 단어는 제외
    count_dict = [(token, text.count(token)) for token in tokens]
    ranked_words = sorted(count_dict, key=lambda x: x[1], reverse=True)[:40]
    return [keyword for keyword, freq in ranked_words]

def tfidfScorer(D):
    tokenized_D = [keyword_extractor(d) for d in D]
    result = []
    for d in tokenized_D:
        result.append([(t, tfidf(t, d, tokenized_D)) for t in d])
    return result
