function newState(listner) {
    return {
        _state: null,
        _listner: listner,
        set state(val) {
            this._state = val;
            this._listner(val);
        },
        get state() {
            return this._state;
        },
        toggle(_default, alternative) {
            if (this._state == _default) {
                this._state = alternative;
                this._listner(alternative);
            } else {
                this._state = _default;
                this._listner(_default);
            }
        },
    }
}

var page_main_screen = newState(function(val) {
    console.log("Change: " + val);
    document.getElementById("page_main_screen").className = val;
});

var rider_origin_loc = newState(function(loc) {
    $("#rider_origin_input").val(loc.address);
    $("#rider_origin_input_bottom").val(loc.address);
    setState("RIDER_REQ_ORIG_PLACE_ID", loc.place_id);
    setState("RIDER_REQ_ORIG_ADDRESS", loc.address);
});

var rider_dest_loc = newState(function(loc) {
    $("#rider_distination_input").val(`${loc.name} (${loc.address})`);
    $("#rider_distination_input_bottom").val(`${loc.name} (${loc.address})`);
    setState("RIDER_REQ_DEST_PLACE_ID", loc.place_id);
    setState("RIDER_REQ_DEST_ADDRESS", loc.address);
});

app = {
    state: {
        geolocation: {
            lat: null,
            lng: null,
        },
        map_markers: [],
        page_main_screen: {
            have_destination_data: false,
            destination_result_index: null,
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
                        app.state.geolocation.lat = position.coords.latitude;
                        app.state.geolocation.lng = position.coords.longitude;
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            strategy: "device",
                        });
                    }, function() {
                        $.post(utils.config.geolocation_url, function(response) {
                            app.state.geolocation.lat = response.location.lat;
                            app.state.geolocation.lng = response.location.lng;
                            resolve({
                                lat: response.location.lat,
                                lng: response.location.lng,
                                strategy: "network",
                            });
                        }).fail(function(error) {
                            app.state.geolocation.lat = app.utils.map.default.lat;
                            app.state.geolocation.lng = app.utils.map.default.lng;
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
                app.rider.main_screen.set_origin(my_loc_rev_geo.place_id);
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
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
                    styles: utils.map_styles,
                });
                window.my_location = new google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    map: map,
                    icon: utils.icons.my_loc,
                    zIndex: 1000,
                });
                app.state.map = map;
            },
        },
    },
    rider: {
        main_screen: {
            toggle_search_results_collapse: function() {
                page_main_screen.toggle("show_one","show_all");
            },
            set_origin: async function(place_id) {
                var loc = await api.v1.riders.rideshare.location_detail(place_id);
                rider_origin_loc.state = loc;
            },
            set_destination: async function(place_id) {
                $("#search_result_" + place_id + " i.initial").toggleClass("hidden");
                $("#search_result_" + place_id + " i.loading").toggleClass("hidden");
                var loc = await api.v1.riders.rideshare.location_detail(place_id);
                rider_dest_loc.state = loc;
                console.log(loc);
                $("#search_result_" + place_id + " i.initial").toggleClass("hidden");
                $("#search_result_" + place_id + " i.loading").toggleClass("hidden");
            },
            collapse: function() {
                // Check if a distination has been set. If not, try to select the inspected
                // destination result.
                var inspected_location_select_button = $(".location_search_result_row.inspecting button.select_result_button");
                inspected_location_select_button.click();
                // Collapse the search detail view.
                page_main_screen.state = "show_initial";
                $("#main_form_on_collapsed").removeClass("collapsed");
                $("#destination_search_results_wrapper").addClass("hidden");
                $("#toggle_sidebar").removeClass("main_screen_expanded");
            },
            destination: {
                select_suggestion: function(address) {
                    $("#rider_distination_input").val(address);
                    $("#rider_distination_input_bottom").val(address);
                    $("#rider_distination_input_button").click();
                },
                show_suggestions: async function(value) {
                    var suggestions = $(".dropdown-menu");
                    if (suggestions.html() == "") {
                        suggestions.html(`
                        <p class="py-1 text-center text-primary search_suggestion w-100 text-truncate">
                            Loading...
                        </p>`);
                    }
                    $(".dropdown-menu i.searching").removeClass("hidden");
                    $(".dropdown-menu i.found").addClass("hidden");
                    suggestions.addClass("show");
                    
                    var lat = app.state.geolocation.lat; var lng = app.state.geolocation.lng;
                    if (!lat || !lng) {
                        var my_loc = await app.utils.map.get_location();
                        var lat = my_loc.lat;
                        var lng = my_loc.lng;
                    }
                    var results = await api.v1.riders.rideshare.search_suggestions(
                        lat, lng, value);
                    if (results.length > 0) {
                        var html = ""
                        for (i = 0; i < results.length; i++) {
                            var address = results[i].address;
                            var place_id = results[i].place_id;
                            html += `
                            <p class="py-1 border-bottom search_suggestion px-2 w-100 text-truncate"
                                address="${address}" place_id="${place_id}">
                                <i class="fas fa-spinner fa-pulse searching hidden"></i>
                                <i class="fas fa-map-marker-alt found"></i>
                                ${address}
                            </p>
                            `
                        }
                        $(".dropdown-menu").html(html);
                    } else {
                        $(".dropdown-menu").html(`
                        <p class="py-1 border-bottom search_suggestion px-2 w-100 text-truncate">
                            <i class="fas fa-spinner fa-pulse searching hidden"></i>
                            <i class="fas fa-map-marker-alt found"></i>
                            ${value}
                        </p>`);
                        $(".dropdown-menu").addClass("show");
                    }
                    $(".search_suggestion").on("mousedown", function(event) {
                        app.rider.main_screen.destination.select_suggestion(event.target.getAttribute("address"));
                    });
                },
                hide_suggestions: function() {
                    $(".dropdown-menu").html();
                    $(".dropdown-menu").removeClass("show");
                },
                onfocus: function() {
                    if (getState("RIDER_REQ_DEST_LIST").length > 0) {
                        page_main_screen.state = "show_one";
                    } else {
                        page_main_screen.state = "show_none";
                    }
                    $("#main_form_on_collapsed").addClass("collapsed");
                    $("#destination_search_results_wrapper").removeClass("hidden");
                    document.getElementById("rider_distination_input").focus();
                    $("#toggle_sidebar").addClass("main_screen_expanded");
                },
                onfocusout: function(element) {
                    // $(".dropdown-menu").removeClass("show");
                    // $("#main_form_top").css("overflow", "hidden");
                    if (page_main_screen.state == "searching") {
                        console.log("Check: searching...");
                        return;
                    }
                    if (page_main_screen.state == "show_one") {
                        console.log("Check: show_one...");
                        return;
                    }
                    if (getState("RIDER_REQ_DIST_LIST").length == 0) {
                        console.log("Check: no list");
                        page_main_screen.state = "show_initial";
                    } else {
                        console.log("Check else");
                        page_main_screen.state = "show_one";
                    }
                    // console.log("hidden");
                },
                keyup: async function(element, click=false) {
                    page_main_screen.state = "show_suggestions";
                    if (typeof(element) == "string") {
                        element = document.getElementById(element);
                    }
                    var field = document.getElementById(element.id);
                    var value = field.value;
                    if (value == "") {
                        element.focus();
                        return;
                    }
                    app.rider.main_screen.destination.show_suggestions(value);
                    if(event.key === 'Enter' || click) {
                        page_main_screen.state = "searching";
                        app.rider.main_screen.destination.hide_suggestions();
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
                        var result_list = utils.get_result_list(response, value);
                        if (response.length > 0) {
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
                        console.log("On KEYUP");
                        $("#destination_search_results_wrapper").removeClass("empty");
                        $("#geoloc_msg_alert").addClass("hidden");
                        var map = new google.maps.Map(document.getElementById('map'), {
                            center: {lat: my_loc.lat, lng: my_loc.lng},
                            zoom: 13,
                            disableDefaultUI: true,
                            streetViewControl: true,
                            streetViewControlOptions: {
                                position: google.maps.ControlPosition.LEFT_BOTTOM
                            },
                            zoomControl: true,
                            zoomControlOptions: {
                                position: google.maps.ControlPosition.LEFT_BOTTOM
                            },
                            styles: utils.map_styles,
                        });
                        var my_location = new google.maps.Marker({
                            position: {lat: my_loc.lat, lng: my_loc.lng},
                            map: map,
                            icon: utils.icons.my_loc,
                            zIndex: 1000,
                        });
                        setTimeout(function() {
                            app.state.map_markers = utils.show_location_markers(
                                map, response, my_loc);
                        }, 250);
                        app.state.map = map;
                        field.value = value;
                        $("#rider_distination_input_bottom").val(value);
                        app.rider.main_screen.destination.onfocusout();
                        setState("RIDER_REQ_DEST_LIST", response);
                        page_main_screen.state = "show_one";
                    }
                },
                keydown: async function(id, click, page=1) {
                    // console.log("key DOWN");
                    if (event.key == "ArrowUp") {
                        // console.log("ArrowUp");
                        event.preventDefault();
                        return false;
                    }
                    if (event.key == "ArrowDown") {
                        // console.log("ArrowDown");
                        event.preventDefault();
                        return false;
                    }
                },
            },
            center_self: function() {
                app.state.map.setCenter(new google.maps.LatLng(
                    app.state.geolocation.lat, app.state.geolocation.lng
                ));
                app.state.map.setZoom(16);
            },
            inspect_prev_location: function() {
                var index = app.state.page_main_screen.destination_result_index;
                if (index != undefined) {
                    var prev_index = index - 1;
                    $(`div[index=${prev_index}]`).click();
                }
            },
            inspect_next_location: function() {
                var index = app.state.page_main_screen.destination_result_index;
                if (index != undefined) {
                    var next_index = index + 1;
                    $(`div[index=${next_index}]`).click();
                }
            },
            inspect_location: function(element) {

                // Unset the old selected location if it exists.
                var old_place_id = $(".inspecting").attr("place_id");
                if (old_place_id) {
                    app.state.map_markers[old_place_id].setIcon();
                }
                $(".inspecting").removeClass("inspecting");

                // Get the results place_id, index, map marker.
                var place_id = element.getAttribute("place_id");
                var marker = app.state.map_markers[place_id];
                var index = parseInt(element.getAttribute("index"));
                var name = element.getAttribute("name");

                // Collapse the full list of search results to show only
                // one result (the selected result).
                page_main_screen.state = "show_one";

                // Set the search result list scroll offset to 101 x the index.
                // Note: 101 because hight = 100px + 1px border.
                var rowScrollTop  = 101 * index;

                // Wait for the results list to collapse (.15s) and
                // then set the new selected location.
                setTimeout(function() {
                    $("#rider_distination_input_bottom").val(name);
                    $("#rider_distination_input").val(name);
                    app.state.page_main_screen.destination_result_index = index;
                    $("#destination_search_results_wrapper").scrollTop(rowScrollTop);
                    marker.setZIndex(1000);
                    marker.setIcon(utils.icons.target_loc);
                    $("#location_row_" + place_id).addClass("inspecting");
                    var max_lat = Math.max(marker.getPosition().lat(), app.state.geolocation.lat);
                    var min_lat = Math.min(marker.getPosition().lat(), app.state.geolocation.lat);
                    var max_lng = Math.max(marker.getPosition().lng(), app.state.geolocation.lng);
                    var min_lng = Math.min(marker.getPosition().lng(), app.state.geolocation.lng);
                    app.state.map.setCenter(new google.maps.LatLng(
                        ((max_lat + min_lat) / 2.0),
                        ((max_lng + min_lng) / 2.0)
                    ));
                    app.state.map.fitBounds(new google.maps.LatLngBounds(
                        new google.maps.LatLng(min_lat, min_lng),
                        new google.maps.LatLng(max_lat, max_lng),
                    ));
                }, 250);
            },
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
    setState("RIDER_REQ_DEST_LIST", "");
}
