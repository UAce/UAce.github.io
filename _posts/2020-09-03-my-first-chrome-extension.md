---
layout: post
title: Making my First Chrome Extension
author: Yu-Yueh Liu
categories:
- Learning
tags:
- JavaScript
- HTML5
- CSS3
- Chrome Extension
date: 2020-09-03 03:27 -0400
---
Chrome extensions are programs that add functionalities to Chrome and enhance your browsing experience. In fact, you can find a myriad of extensions for the purpose of improving your productivity, protecting your privacy, and more. Making your own Chrome extension is quite simple and it could turn out to be a fun personal project.

### Goal
This article is a documentation of what I learned when making my first Chrome extension YouTubeStopwatch. If you're looking for a tutorial for starters, check out the official **[Getting Started Tutorial][getting-started]**.



### What is YouTubeStopwatch?
**[YouTubeStopwatch][youtube-stop-watch]** was created for a course on Human-Computer Interaction (HCI). The objective was to help users manage the amount of time they would like to spend on YouTube, and somehow incite them to quit YouTube without resorting to blocking the site.

The idea was to prompt the user for the desired time they want to spend on YouTube and start a countdown. Once the time is up, the user is asked whether they want to stay on YouTube or leave. If they choose to keep watching videos, they will be subject to some gradual graphical deterioration and slowly worsening their viewing experience.

So how did I get started? Well, the first thing I had to learn was how Chrome Extensions are structured.

<!-- TODO: add ToC -->
## Project Structure

{% code lang:Markdown %}
src
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
{% endcode %}

## Manifest

The `manifest.json` file is the first thing you need when creating an extension. It provides all the information about your extension to Google Chrome such as the name of your extension, the permissions needed, etc but we'll get into that a bit later. Here is a minimal example:

```JSON
{
    "manifest_version": 2,
    "version": "0.1",
    "name": "My Extension",
    "description": "This is my extension"
}
```

## Background Scripts

Background scripts are scripts that run in the background of your browser when you open Google Chrome. You can make the scripts persistent or not depending on your use case. I chose to use a persistent script. As long as Google Chrome is open, the script will be running. To define background scripts, I added a **background** section to the **manifest** file. 

```JSON
{
    "manifest_version": 2,
    "version": "0.1",
    "name": "My Extension",
    "description": "This is my extension",
    "background": {
        "scripts": [
            "js/background.js"
        ],
        "persistent": true
    }
}
```

> _**Note**: It is now recommended to use non-persistent background scripts with [Event Driven Background Scripts][background-scripts]._

Below is an example of what my background script looked like.

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

When the script starts, a callback function is added with `onMessage.addListener()` to handle events. Depending on the event received, a different action will be triggered. For example, the **`START_COUNTDOWN`** event will start the countdown in the background script. The tabId is stored in a list to keep track of active youtube tabs if the sender is youtube. This is done using the Chrome Tabs API and we need to give permissions to our application in the manifest file.


I needed to use JQuery in the background script so I downloaded the *jquery-3.4.1.min.js* file, saved it in the **js** directory and specified the file as a background script. Here are the new changes to the manifest file:


```JSON
{
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
    }
}
```


## Content Scripts

Content Scripts are run on specific web pages and can interact with a website's DOM. To define a content script, I added a **content_scripts** section to the **manifest** file.

```JSON
{
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
    "content_scripts": [
        {
            "matches": [
                "*://*.youtube.com/*"
            ],
            "js": [
                "js/jquery-3.4.1.min.js",
                "js/content.js"
            ],
            "run_at": "document_end"
        }
    ]
}
```

The `"matches": [ "*://*.youtube.com/*" ]` section tells Chrome to run the content scripts when the URL of the website matches the values specified. The `"run_at": "document_end"` section ensures that the content scripts are run after the page is loaded.


<!-- ## Popup



## Web Resources



## Constants -->

## Conclusion

Chrome Extensions have changed since I first created this project but it was still a valuable experience.

[getting-started]: https://developer.chrome.com/extensions/getstarted
[youtube-stop-watch]: https://chrome.google.com/webstore/detail/youtubestopwatch/ibaejmohdpnppkglomilmholhndaobag
[background-scripts]: https://developer.chrome.com/extensions/background_migration


<script src="//cdn.jsdelivr.net/gh/TRSasasusu/highlightjs-highlight-lines.js@1.1.5/highlightjs-highlight-lines.min.js"></script>
<script>
hljs.initHighlightingOnLoad();
hljs.initHighlightLinesOnLoad([[], [],
    [{start: 5, end: 10, color: 'rgba(255, 255, 255, 0.2)'}],
    [],
    [{start: 5, end: 7, color: 'rgba(255, 255, 255, 0.2)'}, {start: 11, end: 11, color: 'rgba(255, 255, 255, 0.2)'}],
    [{start: 15, end: 26, color: 'rgba(255, 255, 255, 0.2)'}]
]);
</script>

🐢