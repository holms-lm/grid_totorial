import 'jquery-mask-plugin';
import 'jquery-validation/dist/jquery.validate';
import toast from '../../components/toast';

const forms = {
  validate: {
    $defaultForms: $('.js--validate_form'),
    wrapperElement: 'forms_element',
    messageElement: 'forms_element__message',
    instancesValidator: [],
    addValidateMethods() {
      jQuery.validator.addMethod(
        'whiteSpaceOnly',
        function (value, element) {
          return this.optional(element) || !/^\s+$/.test(value);
        },
        'Only whitespace',
      );
      jQuery.validator.addMethod(
        'onlyUkraine',
        function (value, element) {
          return this.optional(element) || /^[\s0-9а-щА-ЩЬьЮюЯяЇїІіЄєҐґ`',.\-\\/]+$/g.test(value);
        },
        'only ukraine characters',
      );
      jQuery.validator.addMethod(
        'onlyRussian',
        function (value, element) {
          return this.optional(element) || /^[\s0-9а-яА-ЯёЁ`,.\-\\/]+$/g.test(value);
        },
        'only russian characters',
      );
      jQuery.validator.addMethod(
        'onlyEnglish',
        function (value, element) {
          return this.optional(element) || /^[\s0-9a-zA-Z`',.\-\\/]+$/g.test(value);
        },
        'only russian characters',
      );
    },
    installPlaginForJquery(formsThis = this) {
      (function ($) {
        jQuery.fn.validateForm = function (customOptions) {
          const options = $.extend(
            {
              $forms: $(this),
              onlyCustomHandler: false,
            },
            customOptions,
          );
          return this.each(formsThis.init.bind(formsThis, options));
        };
        jQuery.fn.destroyValidateForm = function () {
          function destroyValidate() {
            formsThis.instancesValidator.forEach((instances) => {
              if (instances.$form.is($(this))) {
                instances.validator.destroy();
                instances.$form
                  .find(`.${formsThis.wrapperElement}--ok`)
                  .removeClass(`${formsThis.wrapperElement}--ok`);
                instances.$form.find(`.${formsThis.wrapperElement}--error`).removeClass(`${formsThis.wrapperElement}--error`);
              }
            });
          }
          return this.each(destroyValidate);
        };
        jQuery.fn.resetForm = function () {
          function resetForm() {
            formsThis.instancesValidator.forEach((instances) => {
              if (instances.$form.is($(this))) {
                // instances.validator.destroy();
                instances.$form.find(`.${formsThis.wrapperElement}--ok`).removeClass(`${formsThis.wrapperElement}--ok`);
                instances.$form.find(`.${formsThis.wrapperElement}--error`).removeClass(`${formsThis.wrapperElement}--error`);
                instances.$form.find(`.${formsThis.messageElement}`).empty();
                instances.$form.reset();
              }
            });
          }
          return this.each(resetForm);
        };
      }(jQuery));
    },
    init(options = { $forms: this.$defaultForms }) {
      const { $forms, onlyCustomHandler } = options;
      let { unlockFieldset } = options;
      forms.onlyCustomHandler = onlyCustomHandler;
      const { wrapperElement, messageElement } = this;
      let typesRules = [];
      this.addValidateMethods();

      function getTypesRules($element) {
        const properties = $element.data();
        const validProperties = [];
        const firstCharToLowerCase = (str) => str.charAt(0).toLowerCase() + str.slice(1);
        Object.keys(properties).forEach((key) => {
          if (key.indexOf('valid') === 0) {
            validProperties.push(firstCharToLowerCase(key.replace('valid', '')));
          }
        });
        return validProperties;
      }

      function getFieldRules($element) {
        const rules = {};

        function setRule(type) {
          let ruleValue = $element.data(`valid-${type}`);
          if (ruleValue) {
            if (type === 'equalTo') {
              // Добавление селектора елемента которому должен соответствовать поле
              ruleValue = $element.closest('form').find(`input[name="${ruleValue}"]`);
            }
            rules[type] = ruleValue;
          }
        }

        typesRules.forEach((item) => setRule(item));
        return rules;
      }

      function getFieldMessageForRules($element) {
        let messagesText;
        const messages = {};

        function setMessage(type) {
          messagesText = $element.data(`error-${type}`);
          if (messagesText) {
            messages[type] = messagesText;
          }
        }

        typesRules.forEach((item) => setMessage(item));
        return messages;
      }

      function getFormRulesObject($form) {
        const $fields = $form.find('input');
        const fieldsMessages = {};
        const fieldsRules = {};
        const customOptions = {};
        $fields.each((i, field) => {
          const $field = $(field);
          const name = $field.attr('name');
          typesRules = getTypesRules($field);
          const messages = getFieldMessageForRules($field);
          if (Object.keys(messages).length !== 0) {
            fieldsMessages[name] = messages;
          }
          const rules = getFieldRules($field);
          if (Object.keys(rules).length !== 0) {
            fieldsRules[name] = rules;
          }
        });
        customOptions.messages = fieldsMessages;
        customOptions.rules = fieldsRules;
        return customOptions;
      }

      this.instancesValidator = [];
      $forms.each((i, form) => {
        const $form = $(form);
        const mainOptions = {
          errorElement: 'span',
          errorPlacement(error, element) {
            error.appendTo(element.closest(`.${wrapperElement}`).find(`.${messageElement}`));
          },
          highlight(element) {
            const $wrapperElement = $(element.closest(`.${wrapperElement}`));
            $wrapperElement.addClass(`${wrapperElement}--error`);
            $wrapperElement.removeClass(`${wrapperElement}--ok`);
          },
          unhighlight(element) {
            const $wrapperElement = $(element.closest(`.${wrapperElement}`));
            $wrapperElement.removeClass(`${wrapperElement}--error`);
            $wrapperElement.addClass(`${wrapperElement}--ok`);
          },
          submitHandler() {
            $(`.${wrapperElement}--ok`).removeClass(`${wrapperElement}--ok`);
            $(`.${wrapperElement}--error`).removeClass(`${wrapperElement}--error`);
            $form
              .find('input')
              .not('input[name="password"]')
              .val((i, val) => val.trim());
            $form.find('textarea').val((i, val) => val.trim());

            const recaptchaKey = $('body').data('recaptcha_key');

            if (recaptchaKey) {
              // eslint-disable-next-line no-undef
              grecaptcha.ready(() => {
                // eslint-disable-next-line no-undef
                grecaptcha.execute(recaptchaKey, { action: 'submit' }).then((token) => {
                  forms.formHandler.setCurrentForm(this).send(token);
                });
              });
            } else {
              forms.formHandler.setCurrentForm(this).send();
            }
          },
        };
        const validateOptions = Object.assign(mainOptions, getFormRulesObject($form));
        const validator = $form.validate(validateOptions);
        this.instancesValidator.push({ $form, validator });
        if (!unlockFieldset) {
          const lockClass = $form.data('lockClass');
          if (lockClass) {
            unlockFieldset = `.${lockClass}`;
          }
        }
        if (unlockFieldset) {
          const $fieldset = $form.find(unlockFieldset);
          if ($fieldset.length) $fieldset.prop('disabled', false);
        }
      });
    },
  },
  formHandler: {
    $form: undefined,
    typeMessage: {
      error: 'alert-danger',
      ok: 'alert-success',
    },
    setCurrentForm(validatedForm) {
      this.$form = $(validatedForm.currentForm);
      return this;
    },
    send(gRecaptchaResponse) {
      const cThis = this;
      const { $form } = this;
      const disabledElements = $form.find(':input:disabled').removeAttr('disabled');
      let $button = $form.find('button[type="submit"]');
      if ($button.length === 0 && $form.data('buttonId')) {
        $button = $(`#${$form.data('buttonId')}`);
      }
      const $buttonPreloader = $button.find('.js--preloader');
      let dataForm = $form.serializeArray();
      dataForm = this.replacePhone(dataForm, '+38'); // TODO Вынести в параметры
      if ($form.attr('action') === '') {
        console.log('Send form to empty url:', $form.attr('action'));
      } else if ($form.data('sendType') === 'ajax') {
        $.ajax({
          url: $form.attr('action'),
          type: $form.attr('method'),
          data: gRecaptchaResponse
            ? `${$.param(dataForm)}&gRecaptchaResponse=${gRecaptchaResponse}`
            : dataForm,
          beforeSend() {
            if (!forms.onlyCustomHandler) {
              toast.hideMessage();
              disabledElements.attr('disabled', 'disabled');
              $button.prop('disabled', true);
              $buttonPreloader.addClass('d-block');
              $(`#${$form.data('id_message_success')}`).addClass('d-none');
            }
            $form.trigger('validateForm.beforeSend');
          },
          success(rsp) {
            if (!forms.onlyCustomHandler) {
              if (rsp.status === 'ok') {
                if (rsp.url) {
                  document.location.assign(rsp.url);
                  forms.formHandler.isRedirect = true;
                } else {
                  forms.formHandler.isRedirect = false;
                  cThis.showServerMessage(false); // очистка
                  if ($form.data('buttonId')) {
                    $(`#${$form.data('buttonId')}`).hide();
                  }
                  if (rsp.template) {
                    if ($form.data('id_datepicker')) {
                      $(`#${$form.data('id_datepicker')}`)
                        .data('datepicker')
                        .destroy();
                    }
                    cThis.pastTemplate(rsp.template, $form.data('id_target'));
                  }
                  if ($form.data('id_message_success')) {
                    $(`#${$form.data('id_message_success')}`).removeClass('d-none');
                  }
                }
              } else if (rsp.status === 'error') {
                let placeMessage;
                if (typeof rsp.errors !== 'undefined') {
                  placeMessage = 'byNameField';
                } else {
                  placeMessage = 'serverMessage';
                }
                cThis.showMessage(rsp, placeMessage);
              }
            }
            $form.trigger('validateForm.success', [rsp, $form, cThis]);
          },
          complete() {
            if (!forms.onlyCustomHandler) {
              if (!forms.formHandler.isRedirect) {
                $button.prop('disabled', false);
                $buttonPreloader.removeClass('d-block');
                if ($form.data('buttonId')) {
                  $(`#${$form.data('buttonId')}`)
                    .find('.js--preloader')
                    .removeClass('d-block');
                }
              }
            }
            $form.trigger('validateForm.complete');
          },
          error(rsp) {
            if (!forms.onlyCustomHandler) {
              if (rsp.status === 401) {
                document.location.assign('/');
              }
              if (rsp.status === 500) {
                toast.showMessage(rsp.responseJSON.error);
              }
            }
            $form.trigger('validateForm.error');
          },
        });
      } else {
        $form[0].submit();
      }
    },
    replacePhone(data, beforeClear = '') {
      const regExp = /[+. ()-]*/g;
      const phoneNames = ['phone', '_phone'];
      const newData = data.map((item) => {
        const field = item;
        if (phoneNames.includes(field.name)) {
          field.value = field.value.replace(beforeClear, '').replace(regExp, '');
        }
        return field;
      });
      return newData;
    },
    pastTemplate(template, idTarget) {
      const promise = $(`#${idTarget}`)
        .html(template)
        .promise();

      promise.done(() => {
        const $targetBlock = $(`#${idTarget}`);
        $targetBlock.find('.js--validate_form').validateForm();
        $targetBlock.addClass('loaded');
        $targetBlock.trigger('validateForm.targetPaste.done', [this.$form, this]); // TODO придумать к чему привязывать событие. Старая форма уничтожается, новая еще не существует
        this.$form.trigger('validateForm.donePastTemplate', [this.$form, this]);
      });
    },
    showMessage(rsp, placeMessage = 'serverMessage') {
      const { $form, typeMessage } = this;
      $(`.${forms.validate.messageElement}`).empty();
      this.showServerMessage(false); // очистка
      let message = `<span class="error error--server">${rsp.error}</span>`;
      switch (placeMessage) {
        case 'byNameField':
          Object.keys(rsp.errors).forEach((nameFiled) => {
            message = `<span class="error error--server">${rsp.errors[nameFiled]}</span>`;
            $form
              .find(`input[name="${nameFiled}"]`)
              .closest(`.${forms.validate.wrapperElement}`)
              .find(`.${forms.validate.messageElement}`)
              .append(message);
          });
          break;
        case 'serverMessage':
          this.showServerMessage(
            rsp.error,
            typeMessage[rsp.status],
            $form.data('place_server_message'),
          );
          break;
        default:
      }
    },
    showServerMessage(message, type = 'alert-success', placeServerMessage = '.js--server_message') {
      const $wrapper = $(placeServerMessage);
      $wrapper.empty();
      if (message) {
        $wrapper.append(message);
        $wrapper.removeClass('alert-danger');
        $wrapper.removeClass('alert-success');
        $wrapper.addClass(type);
        $wrapper.show();
      } else {
        $wrapper.hide();
      }
    },
  },
};
forms.validate.installPlaginForJquery();
