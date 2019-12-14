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

app = {
    state: {
        set_geolocation: function(lat, lng) {

        },
        geolocation: {
            lat: null,
            lng: null,
        },
    },
    utils: {
        browser: {
            get_browser: utils.get_browser,
            get_enable_geolocation_link: utils.get_enable_geolocation_link,
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
                        $.post(utils.config.geolocation_url, function(response) {
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
                setState("my_location", loc);
                app.utils.map.render(loc.lat,loc.lng,loc.strategy);
                var my_loc_rev_geo = await api.v1.riders.rideshare.reverse_geocode(loc.lat, loc.lng);
                app.rider.main_screen.set_origin(my_loc_rev_geo.formatted_address, my_loc_rev_geo.place_id);
            },
            render: function(lat, lng, strategy) {
                utils.set_geolocation_msg(strategy);
                var map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: lat, lng: lng},
                    zoom: 13,
                    disableDefaultUI: true,
                    zoomControl: true,
                    streetViewControl: true,
                });
                window.my_location = new google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    map: map,
                    icon: utils.icons.my_loc,
                });
            },
        },
    },
    rider: {
        main_screen: {
            toggle_search_results_collapse: function() {
                $("#destination_search_results_wrapper").toggleClass("collapsed");
            },
            set_origin: function(formatted_address, place_id) {
                setState("origin", {
                    "formatted_address": formatted_address,
                    "place_id": place_id,
                });
                $("#rider_distination_input").val(formatted_address);
            },
            collapse: function() {
                $("#main_form").removeClass("expanded");
            },
            onfocus: function() {
                $("#main_form").addClass("expanded");
            },
            search_destination: async function(field, click, page=1) {
                var value = field.value;
                if(event.key === 'Enter' || click) {
                    value = field.value;

                    var my_loc = await app.utils.map.get_location();
                    var response = await api.v1.riders.rideshare.search_location(
                        my_loc.lat, my_loc.lng, value);
                    var result_list = utils.get_result_list(response.results);
                    $("#destination_search_results").html(result_list);
                    $("#destination_search_results_wrapper").removeClass("hidden");
                    var map = new google.maps.Map(document.getElementById('map'), {
                        center: {lat: my_loc.lat, lng: my_loc.lng},
                        zoom: 13,
                        disableDefaultUI: true,
                        zoomControl: true,
                        streetViewControl: true,
                    });
                    var my_location = new google.maps.Marker({
                        position: {lat: my_loc.lat, lng: my_loc.lng},
                        map: map,
                    });
                    utils.show_location_markers(map, response.results, my_loc);
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
