const dateformat = require('handlebars-dateformat');
const dir = require('node-dir');
const fs = require('nano-fs');
const fm = require('front-matter');
const handlebars = require('handlebars');
const inline = require('inline-source');
const marked = require('marked');
const moment = require('moment');
const path = require('path');

// Set up options
const options = {
  paths: {
    posts: './src/content/posts',
    pages: './src/content/pages',
    templates: './src/templates/common',
    partials: './src/templates/partials',
    build: '.',
  },
  markdown: {
    gfm: true
  }
};

// Array to store blog posts as they are created so they can be iterated later
const globalItems = [];

// Register partials
const registerPartials = async () => {
  const files = await fs.readdir(options.paths.partials); // Read partials

  files.forEach(async (file) => {
    const content = await fs.readFile(`${options.paths.partials}/${file}`, 'utf8');
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

// Register handlebars helpers and partials
const setupHandlebars = async () => {
  console.log('\u2699 Setting up templating engine');
  registerHelpers();
  await registerPartials();
};

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

// Builds post content and writes to file.
const buildPost = async (filePath) => {
  console.log('\u26A1 Building post from', filePath);
  const content = await fs.readFile(filePath, { encoding: 'utf8' }); // Read content path
  const data = fm(content); // Front matter the content
  const formattedDate = moment(data.attributes.date).format('YYYY-MM-DD'); // Format date
  const htmlPath = `${options.paths.build}/blog/${formattedDate}-${data.attributes.slug}`; // Build path
  const htmlTemplate = `${options.paths.templates}/${data.attributes.template}`; // Template path
  data.bodyFormatted = marked(data.body, options.markdown); // Converts markdown body into html
  globalItems.push(data); // Push into global array for blog index

  // Render the HTML content and write to file
  return writeToFile(htmlTemplate, data, htmlPath);
};

// Builds page content and writes to file.
const buildPage = async (filePath) => {
  console.log('\u26A1 Building page from', filePath);
  const content = await fs.readFile(filePath, { encoding: 'utf8' }); // Read content path
  const data = fm(content); // Front matter the content
  const htmlTemplate = `${options.paths.templates}/${data.attributes.template}`; // Template path
  data.bodyFormatted = marked(data.body, options.markdown); // Converts markdown body into html
  data.items = globalItems.sort((a, b) => { // Sort posts in alphabetical order
    const aDate = new Date(a.attributes.date);
    const bDate = new Date(b.attributes.date);
    if (aDate > bDate) return -1;
    else if (aDate < bDate) return 1;
    return 0;
  });

  // Render the HTML content and write to file
  return writeToFile(htmlTemplate, data, `${options.paths.build}${data.attributes.slug}`);
};

// Filter out any files that don't have .md extension
const filterOnlyMarkdownFiles = (file) => {
  const extname = path.extname(file);
  return (extname === '.md');
};

// Run app
setupHandlebars() // Register partials
.then(() => dir.promiseFiles(options.paths.posts)) // Build posts first
.then(files => files.filter(filterOnlyMarkdownFiles).map(buildPost)) // Map files to buildPost
.then(posts => Promise.all(posts)) // Execute
.then(() => dir.promiseFiles(options.paths.pages)) // Then build pages
.then(files => files.filter(filterOnlyMarkdownFiles).map(buildPage)) // Map files to buildPage
.then(pages => Promise.all(pages)) // Execute
.then(() => console.log('\u263a All done!'))
.catch(e => console.error('\u2620', e));
