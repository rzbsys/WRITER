$('.frame').scroll(function () {
    var now = $('.frame').scrollTop();
    if (now > 10) {
        $('header').addClass("scrolled");
    } else {
        $('header').removeClass("scrolled");
    }
});


$('.start_service').on('click', () => {
    location.href = '/pass';
});
