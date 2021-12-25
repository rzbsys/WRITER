from flask import Flask, render_template, request, jsonify, session, redirect, Response
from variable import *
import re
import os
if ServiceAccess == True:
    from hanspell import spell_checker
    from tfidf import keyword_extractor
    from bertmodel import get_next_words

def spckt(text):
    spelled_sent = spell_checker.check(text)
    hanspell_sent = spelled_sent.checked
    return hanspell_sent

app = Flask(__name__)
app.config['SECRET_KEY'] = str(os.urandom(12))

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
    if not 'pass' in session or session['pass'] != Password:
        return redirect('/pass')
    if ServiceAccess == True:
        return render_template('write.html', ServiceName=ServiceName)
    else:
        return render_template('404.html', error=str(ServiceName) + '은 현재 베타 서비스중입니다. 서버에 중대한 기술적 오류가 발견될 경우, 서비스가 일시적으로 중단될 수 있습니다.', ErrTitle='접근할 수 없습니다.', ServiceName=ServiceName)

@app.route('/pass', methods=['POST', 'GET'])
def password():
    if 'pass' in session and session['pass'] == Password:
        return redirect('/write')

    elif request.method == 'GET':
        return render_template('pass.html', ServiceName=ServiceName)

    elif request.method == 'POST':
        inp = request.form['PASS']
        if inp == Password:
            session['pass'] = inp
            return redirect('/write')
        else:
            return render_template('pass.html', err='비밀번호가 일치하지 않습니다.')


@app.route('/keyword', methods=['POST'])
def keyword():
    if not 'pass' in session or session['pass'] != Password:
        return jsonify({'redirect_url':'/expired', 'redirect':'yes'}), 400

    text = request.get_json()['text']
    res = keyword_extractor(text)
    return jsonify({'res':res})

@app.route('/expired')
def token_expired():
    return render_template('pass.html', ServiceName=ServiceName, err='세션이 만료되었습니다. 다시 로그인해주세요.')

@app.route('/spellcheck', methods=['POST'])
def spellckt():
    if not 'pass' in session or session['pass'] != Password:
        return jsonify({'redirect_url':'/expired', 'redirect':'yes'}), 400

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
    if not 'pass' in session or session['pass'] != Password:
        return jsonify({'redirect_url':'/expired', 'redirect':'no'}), 400

    text = request.get_json()['text']
    res = get_next_words(text)
    return jsonify({'res':res})



if __name__ == '__main__':
    app.run('0.0.0.0', port=80, debug=True)