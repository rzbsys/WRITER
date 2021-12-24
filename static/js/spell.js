var now = -1, origin, edit;

function replacetext(text1, text2) {
    var text = $('textarea').val();
    text = text.replace(text1, text2);
    $('textarea').val(text);
}

function display() {
    $('#O1').text(origin[now]);
    $('#O2').text(edit[now]);
}

$('#O1').on('click', () => {
    next_step();
});

$('#O2').on('click', () => {
    replacetext(origin[now], edit[now]);
    next_step();
});


function reset() {
    now = -1, origin = null, edit = null;
    $('.spell-load-text').html('작성된 글을 검토하는 중입니다.');
    progress(0, 1);
}

function end_spell() {
    $('.spell-load-text').html('검토를 모두 마쳤습니다.<br>맞춤법 검사기가 종료됩니다.');
    $('.spell_ckt-load').fadeIn();
    setTimeout(() => {
        $('.spell_ckt').fadeOut();
        reset();
    }, 500);
    var text = $('textarea').val();
    localStorage.setItem('text', text);

}

function next_step() {
    now = now + 1;
    console.log(now, origin.length);
    while (origin[now] == edit[now]) {        
        if (now >= origin.length) {
            console.log('out!');
            end_spell();
            break;
        }
        now = now + 1;
    }
    progress(now, origin.length);
    display();
}


function start_spell() {
    $('.spell_ckt').fadeIn();
    var text = $('textarea').val();
    post('/spellcheck', {'text':text}, (res) => {
        origin = res['origin'];
        edit = res['spellckt'];
        console.log(origin, edit);
        next_step();
        setTimeout(() => {
            $('.spell_ckt-load').fadeOut();
        }, 500);
    });
}



