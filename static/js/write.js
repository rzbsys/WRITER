var timer, ifedit = 0, savetimer, selected = 0, keywordflag = 0, maskflag = 0;
$('#Backup').hide();
$('.offline').hide();
$('.word-recommend').hide();
$('.spell_ckt').hide();

function progress(part, all) {
    $('.progress').css('width', part / all * 100 + '%');
}

function post(posturl, json, suc) {
    $.ajax({
        type: 'POST',
        url: posturl,
        data: JSON.stringify(json),
        dataType: 'json',
        contentType: 'application/json',
        success: function (result) {
            suc(result);
        },
        error: (err) => {
            Res = err['responseJSON']
            if (Res['redirect'] == 'yes') {
                location.href = Res['redirect_url'];
            } else {
                next_word_recommend_null(['추천 단어를 불러오는데 실패하였습니다. 토큰이 만료되었을 수 있습니다..']);
            }
        }
    });
}

function next_word_recommend(arr) {
    $('.word-recommend').hide();
    $('.word-recommend').empty();
    for (var i = 0; i < arr.length; i++) {
        var html = `<div class="words" onclick="javascript:change_mask('${arr[i]}')">${arr[i]}</div>`;
        $('.word-recommend').append(html);
    }
    $('.word-recommend').fadeIn();
    return;
}

function next_word_recommend_null(arr) {
    $('.word-recommend').hide();
    $('.word-recommend').empty();
    for (var i = 0; i < arr.length; i++) {
        var html = `<div class="words">${arr[i]}</div>`;
        $('.word-recommend').append(html);
    }
    $('.word-recommend').fadeIn();
    return;
}


next_word_recommend_null(['[MASK]를 적은 후, Ctrl + Enter를 눌러보세요.'])

function add_keyword(arr) {
    var html1 = '<div class="keywords">';
    var html2 = '</div>';
    $('.keywords-box').fadeOut();
    setTimeout(() => {
        $('.keywords-box').empty();
        for (var i = 0; i < arr.length; i++) {
            var html = html1 + '#' + arr[i] + html2;
            $('.keywords-box').append(html);
        }
        $('.keywords-box').fadeIn();
    }, 800);
}

function get_keyword() {
    timer = setInterval(() => {
        if (keywordflag == 1) {
            console.log('Start Logging');
            var text = $('textarea').val();
            var textarr = text.split(/[. ?!\n]/);
            let filtered = textarr.filter((element) => element !== '');
            if (filtered.length < 10) {
                console.log('10 < ');
                add_keyword(['단어수가 너무 적습니다.']);
                return;
            } else if (filtered.length > 100000) {
                console.log('100000 > ');
            }
            clearInterval(timer);
            post('/keyword', { 'text': text }, (res) => {
                add_keyword(res['res']);
                get_keyword();
            });
            keywordflag = 0;
        }
    }, 1000 * 30);
}


function getByte(str) {
    return str
        .split('')
        .map(s => s.charCodeAt(0))
        .reduce((prev, c) => (prev + ((c === 10) ? 2 : ((c >> 7) ? 2 : 1))), 0); // 계산식에 관한 설명은 위 블로그에 있습니다.
}

function get_last_sen(text) {
    var textarr = text.split(/[.?!\n]/);
    for (var i = 0; i < textarr.length; i++) {
        textarr[i] = textarr[i].trim();
        if (textarr[i] == '') {
            textarr.splice(i, 1);
        }
    }
    return textarr[textarr.length - 1];
}

function change_mask(word) {
    var text = $('textarea').val();
    text = text.replace('[MASK]', word);
    $('textarea').val(text);
    $('.word-recommend').hide();
}

var isCtrl, isEnter;

document.onkeyup = function (e) {
    if (e.which == 17) isCtrl = false;
    if (e.which == 13) isEnter = false;
}

document.onkeydown = function (e) {
    if (e.which == 17) isCtrl = true;
    if (e.which == 13) isEnter = true;
    if (isCtrl == true && isEnter == true && maskflag == 0) {
        console.log('start')
        var text = $('textarea').val();
        var lastsen = get_last_sen(text);
        if (lastsen.indexOf('[MASK]') != -1) {
            next_word_recommend_null(['로딩중']);
            maskflag = 1;
            post('/nextword', { 'text': lastsen }, (res) => {
                next_word_recommend(res['res']);
                setTimeout(() => {
                    maskflag = 0;
                    console.log('end');
                }, 1000)
            });
        }
        return false;
    }
}


$("textarea").on("change keyup paste", function (e) {
    $('#Backup').fadeOut();
    ifedit = 1;
    keywordflag = 1;
    clearInterval(savetimer);
    var text = $('textarea').val();
    $('.char-num').text(text.length + '자');
    $('.bytenum').text(getByte(text) + 'Byte');
    savetimer = setInterval(save, 500);
});




function save() {
    if (ifedit == 1) {
        $('#Backup').fadeIn();
        var text = $('textarea').val();
        localStorage.setItem('text', text);
        ifedit = 0;
    }
}

$(document).ready(() => {
    get_keyword();
    var text = localStorage.getItem('text');
    if (text != '' && text != null) {
        $('textarea').val(text);
        $('#Backup').fadeIn();
        $('.char-num').text(text.length + '자');
        $('.bytenum').text(getByte(text) + 'Byte');
    }


    setTimeout(() => {
        $('.load').fadeOut();
    }, 500);
});


$('.submit').on('click', () => {
    start_spell();
});


window.addEventListener('offline', () => {
    $('.offline').fadeIn();
});

window.addEventListener('online', () => {
    $('.offline').fadeOut();
});

$(".word-recommend").on('mousewheel', function (e) {
    var wheelDelta = e.originalEvent.wheelDelta;
    if (wheelDelta > 0) {
        $(this).scrollLeft(-wheelDelta + $(this).scrollLeft());
    } else {
        $(this).scrollLeft(-wheelDelta + $(this).scrollLeft());
    }
});


