utils = {
    config: {
        geolocation_url: "https://www.googleapis.com/geolocation/v1/geolocate?key={{ settings.GOOGLE_MAPS_API_KEY }}",
    },
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
    get_enable_geolocation_link: function() {
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
    },
    set_geolocation_msg: function(strategy) {
        var geoloc_msg = "";
        var link = utils.get_enable_geolocation_link();
        if (strategy == "network") {
            geoloc_msg = `
<p>Estimating your geolocation from your <a href="${link}">${strategy}</a>.<p>`;
        } else if (strategy == "device") {
            geoloc_msg = `
<p>Getting your geolocation from your <a href="${link}">${strategy}</a>.<p>`;
        } else {
            geoloc_msg = `
<p>Assuming your geolocation from your <a href="${link}">${strategy}</a>.<p>`;
        }
        $("#geoloc_msg").html(`
            <small>
                ${geoloc_msg}
            </small>
        `);
        $("#geoloc_msg_alert").removeClass("hidden");
    },
    icons: {
        my_loc: {
            path: 'M11 2c-3.9 0-7 3.1-7 7 0 5.3 7 13 7 13 0 0 7-7.7 7-13 0-3.9-3.1-7-7-7Zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5 0-1.4 1.1-2.5 2.5-2.5 1.4 0 2.5 1.1 2.5 2.5 0 1.4-1.1 2.5-2.5 2.5Z',
            scale: 3,
            anchor: new google.maps.Point(11, 22),
            fillOpacity: 1,
            fillColor: "#007bfe",
            strokeOpacity: 0
        },
    },
    get_result_list: function(results) {
        var list = results.map(result => `
<div class="row py-2 m-0 border-bottom location_search_result_row">
    <div class="col-2 px-1">
        <img src="${result.icon}"
            class="btn btn-outline-primary google_icon_img"/>
    </div>
    <div class="col-6 p-1 location_search_result_text">
        <nobr><p>${result.name}</p></nobr>
        <nobr><small><p>${result.vicinity}</p></small></nobr>
    </div>
    <div class="col-4 p-0 pt-2">
        <button class="btn btn-primary btn-sm m-auto" style="display: block;">
            SELECT
        </button>
    </div>
</div>`).join("");
        return list;
    },
    show_location_markers: function(map, results, my_loc) {
        results.map(result => {
            new google.maps.Marker({
                position: {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                },
                map: map,
            })
        });
        var lats = results.map(result => result.geometry.location.lat).concat(my_loc.lat);
        var lngs = results.map(result => result.geometry.location.lng).concat(my_loc.lng);
        var min_lat = Math.min.apply(Math, lats);
        var max_lat = Math.max.apply(Math, lats);
        var min_lng= Math.min.apply(Math, lngs);
        var max_lng= Math.max.apply(Math, lngs);
        map.setCenter(new google.maps.LatLng(
            ((max_lat+ min_lat) / 2.0),
            ((max_lng+ min_lng) / 2.0)
        ));
        map.fitBounds(new google.maps.LatLngBounds(
            new google.maps.LatLng(min_lat, min_lng),
            new google.maps.LatLng(max_lat, max_lng),
        ));
    },
}
