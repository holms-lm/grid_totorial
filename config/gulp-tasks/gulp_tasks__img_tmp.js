module.exports = function (gulp, plugins, config) {
    return function () {
      return gulp.src(config.private.images_tmp)
        .pipe(plugins.flatten({ includeParents: 0 }))
        .pipe(gulp.dest(config.public.images_tmp));
    };
};
