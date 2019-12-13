app = {
    state: {
        geolocation: {
            lat: null,
            lng: null,
        },
    },
    utils: {
        browser: {
            get_browser: function() {
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
if (isOpera == true) {
    console.log("opera");
    return "opera";
}
var isFirefox = (navigator.userAgent.indexOf("Firefox") > 0);
if (isFirefox == true) {
    console.log("firefox");
    return "firefox";
}
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
if (isSafari == true) {
    console.log("safari");
    return "safari";
}
var isIE = /*@cc_on!@*/false || !!document.documentMode;
if (isIE == true) {
    console.log("ie");
    return "ie";
}
var isEdge = !isIE && !!window.StyleMedia;
if (isEdge == true) {
    console.log("edge");
    return "edge";
}
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
if (isChrome == true) {
    console.log("chrome");
    return "chrome";
}
var isBlink = (isChrome || isOpera) && !!window.CSS;
if (isBlink == true) {
    console.log("blink");
    return "blink";
}
            },
            get_enable_geolocation_link() {
                browser = app.utils.browser.get_browser();
switch (String(browser)) {
    case "opera":
        return "https://help.opera.com/en/geolocation/";
    case "firefox":
        return "https://support.mozilla.org/en-US/kb/improve-mozilla-location-services-turning-location";
    case "safari":
        return "https://support.apple.com/en-us/HT204690";
    case "ie":
        return "https://support.microsoft.com/en-us/help/17479/windows-internet-explorer-11-change-security-privacy-settings";
    case "edge":
        return "https://support.microsoft.com/en-us/help/17479/windows-internet-explorer-11-change-security-privacy-settings";
    case "chrome":
        return "https://support.google.com/chrome/answer/142065";
    default:
        return "https://support.google.com/chrome/answer/142065";
}
            }
        },
        map: {
            default: {
                lat: 37.7749,
                lng: -122.4194,
            },
            get_location: function() {
                return new Promise(resolve => {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            strategy: "device",
                        });
                    }, function() {
                        $.post("https://www.googleapis.com/geolocation/v1/geolocate?key={{ settings.GOOGLE_MAPS_API_KEY }}", function(response) {
                            resolve({
                                lat: response.location.lat,
                                lng: response.location.lng,
                                strategy: "network",
                            });
                        }).fail(function(error) {
                            resolve({
                                lat: app.utils.map.default.lat,
                                lng: app.utils.map.default.lng,
                                strategy: "default settings",
                            });
                        });
                    });
                });
            },
            init: async function() {
                var loc = await app.utils.map.get_location();
                app.utils.map.render(loc.lat,loc.lng,loc.strategy);
            },
            render: function(lat, lng, strategy) {
                var geoloc_msg = "";
                var link = app.utils.browser.get_enable_geolocation_link();
                if (strategy == "network") {
                    geoloc_msg = `
<p>Estimating your geolocation from your <a href="${link}">${strategy}</a>.<p>
<p>Improve your location by <a href="${link}">enabling geolocation</a>.</p>`;
                } else if (strategy == "device") {
                    geoloc_msg = `
<p>Getting your geolocation from your <a href="${link}">${strategy}</a>.<p>
<p>Enable or disable geolocation <a href="${link}">for your device</a>.</p>`;
                } else {
                    geoloc_msg = `
<p>Assuming your geolocation from your <a href="${link}">${strategy}</a>.<p>
<p>Improve your location by <a href="${link}">enabling geolocation</a>.</p>`;
                }
                $("#geoloc_msg").html(`
                    <small>
                        ${geoloc_msg}
                    </small>
                `);
                $("#geoloc_msg_alert").removeClass("hidden");
                window.map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: lat, lng: lng},
                    zoom: 13,
                    disableDefaultUI: true,
                    zoomControl: true,
                    streetViewControl: true,
                });
                window.my_location = new google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    map: map,
                    icon: {
                        path: 'M11 2c-3.9 0-7 3.1-7 7 0 5.3 7 13 7 13 0 0 7-7.7 7-13 0-3.9-3.1-7-7-7Zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5 0-1.4 1.1-2.5 2.5-2.5 1.4 0 2.5 1.1 2.5 2.5 0 1.4-1.1 2.5-2.5 2.5Z',
                        scale: 3,
                        anchor: new google.maps.Point(11, 22),
                        fillOpacity: 1,
                        fillColor: "#007bfe",
                        strokeOpacity: 0
                    },
                });
            }
        },
    },
    rider: {
        main_screen: {
            search_destination: function(field, click) {
                var value = field.value;
                if(event.key === 'Enter' || click) {
                    value = field.value;
                    console.log("Search: " + value);
                    response = api.v1.riders.rideshare.search_location(value);
                    console.log(response);
                }
            }
        }
    }
}

var prev_handler = window.onload;
window.onload = function() {
    if (prev_handler) {
        prev_handler();
    }
    document.getElementById("toggle_sidebar").addEventListener(
        "click", (event) => {
         $("#_toggle_sidebar").click();
    });
}
