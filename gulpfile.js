const gulp = require("gulp");
const tap = require("gulp-tap");
const handlebars = require("handlebars");
const yaml = require("yaml");
const fs = require("fs");
const path = require("path");

const readYAML = (segment) => {
   const filePath = path.join(__dirname, segment);
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
      const localePath = path.join(localesDir, localeFile);

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
                     file.path = file.path.replace(/\.hbs$/, ".html").replace("dist/html", `dist/html/${localeCode}`);
                  } catch (error) {
                     reject(error);
                  }
               }),
            )
            .pipe(gulp.dest(`dist/html/${localeCode}`)) // Output files to the locale-specific subdirectory
            .on("end", resolve)
            .on("error", reject);
      });
   });

   // Return a promise that resolves when all locale tasks are complete
   return Promise.all(tasks);
});

gulp.task("js", () => {
   return gulp.src("src/js/*.js").pipe(gulp.dest("dist/js"));
});

gulp.task("build", gulp.parallel("handlebars", "js"));
