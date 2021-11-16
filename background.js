function search(text) {
    if (text != "")
        chrome.storage.sync.get("urls", (data) => {
            for(let url_line of data["urls"].match(/[^\r\n]+/g)){
                if (url_line.trim().charAt(0) != '#'){
                    let search_query = url_line.replace('%s', text);
                    console.log('Searching with: ' + search_query);
                    chrome.tabs.create({
                        url: search_query,
                        active: false,
                    });

                };
            };
        });
    else
        console.log("Neko is sad... Seach Text is Empty...");
}

function listen_to_menu_click(){
    chrome.contextMenus.onClicked.addListener((OnClickData) => {
        if(OnClickData.menuItemId=="NekoNoTeSearchMenuItem")
        {
            console.log("Neko no Te Context Menu Search was Triggered")
            search(OnClickData.selectionText);
        }

    });
    //console.log("Listner for Neko No Te Context Menu was added")
}

chrome.runtime.onInstalled.addListener(() => {

    chrome.contextMenus.create({
        title: "Search with Neko no Te",
        contexts: ["selection"],
        id: "NekoNoTeSearchMenuItem",
    }, listen_to_menu_click)
    //console.log("Neko No Te Context Menu was created")

    chrome.tabs.create({ url: "options.html" });
});

chrome.omnibox.onInputEntered.addListener((text, OnInputEnteredDisposition) => {
    //console.log("Neko no Te Omnibox Search was Triggered")
    search(text);
});
