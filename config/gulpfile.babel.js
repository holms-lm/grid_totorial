import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import setProcessEnv from './env';

// Добавление ENV переменных в конфигурацию
setProcessEnv(`../.env.${process.env.NODE_ENV}`);
// Паттерны имен для подгружаемых плагинов
const plugins = gulpLoadPlugins({ pattern: ['gulp-*', 'imagemin-*'] });
const config = {
  public: {
    images: `../${process.env.FOLDER_PUBLIC_BASE}/img`,
    images_tmp: `../${process.env.FOLDER_PUBLIC_BASE}/img/tmp`,
    copy: `../${process.env.FOLDER_PUBLIC_BASE}/copy`,
    favicon: `../${process.env.FOLDER_PUBLIC_BASE}`,
  },
  private: {
    svg_files: `../${process.env.FOLDER_PRIVATE_BASE}/_helpers/sprite/svg/*.svg`,
    images: [
      `!../${process.env.FOLDER_PRIVATE_BASE}/**/svg/`,
      `!../${process.env.FOLDER_PRIVATE_BASE}/**/img/tmp/`,
      `!../${process.env.FOLDER_PRIVATE_BASE}/**/img/style/`,
      `../${process.env.FOLDER_PRIVATE_BASE}/**/img/*.*`
    ],
    images_tmp: [`../${process.env.FOLDER_PRIVATE_BASE}/**/img/tmp/**/*.*`],
    copy: `../${process.env.FOLDER_PRIVATE_BASE}/**/copy/**/*.*`,
    favicon: [`!../${process.env.FOLDER_PRIVATE_BASE}/**/favicon/**/*.twig`, `../${process.env.FOLDER_PRIVATE_BASE}/**/favicon/**/*.*`],
  },
  key: {
    tiny: process.env.KEY_TINY, // Ключ для оптимизации изображений (https://tinypng.com/developers)
  },
};
// Функция для подключения тасков
function getTask(taskName) {
    return require(`./gulp-tasks/${taskName}`)(gulp, plugins, config);
}

// Подключаем нужные таски
gulp.task('img_current', getTask('gulp_tasks__img_current'));
gulp.task('img_tmp', getTask('gulp_tasks__img_tmp'));
gulp.task('copy', getTask('gulp_tasks__copy'));
gulp.task('favicon', getTask('gulp_tasks__favicon'));
gulp.task('sprite', getTask('gulp_tasks__svg_sprite'));

// Build
gulp.task('img', gulp.series(['img_current', 'img_tmp']));
gulp.task('default', gulp.series(['img', 'copy', 'favicon', 'sprite']));
