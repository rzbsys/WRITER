from flask import Flask, render_template, request, jsonify
from variable import *
import re
if ServiceAccess == True:
    from hanspell import spell_checker
    from tfidf import keyword_extractor
    from bertmodel import get_next_words

def spckt(text):
    spelled_sent = spell_checker.check(text)
    hanspell_sent = spelled_sent.checked
    return hanspell_sent

app = Flask(__name__)

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html', error=error, ErrTitle='페이지를 찾을 수 없습니다.', ServiceName=ServiceName)

@app.errorhandler(500)
def page_not_found(error):
    return render_template('404.html', error=error, ErrTitle='서버 내부 오류입니다.', ServiceName=ServiceName)


@app.route('/')
def main():
    return render_template('main.html', ServiceName=ServiceName)

@app.route('/write')
def writer():
    if ServiceAccess == True:
        return render_template('write.html', ServiceName=ServiceName)
    else:
        return render_template('404.html', error=str(ServiceName) + '은 현재 베타 서비스중입니다. 서버에 중대한 기술적 오류가 발견될 경우, 서비스가 일시적으로 중단될 수 있습니다.', ErrTitle='접근할 수 없습니다.', ServiceName=ServiceName)

@app.route('/keyword', methods=['POST'])
def keyword():
    text = request.get_json()['text']
    res = keyword_extractor(text)
    return jsonify({'res':res})

@app.route('/spellcheck', methods=['POST'])
def spellckt():
    text = request.get_json()['text']
    splited_text = re.split(r'[.,!?\n]', text)
    while True:
        try:
            splited_text.remove('')
        except:
            break
    edited_text = []
    for i in splited_text:
        edited_text += [spckt(i)]
    return jsonify({'origin':splited_text, 'spellckt':edited_text})
    
@app.route('/nextword', methods=['POST'])
def nextword():
    text = request.get_json()['text']
    res = get_next_words(text)
    return jsonify({'res':res})



if __name__ == '__main__':
    app.run('0.0.0.0', port=80, debug=True)