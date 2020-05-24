// Check whether new version & open thanks page if so
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({url:chrome.extension.getURL("thanks.html")}, function (tab) {});
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

//Open survey on Uninstall
chrome.runtime.setUninstallURL("https://docs.google.com/forms/d/e/1FAIpQLScZmuhVCd4qWZOScs9c3_HLrEikW-u3gc7BIFCX4bQc945B-Q/viewform?usp=sf_link");
