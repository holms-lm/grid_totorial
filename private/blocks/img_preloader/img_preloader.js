// родитель у .lazy должен быть position: relative
let lazyloadImages;
const imgPreloader = {
    init() {
            lazyloadImages = new LazyLoad({
            elements_selector: ".lazy",
            callback_reveal: function (el) {
                const $picture = $(el).closest('picture');
                $picture.css('position', 'relative');
                $picture.after('<div class="image-preloader"></div>');
            },
            callback_loaded: function (el) {
                $(el).closest('picture').next('.image-preloader').remove();
            },
            callback_error: function (el) {
                $(el).closest('picture').next('.image-preloader').remove();
            }
        });
    },
    update() {
        lazyloadImages.update();
    }
}

export default imgPreloader;
