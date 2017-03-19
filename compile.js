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

// Markdown setup
const markedOpts = {
  gfm: true
}

// Register partials
const registerPartials = () => {
  const files = fs.readdirSync(paths.partialPath);
  let content;
  let filename;

  files.forEach((file) => {
    content = fs.readFileSync(`${paths.partialPath}/${file}`, 'utf8');
    filename = file.substring(0, file.lastIndexOf('.'));
    handlebars.registerPartial(filename, content);
  });
};

// Register helpers
const registerHelpers = () => {
  handlebars.registerHelper('dateFormat', dateformat);
};

// Inline css and js
const inlineSource = (html) => inline.sync(html, { compress: true });

// Renders the template using Handlebars
const renderTemplate = (templatePath, viewData) => {
  const content = fs.readFileSync(templatePath, { encoding: 'utf-8' });
  const template = handlebars.compile(content);
  return inlineSource(template(viewData));
};

// Render and write
const writeToFile = (template, data, path) => {
  let HTML = renderTemplate(template, data);
  mkpath.sync(path);
  fs.writeFileSync(`${path}/index.html`, HTML, { encoding: 'utf8' });
};

// Builds email content and writes to file.
const buildSingleHTML = (content) => {
  // Converts markdown file into a javascript object// Converts markdown body into html
  const contentData = fm(content);
  const formattedDate = moment(contentData.attributes.date).format('YYYY-MM-DD');

  // HTML Version Paths
  const htmlPath = `${paths.buildPath}blog/${formattedDate}-${contentData.attributes.fileName}`;
  const htmlTemplate = `${paths.templatePath}/${contentData.attributes.template}`;

 // Converts markdown body into html
  contentData.bodyFormatted = marked(contentData.body, markedOpts);

  // Push into global array for rendering
  globalItems.push(contentData);

  // Render the HTML content and write to file
  writeToFile(htmlTemplate, contentData, htmlPath);
};

// Build HTML for homepage
const buildHomeHTML = () => {
  const content = fs.readFileSync(`${paths.globalPath}/homepage.md`, { encoding: 'utf8' });
  const globalData = fm(content);
  const htmlTemplate = `${paths.templatePath}/${globalData.attributes.template}`;

  globalData.bodyFormatted = marked(globalData.body, markedOpts);

  // Render the HTML content and write to file
  writeToFile(htmlTemplate, globalData, paths.buildPath);
};

// Build HTML for blog listing page
const buildBlogHTML = () => {
  const content = fs.readFileSync(`${paths.globalPath}/blog.md`, { encoding: 'utf8' });
  const globalData = fm(content);
  const htmlTemplate = `${paths.templatePath}/${globalData.attributes.template}`;

  globalData.bodyFormatted = marked(globalData.body, markedOpts);
  globalData.items = globalItems.sort((a, b) => {
    a = new Date(a.attributes.date);
    b = new Date(b.attributes.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });
  
  // Render the HTML content and write to file
  writeToFile(htmlTemplate, globalData, `${paths.buildPath}/blog`);
};

// Build index pages
const buildMainPages = () => {
  buildBlogHTML();
  buildHomeHTML();
};

// Run app
(() => {
  registerPartials(); // Register Partials
  registerHelpers(); // Register Helpers

  // Uses 'node-dir' to recursively search through the contentPath directory.
  dir.readFiles(
    paths.contentPath,
    {
      match: /.md$/, // Only matches files ending in .md
      exclude: /^\./, // Excludes all system files
    },
    (err, content, next) => {
      if (err) throw err;
      buildSingleHTML(content);

      // Moves on to the next content file
      next();
    },
    buildMainPages
  );
})();