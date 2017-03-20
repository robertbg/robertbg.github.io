const fs = require('fs-extended');
const fm = require('front-matter');
const handlebars = require('handlebars');
const dateformat = require('handlebars-dateformat');
const moment = require('moment');
const dir = require('node-dir');
const mkpath = require('mkpath');
const marked = require('marked');
const inline = require('inline-source');

// Paths
const paths = {
  contentPath: './src/content/items',
  globalPath: './src/content/global',
  templatePath: './src/templates/common',
  partialPath: './src/templates/partials',
  buildPath: './',
};

// Array to store blog posts
const globalItems = [];

// Markdown options
const markedOpts = { gfm: true };

// Register partials
const registerPartials = () => {
  const files = fs.readdirSync(paths.partialPath); // Read partials

  files.forEach((file) => {
    const content = fs.readFileSync(`${paths.partialPath}/${file}`, 'utf8');
    const filename = file.substring(0, file.lastIndexOf('.'));
    handlebars.registerPartial(filename, content);
  });
};

// Register date format helper
const registerHelpers = () => handlebars.registerHelper('dateFormat', dateformat);

// Inline css and js
const inlineSource = html => inline.sync(html, { compress: true });

// Renders the template using Handlebars
const renderTemplate = (templatePath, viewData) => {
  const content = fs.readFileSync(templatePath, { encoding: 'utf-8' }); // Read path
  const template = handlebars.compile(content); // Compile template
  return inlineSource(template(viewData)); // Return inline templated data
};

// Render and write
const writeToFile = (template, data, path) => {
  const HTML = renderTemplate(template, data); // Render template
  mkpath.sync(path); // Make sure path exists
  fs.writeFileSync(`${path}/index.html`, HTML, { encoding: 'utf8' }); // Write to file
};

// Builds email content and writes to file.
const buildSingleHTML = (content) => {
  const data = fm(content); // Front matter the content
  const formattedDate = moment(data.attributes.date).format('YYYY-MM-DD'); // Format date
  const htmlPath = `${paths.buildPath}blog/${formattedDate}-${data.attributes.fileName}`; // Build path
  const htmlTemplate = `${paths.templatePath}/${data.attributes.template}`; // Template path
  data.bodyFormatted = marked(data.body, markedOpts); // Converts markdown body into html
  globalItems.push(data); // Push into global array for blog index
  writeToFile(htmlTemplate, data, htmlPath); // Render the HTML content and write to file
};

// Build HTML for homepage
const buildHomeHTML = () => {
  const content = fs.readFileSync(`${paths.globalPath}/homepage.md`, { encoding: 'utf8' }); // Read content path
  const data = fm(content); // Front matter the content
  const htmlTemplate = `${paths.templatePath}/${data.attributes.template}`; // Template path
  data.bodyFormatted = marked(data.body, markedOpts); // Converts markdown body into html
  writeToFile(htmlTemplate, data, paths.buildPath); // Render the HTML content and write to file
};

// Build HTML for blog listing page
const buildBlogHTML = () => {
  const content = fs.readFileSync(`${paths.globalPath}/blog.md`, { encoding: 'utf8' }); // Read content path
  const data = fm(content); // Front matter the content
  const htmlTemplate = `${paths.templatePath}/${data.attributes.template}`; // TEmpalte path
  data.bodyFormatted = marked(data.body, markedOpts); // Converts markdown body into html
  data.items = globalItems.sort((a, b) => { // Sort posts in alphabetical order
    const aDate = new Date(a.attributes.date);
    const bDate = new Date(b.attributes.date);
    if (aDate > bDate) return -1;
    else if (aDate < bDate) return 1;
    return 0;
  });
  writeToFile(htmlTemplate, data, `${paths.buildPath}/blog`); // Render the HTML content and write to file
};

// Build index pages
const buildMainPages = () => {
  buildBlogHTML(); // Blog index page
  buildHomeHTML(); // Home page
};

// Run app
(() => {
  registerPartials(); // Register partials
  registerHelpers(); // Register helpers

  // Uses 'node-dir' to recursively search through the contentPath directory.
  dir.readFiles(
    paths.contentPath,
    {
      match: /.md$/, // Only matches files ending in .md
      exclude: /^\./, // Excludes all system files
    },
    (err, content, next) => {
      if (err) throw err;
      buildSingleHTML(content); // Build html for each blog post
      next(); // Moves on to the next content file
    },
    buildMainPages
  );
})();
