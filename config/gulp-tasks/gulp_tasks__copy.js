module.exports = function (gulp, plugins, config) {
    return function () {
      return gulp.src(config.private.copy)
            .pipe(plugins.flatten({ includeParents: 0 }))
            .pipe(gulp.dest(config.public.copy));
    };
};
