from konlpy.tag import Okt
okt = Okt()

def keyword_extractor(text):
    tokens = okt.nouns(text)
    tokens = [ token for token in tokens if len(token) > 1 ] # 한 글자인 단어는 제외
    count_dict = [(token, text.count(token)) for token in tokens ]
    ranked_words = sorted(count_dict, key=lambda x:x[1], reverse=True)[:10]
    return [ keyword for keyword, freq in ranked_words ]