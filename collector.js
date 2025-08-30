function collector() {
    console.log("The collector is working...");
    // window.addEventListener('load', () => {
    //     initActivityTracking();
    // });
    // console.log(activityData)
    // checkUserImagesAllowed();
    sendInitData();
}

function getStaticData() {
    const staticData = {
        seesionID: getUserSession(),
        userAgent: getUserAgentString(),
        language: getUserLanguage(),
        acceptsCookies: checkUserCookiesEnabled(),
        allowsJS: checkUserJSAllowed(),
        allowsImages: checkUserImagesAllowed(),
        allowsCSS: checkCSSEnabled(),
        screenDiemensions: getUserScreenDimensions(),
        windowDimensions: getWindowDimensions(),
        networkConnectionType: getNetworkConnectionType()
    };
    return staticData;
}

async function getPerformanceData() {
    const timingData = await getTimingObj();
    let perfTiming = timingData.timingOldAPI;
    const start = getTimingPageStartLoad(perfTiming);
    const end = getTimingPageEndLoad(perfTiming);
    const total = getTotalLoadTime(start, end);
    const performanceData = {
        timingObj: timingData,
        timingPageStartLoad: start,
        timingPageEndLoad: end,
        totalLoadTime: total
    }
    return performanceData;
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

function checkUserCookiesEnabled() {
    let cookieEnabled = window.navigator.cookieEnabled;
    // if (cookieEnabled) {
        // get cookie
    // }
    console.log("Cookie Accepted:", cookieEnabled);
    return cookieEnabled;
}

function checkUserJSAllowed() {
    // always return ture since this is a js file 
    console.log("User's JavaScript Allows:", true);
    return true;
}

async function checkImagesEnabled(imgAllowed = false) {
    let img = document.querySelector('image');
    if (img) {
        if (img.offsetWidth > 0) {
            imgAllowed = true;
            return imgAllowed;
        } 
    }
    else {
        const body = document.querySelector('body');
        img = document.createElement('img');
        img.id = 'test-img';
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBg6K0zO8AAAAASUVORK5CYII=";
        body.appendChild(img);
    }

    const checkWidth = () => {
        return new Promise((resolve) => {
            const start = Date.now();
            let attemptCount = 0;

            const attempt = () => {
                attemptCount++;
                console.log(`Attempt ${attemptCount}: offsetWidth = ${img.offsetWidth}`);

                if (img.offsetWidth > 0) {
                    resolve(true); // image loaded
                } else if (Date.now() - start >= 10000) {
                    resolve(false); // timeout after 10s
                } else {
                    setTimeout(attempt, 50); // keep checking
                }
            };

            attempt();
        });
    };

    imgAllowed = await checkWidth();

    // Remove test image after checking
    if (img && img.parentNode) {
        img.parentNode.removeChild(img);
    }

    return imgAllowed;
}

async function checkUserImagesAllowed() {
    const imgAllowed = await checkImagesEnabled();
    console.log("User images allowed:", imgAllowed);
    return imgAllowed;
}

function checkCSSEnabled() {
    // Inject a <style> element with a known rule
    const styleEl = document.createElement("style");
    styleEl.textContent = `
        #css-test-detector {
            width: 123px !important;
        }
    `;
    document.head.appendChild(styleEl);

    // Create a test element
    const testEl = document.createElement("div");
    testEl.id = "css-test-detector";
    document.body.appendChild(testEl);

    // Get computed style immediately
    const cssEnabled = window.getComputedStyle(testEl).width === "123px";
    console.log(testEl);
    console.log(styleEl);
    // Cleanup
    testEl.remove();
    styleEl.remove();

    return cssEnabled; // true or false
}

function getUserScreenDimensions() {
    let height = window.screen.height;
    let width = window.screen.width;
    console.log(`User's screen dimensions: ${width} x ${height}`);
    console.log(`Width: ${width} CSS pixels \nHeight: ${height} CSS pixels `);
    return width, height;
}

function getWindowDimensions() {
    let innerHeight = window.innerHeight;
    let innerWidth = window.innerWidth;
    let outerHeight = window.outerHeight;
    let outerWidth = window.outerWidth;
    console.log(`User's inner window dimensions: ${innerWidth} x ${innerHeight}`);
    console.log(`Inner Width: ${innerWidth} CSS pixels \nInner Height: ${innerHeight} CSS pixels `);
    console.log(`User's outer window dimensions: ${outerWidth} x ${outerHeight}`);
    console.log(`Outer Width: ${outerWidth} CSS pixels \nOuter Height: ${outerHeight} CSS pixels `);
    return innerWidth, innerHeight, outerWidth, outerHeight;
}

function getNetworkConnectionType() {
    let type = window.navigator.connection.effectiveType;
    console.log("User's network connection type:", type);
    return type;
    // NetworkInformation {
    //     onchange: null,
    //     effectiveType: "4g",
    //     rtt: 50,
    //     downlink: 10,
    //     saveData: false
    // }
    // NetworkInformation object
    // onchange: null         → No event handler is set
    // effectiveType: "4g"    → Connection type is 4G (can be slow-2g, 2g, 3g, or 4g)
    // rtt: 50                → Estimated round-trip time is ~50ms
    // downlink: 10           → Estimated bandwidth is ~10 Mbps
    // saveData: false        → User has not enabled "Data Saver" mode
}

function getTimingObj() {
    return new Promise((resolve) => {
        window.addEventListener("load", () => {
            setTimeout(() => {
                const [nav] = performance.getEntriesByType("navigation");
                const perfTiming = performance.timing;

                // Store everything in one object
                const timingData = {
                    // New API
                    // newStartTime: nav.startTime,
                    // newDomComplete: nav.domComplete,
                    timingNewAPI: nav, 

                    // Old API
                    // oldDomLoading: perfTiming.domLoading,
                    // oldDomComplete: perfTiming.domComplete,
                    // navigationStart: perfTiming.navigationStart
                    timingOldAPI: perfTiming
                };

                resolve(timingData);
            }, 0);
        });
    });
}

function getTimingPageStartLoad(perfTiming) {
    let startTime = perfTiming.domLoading;
    console.log("Loading started at", startTime);
    return startTime;
}

function getTimingPageEndLoad(perfTiming) {
    let endTime = perfTiming.domComplete;
    console.log("Loading ended at", endTime);
    return endTime;
}

function getTotalLoadTime(startTime, endTime) {
    let totalTime = endTime - startTime;
    console.log("Total load Time:", totalTime);
    return totalTime;
}


const AnalyticsTracker = (() => {
    // ----------------- Private Variables -----------------
    const activityData = {
        mouseMoves: [],
        clicks: [],
        scrolls: [],
        keyEvents: [],
        errors: [],
        idlePeriods: [],
        pageEnter: Date.now(),
        pageLeave: null,
        pageURL: window.location.href
    };

    let lastActivity = Date.now();
    let idleTimeout;
    let sendInterval = 5000; // send every 5 seconds
    let intervalId;

    // ----------------- Private Functions -----------------

    // Idle tracking
    function resetIdleTimer() {
        const now = Date.now();
        if (now - lastActivity >= 2000) { // idle ≥2s
            const idleInfo = {
                start: lastActivity,
                end: now,
                duration: now - lastActivity
            };
            activityData.idlePeriods.push(idleInfo);
            console.log("Idle detected:", idleInfo);
        }
        lastActivity = now;

        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
            lastActivity = Date.now();
        }, 2000);
    }

    // Mouse movement and clicks
    function trackMouseActivity() {
        document.addEventListener('mousemove', e => {
            const move = { x: e.clientX, y: e.clientY, timestamp: Date.now() };
            activityData.mouseMoves.push(move);
            console.log("Mouse moved:", move);
            resetIdleTimer();
        });

        document.addEventListener('click', e => {
            const click = { x: e.clientX, y: e.clientY, button: e.button, timestamp: Date.now() };
            activityData.clicks.push(click);
            console.log("Mouse clicked:", click);
            resetIdleTimer();
        });
    }

    // Scroll tracking
    function trackScrollActivity() {
        document.addEventListener('scroll', () => {
            const scroll = { scrollX: window.scrollX, scrollY: window.scrollY, timestamp: Date.now() };
            activityData.scrolls.push(scroll);
            console.log("Scrolled:", scroll);
            resetIdleTimer();
        });
    }

    // Keyboard tracking
    function trackKeyboardActivity() {
        document.addEventListener('keydown', e => {
            const keyEvent = { type: 'keydown', key: e.key, timestamp: Date.now() };
            activityData.keyEvents.push(keyEvent);
            console.log("Key down:", keyEvent);
            resetIdleTimer();
        });

        document.addEventListener('keyup', e => {
            const keyEvent = { type: 'keyup', key: e.key, timestamp: Date.now() };
            activityData.keyEvents.push(keyEvent);
            console.log("Key up:", keyEvent);
            resetIdleTimer();
        });
    }

    // Error tracking
    function trackErrors() {
        window.addEventListener('error', e => {
            const errorInfo = {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                timestamp: Date.now()
            };
            activityData.errors.push(errorInfo);
            console.log("Error caught:", errorInfo);
        });
    }

    // Page enter/leave tracking
    function trackPageLifecycle() {
        window.addEventListener('beforeunload', () => {
            activityData.pageLeave = Date.now();
            console.log("Page unloading, final send:", { pageLeave: activityData.pageLeave });
            sendData(true); // final send using sendBeacon
        });
    }

    // ----------------- Send Data Function -----------------
    function sendData(useBeacon = false) {
        // Clone current activityData for sending
        const dataToSend = {
            ...activityData,
            mouseMoves: [...activityData.mouseMoves],
            clicks: [...activityData.clicks],
            scrolls: [...activityData.scrolls],
            keyEvents: [...activityData.keyEvents],
            errors: [...activityData.errors],
            idlePeriods: [...activityData.idlePeriods]
        };

        console.log("Sending activity data:", dataToSend);

        if (useBeacon && navigator.sendBeacon) {
            navigator.sendBeacon('/collector-endpoint', JSON.stringify({ type: 'activity', data: dataToSend }));
        } else {
            fetch('/collector-endpoint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'activity', data: dataToSend })
            }).catch(err => console.error("Failed to send activity data:", err));
        }

        // Clear the arrays after sending to send only new events next time
        activityData.mouseMoves.length = 0;
        activityData.clicks.length = 0;
        activityData.scrolls.length = 0;
        activityData.keyEvents.length = 0;
        activityData.errors.length = 0;
        activityData.idlePeriods.length = 0;
    }

    // ----------------- Public Init Function -----------------
    function init() {
        console.log("Initializing AnalyticsTracker...");
        trackMouseActivity();
        trackScrollActivity();
        trackKeyboardActivity();
        trackErrors();
        trackPageLifecycle();
        resetIdleTimer();

        // Auto-send activity data every sendInterval
        intervalId = setInterval(() => sendData(), sendInterval);
    }

    // Expose init and sendData
    return { 
        init, 
        sendData // now you can call AnalyticsTracker.sendData() manually
    };
})();

function getUserSession() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

function generateSessionId() {
    return Math.random().toString(36).substring(2, 15);
}

async function sendInitData() {
    window.addEventListener("load", async () => {
        // AnalyticsTracker.init();
        const url = 'https://1deca.de/json/userData';
        await sendDataToServer('static', url, getStaticData);
        await sendDataToServer('performance', url, getPerformanceData);
    });
}

async function sendDataToServer(type, url, dataCollector, delayMs = 10000) {
    setTimeout(async () => {
        try {
            // Collect data (could be sync or async)
            const data = await dataCollector();
            
            // Attach type and session ID
            const payload = {
                type: type,               // e.g., 'static', 'performance', 'activity'
                sessionId: getUserSession(),
                timestamp: new Date().toISOString(),
                data: data
            };

            // Send to server
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(`${type} data sent successfully:`, result);
        } catch (err) {
            console.error(`Error sending ${type} data:`, err);
        }
    }, delayMs);
}

collector();
