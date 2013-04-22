// Spartacus heatmap display and sunlight overlay controller.
// Written by: Cory Walker
// Much of the math described in:
// https://docs.google.com/document/d/1lSpNXkArxVn74fjcChiVcVgODeqtSCGuomHpwvQDdQs/edit
function general_rot_zxz(x, y, z, a, b, c) {
    // ROTATION MATRIX OF DOOMMMMMM!!!
    // See http://en.wikipedia.org/wiki/Euler_angles#Relationship_to_other_representations
    var x2 = x * (Math.cos(a) * Math.cos(c) - Math.cos(b) * Math.sin(a) * Math.sin(c));
    x2 += y * (-Math.cos(a) * Math.sin(c) - Math.cos(b) * Math.cos(c) * Math.sin(a));
    x2 += z * (Math.sin(a) * Math.sin(b));
    var y2 = x * (Math.cos(c) * Math.sin(a) + Math.cos(a) * Math.cos(b) * Math.sin(c));
    y2 += y * (Math.cos(a) * Math.cos(b) * Math.cos(c) - Math.sin(a) * Math.sin(c));
    y2 += z * (-Math.cos(a) * Math.sin(b));
    var z2 = x * (Math.sin(b) * Math.sin(c));
    z2 += y * (Math.cos(c) * Math.sin(b));
    z2 += z * (Math.cos(b));
    return [x2, y2, z2];
}

var app_control = (function () {
    var queue = [],
        loader = {},
        map = {},
        heatmap = {},
        client = {},
        dayLine = null,
        dayPoly = null,
        data = [],
        $ = function (id) {
            return document.getElementById(id);
        },
        update_daylight = function () {
            // Hide our overlay if refreshing
            if (dayLine != null) {
                dayLine.setMap(null);
                dayLine = null;
            }
            if (dayPoly != null) {
                dayPoly.setMap(null);
                dayPoly = null;
            }
            // Find days since May 21 (HINT: month is one less in JS)
            // Year doesn't matter, as long as it's behind the current date.
            var equinox = new Date(2008, 2, 20)
            now = new Date()
            // Get 1 day in milliseconds
            var one_day = 1000 * 60 * 60 * 24
            // Calculate difference between the two dates, and convert to days
            var d = ((now.getTime() - equinox.getTime()) / (one_day)) % 365

            // Find hours since midnight UTC
            var h = (now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()) / 3600.0

            // Calculate tilt angle. 0.4091 is earth's axial tilt in radians.
            var tilt = 0.4091 * Math.sin(((2 * Math.PI) / 365) * d);

            // Calculate rotation angle
            var rotation = -2 * Math.PI * (h / 24.0) + Math.PI / 2;

            // Calculate n-vectors
            var n_vectors = new Array(0);
            var theta = 0;
            // Smaller step means finer overlay
            var dTheta = 2 * Math.PI / 150.0 // 150 total steps
            // Add in an extra step to ensure completion of the polygon
            while (theta < 2 * Math.PI + dTheta) {
                rot = general_rot_zxz(1, 0, 0, rotation, Math.PI / 2 + tilt, theta)
                n_vectors.push(rot)
                theta += dTheta
            }

            // Calculate latitude-longitude coordinates
            var daylightPoly = [] // For the shading polygon of darkness and monsters
            var daylightLine = [] // Line that marks sunrise/sunset. How romantic
            var lastLon = 0
            for (var i = 0; i < n_vectors.length; i++) {
                // Convert n-vector to latlon. See http://en.wikipedia.org/wiki/N-vector#Converting_n-vector_to_latitude.2Flongitude
                var lat = Math.asin(n_vectors[i][2]) * 180 / Math.PI
                var lon = Math.atan2(n_vectors[i][1], n_vectors[i][0]) * 180 / Math.PI
                // So Google Maps can fill in the polygon
                if (i == 0) {
                    if (tilt > 0) {
                        daylightPoly.push(new google.maps.LatLng(-90, lon));
                    } else {
                        daylightPoly.push(new google.maps.LatLng(90, lon));
                    }
                }
                daylightPoly.push(new google.maps.LatLng(lat, lon));
                daylightLine.push(new google.maps.LatLng(lat, lon));
                // So Google Maps can fill in the polygon
                if (i == n_vectors.length - 1) {
                    if (tilt > 0) {
                        daylightPoly.push(new google.maps.LatLng(-90, lon));
                    } else {
                        daylightPoly.push(new google.maps.LatLng(90, lon));
                    }
                    lastLon = lon;
                }
            }
            // So Google Maps can fill in the polygon
            if (tilt < 0) {
                daylightPoly.push(new google.maps.LatLng(90, lastLon - 120));
                daylightPoly.push(new google.maps.LatLng(90, lastLon - 240));
            } else {
                daylightPoly.push(new google.maps.LatLng(-90, lastLon + 120));
                daylightPoly.push(new google.maps.LatLng(-90, lastLon + 240));
            }

            // Construct the darkness polygon. OOOHH SCARY
            dayPoly = new google.maps.Polygon({
                paths: daylightPoly,
                fillColor: "#000000",
                fillOpacity: 0.4,
                strokeWeight: 0,
            });

            // Construct the sunrise/sunset line
            dayLine = new google.maps.Polyline({
                path: daylightLine,
                strokeColor: "#000000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
            });

            // Draw all of our hard work
            dayLine.setMap(map);
            dayPoly.setMap(map);
        },
        init_gmaps = function () {
            loadMessage("Loading Map...");
            var myLatlng = new google.maps.LatLng(30, 0);
            var mapConfig = {
                zoom: 3,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                disableDefaultUI: true,
                scrollwheel: true,
                draggable: true,
                navigationControl: true,
                mapTypeControl: true,
                scaleControl: true,
                disableDoubleClickZoom: true
            };

            map = new google.maps.Map($('worldHeatmap'), mapConfig);
            var coolgreen = [{
                featureType: "water",
                stylers: [{
                    saturation: -50
                }, {
                    lightness: -69
                }, {
                    visibility: "simplified"
                }]
            }, {
                featureType: "landscape",
                stylers: [{
                    hue: "#b2ff00"
                }, {
                    saturation: 54
                }, {
                    lightness: -54
                }]
            }, {
                featureType: "administrative",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi",
                stylers: [{
                    hue: "#b2ff00"
                }, {
                    lightness: -54
                }, {
                    saturation: 54
                }]
            }, {
                featureType: "poi.park",
                stylers: [{
                    hue: "#b2ff00"
                }, {
                    lightness: 8
                }]
            }, {
                featureType: "administrative",
                elementType: "geometry",
                stylers: [{
                    lightness: -55
                }]
            }, {}];
            map.setOptions({
                styles: coolgreen
            });

            update_daylight();

            // Alternative themes:
            // { 0.45: "rgb(216,136,211)", 0.55: "rgb(0,255,255)", 0.65: "rgb(233,59,233)", 0.95: "rgb(255,0,240)", 1.0: "yellow"}
            // { 0.0: "rgb(236,245,14)", 0.15: "rgb(227,192,3)", 1.0: "rgb(221,31,103)"}
            heatmap = new HeatmapOverlay(map, {
                "radius": 25,
                "visible": true,
                "opacity": 90,
                "gradient": {
                    0.45: "rgb(216,136,211)",
                    0.55: "rgb(242,185,36)",
                    0.65: "rgb(235,135,60)",
                    0.95: "rgb(229,91,78)",
                    1.0: "rgb(222,32,104)"
                }
            });
            window.heatmap = heatmap;

            $("worldHeatmap").style.display = "block";

            // this is important, because if you set the data set too early, the latlng/pixel projection doesn't work
            google.maps.event.addListenerOnce(map, "idle", function () {
                fetch_data(240);
            });

        },
        loadMessage = function (msg) {
            loader.innerHTML = msg;
        },
        fetch_data = function (secs_ago) {

            var xmlHttp = null;
            try {
                xmlHttp = new XMLHttpRequest();
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    try {
                        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (e) {
                        xmlHttp = null;
                    }
                }
            }
            if (xmlHttp) {
                xmlHttp.open('GET', '/locate/fetch/' + secs_ago + '/', true);
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == 4) {
                        var evil = {};
                        try {
                            evil = JSON.parse(xmlHttp.responseText);
                        } catch (e) {
                            evil = eval('(' + xmlHttp.responseText + ')');
                        }
                        data = data.concat(evil)
                        heatmap.setDataSet({
                            max: 1,
                            data: []
                        });
                        var MAX_POINTS = 150
                        if (data.length > MAX_POINTS) {
                            data = data.slice(-MAX_POINTS);
                        }
                        for (var i = 0; i < data.length; i++) {
                            heatmap.addDataPoint(data[i][0], data[i][1], data[i][2]);
                        }
                    }
                };
                xmlHttp.send(null);
            }
            loader.style.display = "none";

        };

    return {
        init: function () {
            loader = $('loader');

            init_gmaps();
        },
        fetch: function () {
            fetch_data(5);
        },
        update_light: function () {
            update_daylight();
        }
    };
})();

window.onload = function () {
    app_control.init();
    self.setInterval("app_control.fetch();", 5 * 1000);
    self.setInterval("app_control.update_light();", 5 * 60 * 1000);
}

