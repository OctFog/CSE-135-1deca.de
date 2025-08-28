function collector() {
    console.log("The collector is working...");
    // getUserAgentString();
    // getUserLanguage();
    // getUserCookie();
    
}

function getUserAgentString() {
    let uaStr = window.navigator.userAgent;
    console.log("User agent string:", uaStr);
    return uaStr;
}

function getUserLanguage() {
    let language = window.navigator.language;
    let languages = window.navigator.languages;
    console.log("User's language:", language);
    return language; 
}

function getUserCookie() {
    let cookieEnabled = window.navigator.cookieEnabled;
    if (cookieEnabled) {
        // get cookie
    }
    console.log("Cookie Accepted:", cookieEnabled);
    return cookieEnabled;
}

collector();