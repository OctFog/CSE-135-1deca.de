function collector() {
    console.log("The collector is working...");
    // getUserAgentString();
    
}

function getUserAgentString() {
    uaStr = window.navigator.userAgent;
    console.log("User agent string:", uaStr);
    return uaStr;
}

collector();