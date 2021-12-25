from tfidf import tfidfScorer



def keyword_extractor(document):
    res = tfidfScorer([document])
    data = set()
    for i in res:
        for t in i:
            data.add(t[0])
    return list(data)

