
"name": "__MSG_extName__"
"version": "1.10.6"
"description": "__MSG_extDescription__"

"icons":
    "16": "images/icon_16.png"
    "48": "images/icon_48.png"
    "128": "images/icon_128.png"


"default_locale": "en"

"background_page": "views/background.html"
"options_page": "views/options.html"

"permissions": [
    "tabs"
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
    "default_icon": "images/backgroundIcons/disabled.png"
    "default_title": "Grooveshark Control"
    "default_popup": "views/popup.html"
