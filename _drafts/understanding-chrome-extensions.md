---
layout: post
title: Understanding Chrome Extensions
author: Yu-Yueh Liu
tags:
- JavaScript    
- HTML5
- CSS3
- Chrome Extension
---
Chrome extensions are programs that add functionalities to Chrome and enhance your browsing experience. They are very popular and chances are you're using one right now! In fact, you can find extensions for pretty much anything such as helping you become more productive, protecting your privacy and more. (Making your own Chrome extension is quite simple and it could turn out to be a fun personal project.)?

<h4>Goal</h4>
<p>This article is a documentation of what I learned when making my own Chrome extension. If you're looking for a tutorial for starters, please check out their <a href="https://developer.chrome.com/extensions/getstarted" target="_blank">Getting Started Tutorial</a>.</p>

<p>In this article, you will familiarize yourself with the main components needed to create an extension, learn about message passing and learn how to use external libraries.</p>

<h2>Manifest</h2>
<p>
The <code class="inline-code">manifest.json</code> file is the most important component and it provides Chrome all the information about your extension such as the name of your extension and the permissions needed but we'll get into that a bit later.
</p>

```json
{
  "manifest_version": 2,
  "name": "My Extension",
  "description": "This is an example.",
  "version": "0.1"
}
```


<!-- <h4>Prerequisites</h4>
<ul>
<li></li>
<li></li>
</ul> -->

<h2></h2>

<!-- <img src="{{ "/assets/images/post/productive.png" | relative_url }}" class="img-fluid add-margin-top-normal add-margin-bottom-normal"> -->

...