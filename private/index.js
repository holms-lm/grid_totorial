import 'bootstrap';
import 'jquery-mask-plugin';

// Blocks
// import './blocks/forms';
import responsiveTable from './blocks/responsive_table';
// import imgPreloader from './blocks/img_preloader/img_preloader';
import FormDispatcher from './blocks/form_dispatcher';
// import Validate from './blocks/form_dispatcher/classes/validate';
// import SendForm from './blocks/form_dispatcher/classes/send_form';
// import HandlerAnswer from './blocks/form_dispatcher/classes/handler_answer';
// Page
import main from './pages/main';

$(document).ready(() => {
  // imgPreloader.init();
  responsiveTable();
  main.addHandlers();
  $('.js--phone').mask('+38(000) 000-00-00');
  // $('.js--validate_form').validateForm();

  // Тесты:

  (new FormDispatcher($('.js--validate_form'), { formSelector: '.js--validate_form' })).init();

  // (new Validate($('.js--validate_form'))).init();

  // $('#add_button').click(() => {
  //   const sendForm = new SendForm($('.js--validate_form'));
  //   sendForm.send();
  // });

  // $('#add_button').click(() => {
  //   const templateForm = '<div class="alert-success p-4">Успешно Вставлен шаблон!</div>';
  //   const handlerAnswer = new HandlerAnswer($('.js--validate_form'));
  //   handlerAnswer.success({ rsp: { status: 'ok', template: templateForm } });
  // });
});
