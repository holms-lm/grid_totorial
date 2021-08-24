const toast = {
  $element: $('.js--server_alert'),
  showMessage(text) {
    $('.js--server_alert_text').html(text);
    this.$element.toast('show');
    this.initTimer();
  },
  hideMessage() {
    this.$element.toast('hide');
  },
  initTimer() {
    const $timer = $('.js--toast_timer');
    const $timerValue = $('.js--toast_timer_value');
    const $timerLess = $('.js--toast_timer_less');
    const start = Math.floor(new Date() / 1000);
    $timer.data('start', start);
    setInterval(() => {
      const seconds = Math.floor(new Date() / 1000 - start);
      const minuts = Math.floor(seconds / 60);
      if (minuts === 0) {
        $timerLess.removeClass('d-none');
        $timerValue.html(1);
      } else {
        $timerLess.addClass('d-none');
        $timerValue.html(minuts);
      }
    }, 1000);
  },
};

export default toast;
