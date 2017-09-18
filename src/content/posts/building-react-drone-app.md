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
showComments: false
---

So I've just spent a Saturday brushing up on my React knowledge by building a web-based UI to control a Parrot Mini-Drone. It was fun! It uses React on the front-end with an Express server and the two spoke to each other using Web Sockets. It was quick and easy (I had it up and running within a couple of hours), and it certainly helped me get back to grips with React after my latest freelance contract was focused on pure JS.

## The Drone
First up, let's talk about the drone. For this project I used a [Parrot Mambo](https://www.parrot.com/us/minidrones/parrot-mambo-fpv), but any other Parrot MiniDrone should work. 

![Picture of a Parrot Mambo drone](/dist/images/mambo.png "The Parrot Mambo")

The Parrot Mambo is a small and lightweight drone that I bought specifically for this project so I could use it indoors. It's a bit more than your average minidrone, coming equipped with interchangeable grabber or mini-cannon accessories to open up your flight to more fun and hijinks. Although for the purposes of this project, I've focused on simply flying it!

## The Code
I utilised [this fantastic mini-drone library](https://github.com/fetherston/npm-parrot-minidrone) to connect to the drone. This library provided all the protocols for connecting to the drone and to send it all the appropriate commands. I knew I wanted to use React on the front-end (as that was the reason I started this project to begin with), so that just left figuring out what to do on the server. I quickly settled on a simple Express app and using Web Sockets (using  [Socket.io](https://socket.io/)) to communicate between a Node server connecting to the drone and the React front-end. I considered building a seperate API service for this, but decided it was overkill.

I used the official [create-react-app](https://github.com/facebookincubator/create-react-app) boilerplate to get my React front-end up and running. I'd totally recommend this for all smaller React projects. Saves so much time faffing around getting set up and allows you to jump straight in to building the UI.

If you want to deep dive into the code itself, you can find the entire source code, alongisdes instructions for installation ang usage for this project [on Github](https://github.com/robertbg/drone-react).

## Summary
In short, this was a really fun little project to spend a quite Saturday afternoon on. It didn't take too long, but certainly helped brush off a few cobwebs in some frameworks / code I hadn't touched in a few months.
