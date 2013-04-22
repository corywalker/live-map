// Sunlight overlay controller.
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

getDaylight = function () {
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
    //var daylightPoly = [] // For the shading polygon of darkness and monsters
    var daylightLine = [] // Line that marks sunrise/sunset. How romantic
    var lastLon = 0
    for (var i = 0; i < n_vectors.length; i++) {
        // Convert n-vector to latlon. See http://en.wikipedia.org/wiki/N-vector#Converting_n-vector_to_latitude.2Flongitude
        var lat = Math.asin(n_vectors[i][2]) * 180 / Math.PI
        var lon = Math.atan2(n_vectors[i][1], n_vectors[i][0]) * 180 / Math.PI
        // So Google Maps can fill in the polygon
        /*if (i == 0) {
            if (tilt > 0) {
                daylightPoly.push(new google.maps.LatLng(-90, lon));
            } else {
                daylightPoly.push(new google.maps.LatLng(90, lon));
            }
        }*/
        //daylightPoly.push(new google.maps.LatLng(lat, lon));
        //daylightLine.push(new google.maps.LatLng(lat, lon));
        daylightLine.push([lat, lon]);
        // So Google Maps can fill in the polygon
        /*if (i == n_vectors.length - 1) {
            if (tilt > 0) {
                daylightPoly.push(new google.maps.LatLng(-90, lon));
            } else {
                daylightPoly.push(new google.maps.LatLng(90, lon));
            }
            lastLon = lon;
        }*/
    }
    // So Google Maps can fill in the polygon
    /*if (tilt < 0) {
        daylightPoly.push(new google.maps.LatLng(90, lastLon - 120));
        daylightPoly.push(new google.maps.LatLng(90, lastLon - 240));
    } else {
        daylightPoly.push(new google.maps.LatLng(-90, lastLon + 120));
        daylightPoly.push(new google.maps.LatLng(-90, lastLon + 240));
    }*/

   return daylightLine;
}
