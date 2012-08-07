
"name": "__MSG_extName__"
"version": "2.0.6"
"description": "__MSG_extDescription__"

"icons":
    "16": "images/icons/16.png"
    "48": "images/icons/48.png"
    "128": "images/icons/128.png"


"default_locale": "en"

"background_page": "views/background.html"
"options_page": "views/options.html"

"permissions": [
    "tabs"
    "contextMenus"
    "notifications"
    "http://grooveshark.com/*"
    "http://preview.grooveshark.com/*"
]

"content_scripts": [
    "js": [
        "javascript/contentscript.min.js"
    ]
    "matches": [
        "http://grooveshark.com/*"
        "http://preview.grooveshark.com/*"
    ]
]

"browser_action":
    "default_icon": "images/background/disabled.png"
    "default_title": "Grooveshark Control"
    "default_popup": "views/popup.html"

"omnibox":
    "keyword" : "gc"
