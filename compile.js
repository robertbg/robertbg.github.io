const dateformat = require('handlebars-dateformat');
const dir = require('node-dir');
const fs = require('nano-fs');
const fm = require('front-matter');
const handlebars = require('handlebars');
const inline = require('inline-source');
const marked = require('marked');
const moment = require('moment');
const path = require('path');

// Paths
const paths = {
  postsPath: './src/content/posts',
  pagesPath: './src/content/pages',
  templatePath: './src/templates/common',
  partialPath: './src/templates/partials',
  buildPath: '.',
};

// Array to store blog posts
const globalItems = [];

// Markdown options
const markedOpts = { gfm: true };

// Register partials
const registerPartials = async () => {
  const files = await fs.readdir(paths.partialPath); // Read partials

  files.forEach(async (file) => {
    const content = await fs.readFile(`${paths.partialPath}/${file}`, 'utf8');
    const filename = file.substring(0, file.lastIndexOf('.'));
    handlebars.registerPartial(filename, content);
  });
};

// Register date format helper
const registerHelpers = () => handlebars.registerHelper('dateFormat', dateformat);

// Inline css and js
const inlineSource = html => new Promise((resolve, reject) => {
  inline(html, { compress: true }, (err, output) => {
    if (err) reject(err);
    else resolve(output);
  });
});

// Renders the template using Handlebars
const renderTemplate = async (templatePath, viewData) => {
  const content = await fs.readFile(templatePath, { encoding: 'utf-8' }); // Read path
  const template = handlebars.compile(content); // Compile template
  return inlineSource(template(viewData)); // Return inline templated data
};

// Render and write
const writeToFile = async (template, data, filePath) => {
  console.log('\u270e Saving', filePath);
  const HTML = await renderTemplate(template, data); // Render template
  await fs.mkpath(filePath); // Make sure path exists
  return fs.writeFile(`${filePath}/index.html`, HTML, { encoding: 'utf8' }); // Write to file
};

// Builds email content and writes to file.
const buildPost = async (filePath) => {
  console.log('\u26A1 Building blog entry from', filePath);
  const content = await fs.readFile(filePath, { encoding: 'utf8' }); // Read content path
  const data = fm(content); // Front matter the content
  const formattedDate = moment(data.attributes.date).format('YYYY-MM-DD'); // Format date
  const htmlPath = `${paths.buildPath}/blog/${formattedDate}-${data.attributes.slug}`; // Build path
  const htmlTemplate = `${paths.templatePath}/${data.attributes.template}`; // Template path
  data.bodyFormatted = marked(data.body, markedOpts); // Converts markdown body into html
  globalItems.push(data); // Push into global array for blog index

  // Render the HTML content and write to file
  return writeToFile(htmlTemplate, data, htmlPath);
};

// Builds email content and writes to file.
const buildPage = async (filePath) => {
  console.log('\u26A1 Building page from', filePath);
  const content = await fs.readFile(filePath, { encoding: 'utf8' }); // Read content path
  const data = fm(content); // Front matter the content
  const htmlTemplate = `${paths.templatePath}/${data.attributes.template}`; // Template path
  data.bodyFormatted = marked(data.body, markedOpts); // Converts markdown body into html
  data.items = globalItems.sort((a, b) => { // Sort posts in alphabetical order
    const aDate = new Date(a.attributes.date);
    const bDate = new Date(b.attributes.date);
    if (aDate > bDate) return -1;
    else if (aDate < bDate) return 1;
    return 0;
  });

  // Render the HTML content and write to file
  return writeToFile(htmlTemplate, data, `${paths.buildPath}${data.attributes.slug}`);
};

// Filter out any files that don't have .md extension
const filterMarkdownFiles = (file) => {
  const extname = path.extname(file);
  return (extname === '.md');
};

// Run app
(() => {
  registerPartials(); // Register partials
  registerHelpers(); // Register helpers

  dir.promiseFiles(paths.postsPath)
  .then(files => files
    .filter(filterMarkdownFiles)
    .map(buildPost) // Map to return array of promises that resolve to the built HTML
  )
  .then(posts => Promise.all(posts))
  .then(() => dir.promiseFiles(paths.pagesPath))
  .then(files => files
    .filter(filterMarkdownFiles)
    .map(buildPage) // Map to return array of promises that resolve to the built HTML
  )
  .then(pages => Promise.all(pages))
  .then(() => console.log('\u263a All done!'))
  .catch(e => console.error('\u2620', e));
})();
