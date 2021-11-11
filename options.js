function validURL(str) {
    var pattern = new RegExp(
        '^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'
    );
    return !!pattern.test(str);
}

function cleanURLs(urls){
    if(urls.trim() != "") {
        let lines_new = [];
        for(let line of urls.split('\n')){
            if (line.trim().charAt(0) != '#' && line.trim() != "" && !validURL(line)){
                line = '# ' + line;
            }
            lines_new.push(line);
        };
        console.log(lines_new);
        console.log(lines_new.join('\n'))
        urls = lines_new.join('\n');    
    }
    return urls;
}

function resetURLs()
{
    urls.value = [
        'Populer Search Engines',
        'https://www.google.com/search?q=%s',
        'https://www.bing.com/search?q=%s',
        'https://search.yahoo.com/search?p=%s',
        '', 'Interesting Search Engines',
        'https://duckduckgo.com/?q=%s',
        'https://www.metacrawler.com/serp?q=%s',
        'https://neeva.com/search?q=%s',
        'https://www.you.com/search?q=%s',
        '', 'Forcused Informatioin Searches',
        'https://stackoverflow.com/search?q=%s',
        'https://en.wikipedia.org/w/index.php?search=%s',
        'https://ja.wikipedia.org/w/index.php?search=%s',
        'https://www.wolframalpha.com/input/?i=%s',
        'https://www.imdb.com/find?q=%s',
        '','Shopping Sites',
        'https://smile.amazon.com/s?k=%s',
        'https://www.amazon.co.jp/s?k=%s',
    ].join('\n');
    console.log('Initialized Search URLs.');
    saveURLs(urls.value);
}

function saveURLs(urls){
    urls = cleanURLs(urls);
    chrome.storage.sync.set({"urls": urls}, function(){
        chrome.storage.local.set({"urls": urls}, null);
        console.log('Saved Search URLs:');
        console.log(urls);
    });
}

function loadURLs(){
    chrome.storage.sync.get("urls", (data) => {
        urls.value = data["urls"];
        if(chrome.runtime.error || urls.value == void(0) || urls.value == "undefined" || urls.value.trim() == ""){
            resetURLs();
        } else {
            console.log('Loaded Search URLs:');
        };
        urls.rows = urls.value.split('\n').length + 1
        chrome.storage.local.set({"urls": urls.value}, null);
        console.log(urls.value);
    });
}

function showResponse(text)
{
    response.innerHTML = text;
    setTimeout(()=>{ response.innerHTML = ""}, 1200);
}

function saveButtonClick(event){
    saveURLs(urls.value);
    loadURLs();
    showResponse('Options Saved');
}

function resetButtonClick(event){
    resetURLs(urls.value);
    loadURLs();
    showResponse('Options Reset');
}

function optionPageLoad(){
    loadURLs();
    history.pushState(null, "Neko no Te", "options.html");
}

document.getElementById("save").addEventListener("click", saveButtonClick);
document.getElementById("reset").addEventListener("click", resetButtonClick);
optionPageLoad();