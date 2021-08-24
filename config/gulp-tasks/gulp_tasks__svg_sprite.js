module.exports = function (gulp, plugins, config) {
    return function () {
      return gulp.src(config.private.svg_files)
            .pipe(plugins.svgSprite({
                mode: {
                    symbol: {
                        sprite: '../symbol_sprite.svg',
                    },
                },
            }))
            .pipe(gulp.dest(config.public.images));
    };
};
