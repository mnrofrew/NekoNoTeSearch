chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: "options.html" });
});

chrome.omnibox.onInputEntered.addListener((text, OnInputEnteredDisposition) => {
    chrome.storage.sync.get("urls", (data) => {
        for(let url_line of data["urls"].match(/[^\r\n]+/g).reverse()){
            if (url_line.trim().charAt(0) != '#'){
                let search_query = url_line.replace('%s', text);
                console.log('Searching with: ' + search_query);
                chrome.tabs.create({url: search_query});
            };
        };
    });
});
