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

const globalItems = [];

const markedOpts = {
  gfm: true
}

/*
 * Reads the partialPath directory and registers each file
 * as a partial that can be used by Handlebars.
 */
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

const registerHelpers = () => {
  handlebars.registerHelper('dateFormat', dateformat);
}

// Renders the template using Handlebars
const renderTemplate = (templatePath, viewData) => {
  const content = fs.readFileSync(templatePath, { encoding: 'utf-8' });
  const template = handlebars.compile(content);
  return template(viewData);
};

const inlineSource = (html) => inline.sync(html, { compress: true });

// Builds email content and writes to file.
const buildSingleHTML = (content) => {
  // Converts markdown file into a javascript object// Converts markdown body into html
  const contentData = fm(content);

 // Converts markdown body into html
  contentData.bodyFormatted = marked(contentData.body, markedOpts);
  globalItems.push(contentData);

  // HTML Version Paths
  const htmlPath = paths.buildPath +
  'blog/' + 
  moment(contentData.attributes.date).format('YYYY-MM-DD') + 
  '-' +
  contentData.attributes.fileName;
  const htmlTemplate = `${paths.templatePath}/${contentData.attributes.template}`;

  // Render the HTML content and write to file
  let HTML = renderTemplate(htmlTemplate, contentData);
  HTML = inlineSource(HTML);

  mkpath.sync(htmlPath);
  fs.writeFileSync(`${htmlPath}/index.html`, HTML, { encoding: 'utf8' });
};

// Convert string to className
const convertStringtoClassName = str =>
  str
    .replace(/\s&\s/g, '-')
    .replace(/&/g, '')
    .replace(/'/g, '') // Remove all '
    .replace(/\s+/g, '-') // Replace spaces with -
    .toLowerCase(); // Lowercase the whole thing


// Add classes array to each item
const addClassesArray = (obj) => {
  const updatedObj = obj;
  updatedObj.classes = [];

  updatedObj.attributes.categories.forEach((cat) => {
    updatedObj.classes.push(`category-${convertStringtoClassName(cat)}`);
  });

  return updatedObj;
};

// Build HTML for homepage
const buildHomeHTML = () => {
  const content = fs.readFileSync(`${paths.globalPath}/homepage.md`, { encoding: 'utf8' });
  const globalData = fm(content);

  globalData.bodyFormatted = marked(globalData.body, markedOpts);

  const htmlTemplate = `${paths.templatePath}/${globalData.attributes.template}`;
  let HTML = renderTemplate(htmlTemplate, globalData);
  HTML = inlineSource(HTML);
  fs.writeFileSync(`${paths.buildPath}/index.html`, HTML, { encoding: 'utf8' });
};

// Build HTML for blog listing page
const buildBlogHTML = () => {
  const content = fs.readFileSync(`${paths.globalPath}/blog.md`, { encoding: 'utf8' });
  const globalData = fm(content);
  globalData.bodyFormatted = marked(globalData.body, markedOpts);
  globalData.items = globalItems
    .map(addClassesArray)
    .sort((a, b) => {
      a = new Date(a.attributes.date);
      b = new Date(b.attributes.date);
      return a > b ? -1 : a < b ? 1 : 0;
    });

  const htmlTemplate = `${paths.templatePath}/${globalData.attributes.template}`;
  let HTML = renderTemplate(htmlTemplate, globalData);
  HTML = inlineSource(HTML);
  fs.writeFileSync(`${paths.buildPath}/blog/index.html`, HTML, { encoding: 'utf8' });
};

// Build index pages
const buildMainPages = () => {
  buildBlogHTML();
  buildHomeHTML();
};

// Recursively searches through the contentPath directory for YAML content files and builds.
const runApp = () => {
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
};

runApp();