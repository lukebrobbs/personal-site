---
title: Speeding up your flow with VS-Code Workspaces
date: "2019-08-09T22:12:03.284Z"
---

Getting to grips with your code editor can massively improve your workflow as a developer, as well as making the experience more enjoyable as a whole.

One particular feature in VS-code which i have recently discovered is _Workspaces_. There have been plenty of occasions where I have been working on multiple codebases at once, in different windows, and quickly found myself in a state of confusion as to which window is which. There are VS-Code extensions designed to help alleviate this issue, such as [Peacock](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock), which allows you to color code each window, however, workspaces allows you to consolidate all of these windows into one place, whilst giving you access to a powerful set of functionality to supercharge your productivity.

This post will run through creating a simple, two repository workspace, and creating a single command to start up both of these services.

### Setup

There is no need to install anything addition, workspaces are available out of the box with VS-Code, however, you will of course need the repositories to work in. In this example, we will have a simple backend server in one repository, and a front end in the other, both fired up with the `npm start` command.
