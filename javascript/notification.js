
var Notification = new function(){
    this.timer = false;

    // Init notification system
    this.init = function(){
        // Countdown ONLY if not need "stay"
        if (localStorage.getItem('_notificationStay') !== 'true') {
            this.countDown();
        }
        else {
            localStorage['_notificationStay'] = false;
            this.cancelClose();
        }

        getData();
        setUpProgressbar();

        $('#liteLine').SetScroller({
            velocity: 50,
            direction: 'horizontal',
            startfrom: 'right',
            loop: 'infinite',
            movetype: 'linear',
            onmouseover: 'pause',
            onmouseout: 'play',
            onstartup: 'play',
            cursor: 'pointer'
        });

        $('#switchToLiteNotification').click(function () {
            showLiteNotification(true);
            setTimeout(window.close, 200);
        });

        $('#switchToFullNotification').click(function () {
            showNotification(true);
            setTimeout(window.close, 200);
        });

        controlInit();
        onTabCloseAccept();
    }

    this.countDown = function(){
        console.trace();
        var startTime = (new Date()).getTime();
        this.timer = setInterval(function(){
            var percent = Math.min(100, 100 / howLongDisplayNotification() * ( (new Date()).getTime() - startTime ));
            $('#countDown').width((100 - percent) + '%');

            if (percent === 100) {
                window.close();
            }
        }, 50);
    }

    this.cancelClose = function(){
        if (this.timer !== false) {
            clearInterval(this.timer);
        }

        $('#countDown').hide();
    }
}
