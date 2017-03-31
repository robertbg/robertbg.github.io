---
template: article.hbs
stylesheet: blog.css
title: Async/Await and Node FS
slug: async-await-and-node-fs
date: 2017-03-31
preview: > 
    I've been making websites for over 15 years, 10 of those professionally. In that time I've often thought about starting a blog about my experiences as a developer, but never really got around to it before. Finally, I thought I'd give it a go!
categories: 
  - Javascript
prettyCode: true
showComments: false
---

Sometimes, when in a hurry, or have pressure to deliver on a development task, it’s necessary to take shortcuts. You try and avoid doing it, and you try and make a note to go back in and re-factor in the future, but nevertheless, you end up shipping code which you’re not that proud of.

I did exactly that whilst building this blog. Ok, I wasn’t exactly under much pressure, I could have released this when I wanted - but I was writing this on a busy Saturday and I wanted to get it done quickly rather than spend too much of my weekend on it.

This blog is produced using a very simple static site generator node application. It’s written specifically for this blog and is barely over a 100 lines long. In short, it works by cycling through a folder of markdown files that contain the content for each blog post, binding that content to a handlebars template and writing the resultant static HTML to file.

The function that I initially wrote to write to file looked like this…

```javascript
const writeToFile = (template, data, path) => {
  const HTML = renderTemplate(template, data); // Render template
  mkpath.sync(path); // Make sure path exists
  fs.writeFileSync(`${path}/index.html`, HTML, { encoding: 'utf8' }); // Write to file
};
```
The eagle eyed reader of that function will see exactly where a shortcut was taken. Instead of taking advantage of the asynchronous nature of node’s inbuilt file system plugin, I cheated, and used the sync version. I did this because async can be hard and I didn’t want to get caught up in a callback nightmare - so writing the code synchronously was just quicker to write, even though I knew it would be slower to execute.

Knowing I had taken that shortcut bothered me, however, and I’ve since re-written the application (including that function) to take advantage of the new async/await syntax that became natively available in [Node v7.6.0](https://nodejs.org/en/blog/release/v7.6.0/).

So, how did that go?

## Step 1
The first step in the process was to wrap the required node file system API methods inside a promise so that they would be useable alongside async/ await. This is because the async file system API currently use a callback. A promisified node filesystem API method would then look like this...

```javascript
const readFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});
```
Fortunately, I didn't actually have to write that for every fs method I required. This is because, like with most problems I usually face when working with Javascript, there are usually smart people out there who have already done it before! I chose a library called [nano-fs by Vladimir Antonov](https://github.com/Holixus/nano-fs), as it include in some extended functionality, such as a method to write a file path if it doesn’t already exist.

## Step 2
With the native FS API replaced by `nano-fs`, it meant I could re-write that write to file function as...

```javascript
const fs = require(‘nano-fs’);

const writeToFile = async (template, data, filePath) => {
  const HTML = await renderTemplate(template, data); // Render template
  await fs.mkpath(filePath); // Make sure path exists
  return fs.writeFile(`${filePath}/index.html`, HTML, { encoding: 'utf8' }); // Write to file
};
```
It's this that is so useful about the async/await syntax. I had written an asynchronous version of the same function, in exactly the same amount of lines as I did synchronously. No callbacks in sight! Why didn't I just do that from the beginning?

## Step 3
Those eagle eyed of you that caught me out before might also have noticed that I'm also now returning the final `fs.writeFile()` promise from the function, rather than simply calling it. This means that whilst executing the static site generator, I am now able to combine all the asynchronous write to file calls needed for all the seperate posts into an array and use `Promise.all()` to execute them all simultaneously for a much quicker build process! I won't repeat all the code for that here, but those interested can look at the final static site app [here](https://github.com/robertbg/robertbg.github.io/blob/master/compile.js).

It's not perfect, and it's been built for a particular usecase (this blog) rather than with any intention to release to the already crowded static-site-generator marketplace, but for 115 lines of code and less than an hour of my time, it does the job pretty well. A job that's now done asynchronously!
