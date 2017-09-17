---
template: article.hbs
stylesheet: blog.css
title: Building a Drone UI in React and Socket.io
slug: building-a-react-socket-drone-app
date: 2017-09-17
preview: > 
  So I've just spent the weekend brushing up on my React knowledge by building a web-based UI to control a Parrot Mini-Drone. It was fun! It uses React on the front-end with an Express server and the two connected using Web Sockets.
categories: 
  - Javascript
  - React
  - Socket.io
prettyCode: true
showComments: true
---

So I've just spent a Saturday brushing up on my React knowledge by building a web-based UI to control a Parrot Mini-Drone. It was fun! It uses React on the front-end with an Express server and the two spoke to each other using Web Sockets. It was quick and easy (I had it up and running within a couple of hours), and it certainly helped me get back to grips with React after my latest freelance contract was focused on pure JS.

## The Drone
First up, let's talk about the drone. For this project I used a [Parrot Mambo](https://www.parrot.com/us/minidrones/parrot-mambo-fpv), but any other Parrot MiniDrone should work. 

![Picture of a Parrot Mambo drone](/dist/images/mambo.png "The Parrot Mambo")

The Parrot Mambo is a small and lightweight drone that I bought specifically for this project so I could use it indoors. It's a bit more than your average minidrone, coming equipped with interchangeable grabber or mini-cannon accessories to open up your flight to more fun and hijinks. Although for the purposes of this project, I've focused on simply flying it!

## The Code
I utilised [this fantastic mini-drone library](https://github.com/fetherston/npm-parrot-minidrone) to connect to the drone. This library provided all the protocols for connecting to the drone and to send it all the appropriate commands. I knew I wanted to use React on the front-end (as that was the reason I started this project to begin with), so that just left figuring out what to do on the server. I quickly settled on a simple Express app and using Web Sockets (using  [Socket.io](https://socket.io/)) to communicate between a Node server connecting to the drone and the React front-end. O considered building a seperate API service for this, but decided it was overkill. 

You can find the entire source code for the project [on Github](https://github.com/robertbg/drone-react), but here's a few snippets that should hopefully give a good idea of the setup.

```javascript
const js  = 'code here';
```
