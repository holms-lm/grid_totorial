module.exports = function (gulp, plugins, config) {
    return function () {
        // Задача для постоянных изображений
        const filterForTiny = plugins.filter(['**/*.{png,jpg,jpeg}'],
            { restore: true });
        const filterForImageMin = plugins.filter(['**/*.{svg,gif}'],
            { restore: true });

      return gulp.src(config.private.images)
            .pipe(filterForImageMin)
            .pipe(plugins.imagemin({
                progressive: true,
                use: [plugins.imageminPngquant()],
            }))
            .pipe(filterForImageMin.restore)
            .pipe(filterForTiny)
            .pipe(plugins.tinypngCompress({
                key: config.key.tiny,
                summarise: true,
                log: true,
            }))
            .pipe(filterForTiny.restore)
            .pipe(plugins.flatten({ includeParents: 0 }))
            .pipe(gulp.dest(`${config.public.images}`));
    };
};
