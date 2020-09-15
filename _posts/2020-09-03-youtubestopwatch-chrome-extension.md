---
layout: post
title: YouTubeStopwatch Chrome Extension
author: Yu-Yueh Liu
tags:
- JavaScript
- HTML5
- CSS3
- Chrome Extension
date: 2020-09-03 03:27 -0400
---
Chrome extensions are programs that add functionalities to Chrome and enhance your browsing experience. In fact, you can find a myriad of extensions for the purpose of improving your productivity, protecting your privacy, and more. Making your own Chrome extension is quite simple and it could turn out to be a fun personal project.

<h4>Goal</h4>
<p>This article is a documentation of what I learned when making my own Chrome extension. If you're looking for a tutorial for starters, check out the official <a href="https://developer.chrome.com/extensions/getstarted" target="_blank" class="bold">Getting Started Tutorial</a>.</p>

<h4>What is YouTubeStopwatch?</h4>
<p><a href="https://chrome.google.com/webstore/detail/youtubestopwatch/ibaejmohdpnppkglomilmholhndaobag" target="_blank" class="bold">YouTubeStopwatch</a> was created for a course on Human-Computer Interaction (HCI). The objective was to help users manage the amount of time they would like to spend on YouTube, and somehow incite them to quit YouTube without resorting to blocking the site.</p>

<p>The idea was to prompt the user for the desired time they want to spend on YouTube and start a countdown. Once the time is up, the user is asked whether they want to stay on YouTube or leave. If they choose to keep watching videos, they will be subject to some gradual graphical deterioration and slowly worsening their viewing experience.</p>

<p>So how did I get started? Well, the first thing I had to learn was how Chrome Extensions are structured.</p>

<!-- TODO: add ToC -->
<h2>Project Structure</h2>
<pre class="highlight"><code class="nohljsln markdown">src
├── manifest.json
├── popup.html
├── js
│   ├── background.js
│   ├── content.js
│   ├── jquery-3.4.1.min.js.js
│   ├── constants.js
│   └──  ...
├── img
│   └──  extension-icon.png
└── css
    └──  popup.css
</code></pre>

<h2>Manifest</h2>
<p>
The <code class="inline-code">manifest.json</code> file is the first thing you need when creating an extension. It provides all the information about your extension to Google Chrome such as the name of your extension, the permissions needed, etc but we'll get into that a bit later. Here is a minimal example:
</p>

{% highlight json %}
{
    "manifest_version": 2,
    "version": "0.1",
    "name": "My Extension",
    "description": "This is my extension"
}
{% endhighlight %}

<h2>Background Scripts</h2>
<p>
Background scripts are scripts that run in the background of your browser when you open Google Chrome. You can make the scripts persistent or not depending on your use case. I chose to use a persistent script. As long as Google Chrome is open, the script will be running. To define background scripts, I added a <strong>background</strong> section to the <b>manifest</b> file. 
</p>

<!-- TODO: Add Line highlighter -->
<!-- waiting for https://github.com/rouge-ruby/rouge/pull/1426/commits/8275950801dd2637e2239cc16f69058760a6f157 -->
<!-- {% highlight json %}
{
  "manifest_version": 2,
  "version": "0.1",
  "name": "My Extension",
  "description": "This is my extension",
  "background": {               // background section
      "scripts": [              // 
          "js/background.js"    // 
      ],                        // 
      "persistent": true        // 
  }                             //
}
{% endhighlight %} -->

<pre class="highlight"><code>{
    "manifest_version": 2,
    "version": "0.1",
    "name": "My Extension",
    "description": "This is my extension",
<span class="hl-line">    "background": {</span>
<span class="hl-line">        "scripts": [</span>
<span class="hl-line">            "js/background.js"</span>
<span class="hl-line">        ],</span>
<span class="hl-line">        "persistent": true</span>
<span class="hl-line">    }</span>
}</code></pre>

<p><i><b>Note</b> that it is now recommended to use non-persistent background scripts with <a href="https://developer.chrome.com/extensions/background_migration">Event Driven Background Scripts</a>.</i></p>

<p>Below is an example of what my background script looked like.</p>

```javascript
// List to track all active YouTube tabs
var active_youtube_tabs = [];

// Create Main Event Listener
function initBackground() {
    chrome.runtime.onMessage.addListener(function (msg, sender) {
        var tabId = sender.tab ? sender.tab.id : null;
        // If sender is youtube, add listener
        if (msg.from === 'youtube' && typeof (msg.event) === 'undefined') {
            active_youtube_tabs.indexOf(tabId) < 0 ? addListeners(tabId) : null;
        }
        // Handles event message
        switch (msg.event) {
            case "START_COUNTDOWN":
                startCountdown();
                break;
            ...
            default:
                break;
        }
    });
}
initBackground();

// Subscribes tab to active youtube tabs and adds listener to url changes
function addListeners(tabId) {
    active_youtube_tabs.push(tabId);
    // When a youtube tab is closed, remove tabId from active_youtube_tabs list
    chrome.tabs.onRemoved.addListener(function (id) {
        if (tabId === id) {
            removeYoutubeTab(tabId);
        }
    });
    // When the tab url changes, remove tabId from active_youtube_tabs if user is no longer on Youtube
    chrome.tabs.onUpdated.addListener(function (id, changeInfo) {
        if (tabId === id && changeInfo.status === 'complete') {
            chrome.tabs.get(tabId, function (tab) {
                if (tab.url.indexOf('youtube.com') < 0) {
                    removeYoutubeTab(tabId);
                }
            });
        }
    });
}

// Removes specific tab from active_youtube_tabs list
function removeYoutubeTab(tabId) {
    var idx = active_youtube_tabs.indexOf(tabId);
    active_youtube_tabs.splice(idx, 1);
}
```
<p>
When the script starts, a callback function is added with <code class="inline-code">onMessage.addListener()</code> to handle events. Depending on the event received, a different action will be triggered. For example, the <span class="accent">START_COUNTDOWN</span> event will start the countdown in the background script. The tabId is stored in a list to keep track of active youtube tabs if the sender is youtube. This is done using the Chrome Tabs API and we need to give permissions to our application in the manifest file.
</p>

<p>
I needed to use JQuery in the background script so I downloaded the <i>jquery-3.4.1.min.js</i> file, saved it in the <b>js</b> directory and specified the file as a background script. Here are the new changes to the manifest file:
</p>

<pre class="highlight"><code>{
    "manifest_version": 2,
    "version": "0.1",
    "name": "My Extension",
    "description": "This is my extension",
<span class="hl-line">    "permissions": [</span>
<span class="hl-line">        "tabs"</span>
<span class="hl-line">    ],</span>
    "background": {
        "scripts": [
            "js/background.js"
<span class="hl-line">            "js/jquery-3.4.1.min.js"</span>
        ],
        "persistent": true
    }
}</code></pre>


<h2>Content Scripts</h2>
<p>
Content Scripts are run on specific web pages and can interact with a website's DOM. To define a content script, I added a <b>content_scripts</b> section to the <b>manifest</b> file.
</p>
<pre class="highlight"><code>{
    "manifest_version": 2,
    "version": "0.1",
    "name": "My Extension",
    "description": "This is my extension",
    "permissions": [
        "tabs"
    ],
    "background": {
        "scripts": [
            "js/background.js"
            "js/jquery-3.4.1.min.js"
        ],
        "persistent": true
    },
<span class="hl-line">    "content_scripts": [</span>
<span class="hl-line">        {</span>
<span class="hl-line">            "matches": [</span>
<span class="hl-line">                "*://*.youtube.com/*"</span>
<span class="hl-line">            ],</span>
<span class="hl-line">            "js": [</span>
<span class="hl-line">                "js/jquery-3.4.1.min.js",</span>
<span class="hl-line">                "js/content.js"</span>
<span class="hl-line">            ],</span>
<span class="hl-line">            "run_at": "document_end"</span>
<span class="hl-line">        }</span>
<span class="hl-line">    ]</span>
}</code></pre>
<p>
The <code class="inline-code">"matches": [ "*://*.youtube.com/*" ]</code> section tells Chrome to run the content scripts when the URL of the website matches the values specified. The <code class="inline-code">"run_at": "document_end"</code> section ensures that the content scripts are run after the page is loaded.
</p>

<h2>Popup</h2>
<p>
</p>

<h2>Web Resources</h2>
<p>
</p>

<h2>Constants</h2>
<p>
</p>

<!-- <img src="{{ "/assets/images/post/productive.png" | relative_url }}" class="img-fluid add-margin-top-normal add-margin-bottom-normal"> -->

...