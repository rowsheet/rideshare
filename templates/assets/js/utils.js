function setState(key, val) {
    sessionStorage.setItem(key, JSON.stringify(val));
}

function getState(key) {
    var obj = sessionStorage.getItem(key);
    if (obj) {
        return JSON.parse(obj);
    }
    return "";
}


utils = {
    config: {
        geolocation_url: "https://www.googleapis.com/geolocation/v1/geolocate?key={{ settings.GOOGLE_MAPS_API_KEY }}",
    },
    get_browser: function() {
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        if (isOpera == true) {
            return "opera";
        }
        var isFirefox = (navigator.userAgent.indexOf("Firefox") > 0);
        if (isFirefox == true) {
            return "firefox";
        }
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
        if (isSafari == true) {
            return "safari";
        }
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        if (isIE == true) {
            return "ie";
        }
        var isEdge = !isIE && !!window.StyleMedia;
        if (isEdge == true) {
            return "edge";
        }
        var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        if (isChrome == true) {
            return "chrome";
        }
        var isBlink = (isChrome || isOpera) && !!window.CSS;
        if (isBlink == true) {
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
<p>Estimating your geolocation from your <a class="text-primary" href="${link}">${strategy}</a>.<p>`;
        } else if (strategy == "device") {
            geoloc_msg = `
<p>Getting your geolocation from your <a class="text-primary" href="${link}">${strategy}</a>.<p>`;
        } else {
            geoloc_msg = `
<p>Assuming your geolocation from your <a class="text-primary" href="${link}">${strategy}</a>.<p>`;
        }
        $("#geoloc_msg").html(`
            <small>
                ${geoloc_msg}
            </small>
        `);
        $("#geoloc_msg_alert").removeClass("hidden");
    },
    icons: {
        target_loc: {
            path: 'M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z',
            scale: 0.1,
            anchor: new google.maps.Point(215, 550),
            fillOpacity: 1,
            fillColor: "#007bfe",
            strokeOpacity: 0
        },
        my_loc: {
            // path: 'M11 2c-3.9 0-7 3.1-7 7 0 5.3 7 13 7 13 0 0 7-7.7 7-13 0-3.9-3.1-7-7-7Zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5 0-1.4 1.1-2.5 2.5-2.5 1.4 0 2.5 1.1 2.5 2.5 0 1.4-1.1 2.5-2.5 2.5Z',
            path: 'M500 224h-30.364C455.724 130.325 381.675 56.276 288 42.364V12c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v30.364C130.325 56.276 56.276 130.325 42.364 224H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h30.364C56.276 381.675 130.325 455.724 224 469.636V500c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-30.364C381.675 455.724 455.724 381.675 469.636 288H500c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12zM288 404.634V364c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40.634C165.826 392.232 119.783 346.243 107.366 288H148c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-40.634C119.768 165.826 165.757 119.783 224 107.366V148c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-40.634C346.174 119.768 392.217 165.757 404.634 224H364c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40.634C392.232 346.174 346.243 392.217 288 404.634zM288 256c0 17.673-14.327 32-32 32s-32-14.327-32-32c0-17.673 14.327-32 32-32s32 14.327 32 32z',
            // scale: 3,
            scale: 0.1,
            // anchor: new google.maps.Point(11, 22),
            anchor: new google.maps.Point(231, 231),
            fillOpacity: 1,
            fillColor: "#007bfe",
            strokeOpacity: 0
        },
    },
    stars: function(rating) {
        var html = ``;
        for (i = 0; i < rating.length; i++) {
            html += "STAR";
        }
        return html;
    },
    get_result_list: function(results, search) {
        console.log(results);
        var list = `
<div class="row p-1 m-0 border-bottom location_search_result_row bg-white text-secondary"
    style="position: sticky; top: 0px; z-index: 1;">
    <div class="col-9 px-1 text-center">
        <p class="text-truncate"><small>
            Found ${results.length} results for "${search}"
        </small></p>
    </div>
</div>
        ` + results.map((result, index) => `
<div class="row p-2 m-0 border-bottom location_search_result_row bg-grey"
    index="${index}"
    place_id="${result.place_id}"
    name="${result.name}"
    id="location_row_${result.place_id}"
    onclick="app.rider.main_screen.inspect_location(this)">
    <div class="col-9 location_search_result_text">
        <p>${result.name}</p>
        <small>
            <p>${result.address}</p>
            <p>
                <i class="fas fa-star" style="width: auto;"></i>
                ${result.rating}/5 (${result.total_reviews} reviews)
            </p>
            <p>
                ${ result.price_level == 0 ? 'Free' : '' }
                ${ result.price_level == 1 ? '$' : '' }
                ${ result.price_level == 2 ? '$$' : '' }
                ${ result.price_level == 3 ? '$$$' : '' }
                ${ result.price_level == 4 ? '$$$$' : '' }
                ${ result.open_new == true ? 'Open': 'Closed' }</p>
        </small>
    </div>
    <div class="col-3 p-0 pt-2 text-center">
        <img src="${result.icon}" class="google_icon_img mb-2"/>
        <button id="search_result_${result.place_id}"
            class="btn btn-primary btn-sm m-auto select_result_button pl-2"
            style="display: block; white-space: nowrap; padding: 5px; width: 75px;"
            onclick="app.rider.main_screen.set_destination('${result.place_id}')">
            <i class="fas fa-spinner fa-pulse p-0 m-0 loading hidden"
                style="font-size: initial; width: auto; height: auto;"></i>
            <i class="fas fa-map-marker-alt p-0 m-0 initial"
                style="font-size: initial; width: auto; height: auto;"></i>
            Select 
        </button>
    </div>
</div>`).join("") + `
<div class="row p-2 m-0 border-bottom location_search_result_row bg-grey">
    <div class="col-12 px-1 text-center">
        <button class="btn btn-outline-danger btn-sm m-0">
            No more results.        
        </button>
    </div>
</div>`;
        return list;
    },
    show_location_markers: function(map, results, my_loc) {
        var markers = {};
        for (i = 0; i < results.length; i++) {
            result = results[i];
            markers[result.place_id] = new google.maps.Marker({
                position: {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                },
                map: map,
            })
        }
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
        console.log(markers);
        return markers;
    },
    map_styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"},{"lightness":"37"},{"saturation":"-60"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":"-100"},{"lightness":"23"},{"gamma":"0.50"},{"weight":"1.19"},{"color":"#ffc200"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"on"},{"saturation":"46"},{"color":"#000000"},{"lightness":"70"},{"gamma":"7.91"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"saturation":"-63"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"color":"#df0909"},{"saturation":"60"},{"gamma":"4.20"},{"lightness":"56"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#ffc200"},{"lightness":"24"},{"gamma":"0.84"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"saturation":"58"},{"color":"#ffc200"},{"lightness":"95"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"on"},{"saturation":"-100"},{"lightness":"39"},{"gamma":"1.26"},{"hue":"#ffc200"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#ffc200"},{"lightness":"55"},{"gamma":"0.92"},{"saturation":"-100"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#dddddd"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#eeeeee"}]},{"featureType":"transit","elementType":"labels.icon","stylers":[{"saturation":"-100"},{"hue":"#0800ff"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#74c5ff"},{"saturation":"-8"},{"lightness":"14"},{"gamma":"7.06"}]}],
}
