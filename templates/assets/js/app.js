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
                    zoom: 15,
                    disableDefaultUI: true,
                    streetViewControl: true,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_BOTTOM
                    },
                    styles: utils.map_styles,
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
                $("#destination_search_results_header").toggleClass("collapsed");
            },
            set_origin: function(formatted_address, place_id) {
                setState("origin", {
                    "formatted_address": formatted_address,
                    "place_id": place_id,
                });
                $("#rider_origin_input").val(formatted_address);
                $("#rider_origin_input_bottom").val(formatted_address);
            },
            set_destination: function(element) {
                console.log(element.getAttribute("place_id"));
                console.log(element.getAttribute("formatted_address"));
            },
            collapse: function() {
                $("#main_form_on_expanded").removeClass("expanded");
                $("#main_form_on_expanded").addClass("collapsed");
                $("#main_form_on_collapsed").removeClass("collapsed");
                $("#destination_search_results_wrapper").addClass("hidden");
                $("#destination_search_results_header").addClass("hidden");
                $("#toggle_sidebar").removeClass("main_screen_expanded");
            },
            onfocus: function() {
                $("#main_form_on_expanded").addClass("expanded");
                $("#main_form_on_expanded").removeClass("collapsed");
                $("#main_form_on_collapsed").addClass("collapsed");
                $("#destination_search_results_wrapper").removeClass("hidden");
                $("#destination_search_results_wrapper").addClass("collapsed");
                $("#destination_search_results_header").removeClass("hidden");
                document.getElementById("rider_distination_input").focus();
                $("#toggle_sidebar").addClass("main_screen_expanded");
            },
            search_destination: async function(id, click, page=1) {
                var field = document.getElementById(id);
                var value = field.value;
                if (value == "") {
                    document.getElementById("rider_distination_input").focus();
                    return;
                }
                if(event.key === 'Enter' || click) {
                    field.value = "Loading...";

                    $("#map").html(`
<div class="h-100 p-3 bg-light">
    <h5 class="text-center pt-3 text-primary">
        <i class="fas fa-spinner fa-pulse mb-1"></i>
        <br>Searching for:
        <br><span class="text-dark">"${value}"...</span>
    </h5>
</div>
                    `);
                    $("#destination_search_results").html("");

                    var my_loc = await app.utils.map.get_location();
                    var response = await api.v1.riders.rideshare.search_location(
                        my_loc.lat, my_loc.lng, value);
                    var result_list = utils.get_result_list(response.results, value);
                    if (response.results.length > 0) {
                        $("#destination_search_results").html(result_list);
                    } else {
                        $("#destination_search_results").html(`
                        <div class="p-3">
                            <p class="alert alert-danger text-center">
                                No results found.
                            </p>
                        </div>
                        `);
                    }
                    $("#destination_search_results_wrapper").removeClass("hidden");
                    $("#destination_search_results_wrapper").addClass("collapsed");
                    $("#destination_search_results_wrapper").removeClass("empty");
                    $("#destination_search_results_header").removeClass("hidden");
                    $("#destination_search_results_header").removeClass("empty");
                    $("#geoloc_msg_alert").addClass("hidden");
                    var map = new google.maps.Map(document.getElementById('map'), {
                        center: {lat: my_loc.lat, lng: my_loc.lng},
                        zoom: 13,
                        disableDefaultUI: true,
                        zoomControl: true,
                        zoomControlOptions: {
                            position: google.maps.ControlPosition.RIGHT_BOTTOM
                        },
                        styles: utils.map_styles,
                    });
                    utils.show_location_markers(map, response.results, my_loc);
                    var my_location = new google.maps.Marker({
                        position: {lat: my_loc.lat, lng: my_loc.lng},
                        map: map,
                        icon: utils.icons.my_loc,
                        zIndex: 1000,
                    });
                    field.value = value;
                    $("#rider_distination_input_bottom").val(value);
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
