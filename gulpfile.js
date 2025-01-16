const gulp = require("gulp");
const tap = require("gulp-tap");
const handlebars = require("handlebars");
const yaml = require("yaml");
const fs = require("fs");
const path = require("path");

const readYAML = (filePath) => {
   const file = fs.readFileSync(filePath, "utf-8");
   return yaml.parse(file);
};

gulp.task("handlebars", () => {
   const localesDir = path.join("src", "locale");

   // Get all locale files
   const localeFiles = fs.readdirSync(localesDir).filter((file) => file.endsWith(".yml"));

   // Create a list of promises for each locale processing task
   const tasks = localeFiles.map((localeFile) => {
      const localeCode = path.basename(localeFile, ".yml"); // Extract "en" from "en.yml"
      const localePath = path.join(__dirname, localesDir, localeFile);

      // Return the Gulp stream as a promise
      return new Promise((resolve, reject) => {
         gulp
            .src("src/views/*.hbs")
            .pipe(
               tap((file) => {
                  try {
                     const locale = readYAML(localePath); // Read the current locale file
                     const data = { locale };
                     const source = file.contents.toString();
                     const template = handlebars.compile(source);
                     const html = template(data);
                     file.contents = Buffer.from(html);

                     // Update file path to include the locale subdirectory
                     file.path = file.path.replace(/\.hbs$/, ".html").replace("out/html", `out/html/${localeCode}`);
                  } catch (error) {
                     reject(error);
                  }
               }),
            )
            .pipe(gulp.dest(`out/html/${localeCode}`)) // Output files to the locale-specific subdirectory
            .on("end", resolve)
            .on("error", reject);
      });
   });

   // Return a promise that resolves when all locale tasks are complete
   return Promise.all(tasks);
});

gulp.task("js", () => {
   return gulp.src("src/js/*.js").pipe(gulp.dest("out/js"));
});

gulp.task("locale", () => {
   return gulp
      .src("src/locale/*.yml")
      .pipe(
         tap((file) => {
            const locale = readYAML(file.path);
            file.contents = Buffer.from(JSON.stringify(locale));
            file.path = file.path.replace(/\.yml$/, ".json");
         }),
      )
      .pipe(gulp.dest("out/locale"));
});

gulp.task("preload", () => {
   return gulp.src("src/preload.js").pipe(gulp.dest("out"));
});

gulp.task("build", gulp.parallel("handlebars", "js", "locale", "preload"));
