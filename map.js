var d3;
d3 || (d3 = {});
(function () {
    function h(a, b) {
        return function (c) {
            return c && c.type in a ? a[c.type](c) : b
        }
    }
    function p(a) {
        return "m0," + a + "a" + a + "," + a + " 0 1,1 0," + -2 * a + "a" + a + "," + a + " 0 1,1 0," + 2 * a + "z"
    }
    function r(a, b) {
        a.type in x && x[a.type](a, b)
    }
    function s(a, b) {
        for (var c = a.coordinates, f = 0, e = c.length; f < e; f++) b.apply(null, c[f])
    }
    function t(a) {
        return a.source
    }
    function z(a) {
        return a.target
    }
    function u(a, b) {
        function c(a) {
            var n = Math.sin(v - (a *= v)) / h,
                b = Math.sin(a) / h;
            a = n * k * e + b * w * q;
            var f = n * k * j + b * w * m,
                n = n * d + b * y;
            return [Math.atan2(f, a) / l, Math.atan2(n,
                Math.sqrt(a * a + f * f)) / l]
        }
        var f = a[0] * l,
            e = Math.cos(f),
            j = Math.sin(f),
            g = a[1] * l,
            k = Math.cos(g),
            d = Math.sin(g),
            g = b[0] * l,
            q = Math.cos(g),
            m = Math.sin(g),
            n = b[1] * l,
            w = Math.cos(n),
            y = Math.sin(n),
            v = c.d = Math.acos(Math.max(-1, Math.min(1, d * y + k * w * Math.cos(g - f)))),
            h = Math.sin(v);
        return c
    }
    d3.geo = {};
    var l = Math.PI / 180;
    d3.geo.azimuthal = function () {
        function a(a) {
            var m = a[0] * l - j,
                n = a[1] * l;
            a = Math.cos(m);
            var m = Math.sin(m),
                c = Math.cos(n),
                n = Math.sin(n),
                g = "orthographic" !== b ? d * n + k * c * a : null,
                h, g = "stereographic" === b ? 1 / (1 + g) : "gnomonic" === b ? 1 /
                    g : "equidistant" === b ? (h = Math.acos(g), h ? h / Math.sin(h) : 0) : "equalarea" === b ? Math.sqrt(2 / (1 + g)) : 1;
            return [f * g * c * m + e[0], f * g * (d * c * a - k * n) + e[1]]
        }
        var b = "orthographic",
            c, f = 200,
            e = [480, 250],
            j, g, k, d;
        return a.invert = function (a) {
            var m = (a[0] - e[0]) / f;
            a = (a[1] - e[1]) / f;
            var n = Math.sqrt(m * m + a * a),
                c = "stereographic" === b ? 2 * Math.atan(n) : "gnomonic" === b ? Math.atan(n) : "equidistant" === b ? n : "equalarea" === b ? 2 * Math.asin(0.5 * n) : Math.asin(n),
                g = Math.sin(c),
                c = Math.cos(c);
            return [(j + Math.atan2(m * g, n * k * c + a * d * g)) / l, Math.asin(c * d - (n ? a * g * k / n : 0)) /
                l]
        }, a.mode = function (d) {
            return arguments.length ? (b = d + "", a) : b
        }, a.origin = function (b) {
            return arguments.length ? (c = b, j = c[0] * l, g = c[1] * l, k = Math.cos(g), d = Math.sin(g), a) : c
        }, a.scale = function (d) {
            return arguments.length ? (f = +d, a) : f
        }, a.translate = function (d) {
            return arguments.length ? (e = [+d[0], +d[1]], a) : e
        }, a.origin([0, 0])
    };
    d3.geo.albers = function () {
        function a(m) {
            var a = k * (l * m[0] - g);
            m = Math.sqrt(d - 2 * k * Math.sin(l * m[1])) / k;
            return [e * m * Math.sin(a) + j[0], e * (m * Math.cos(a) - q) + j[1]]
        }
        function b() {
            var m = l * f[0],
                n = l * f[1],
                b = l * c[1],
                e = Math.sin(m),
                m = Math.cos(m);
            return g = l * c[0], k = 0.5 * (e + Math.sin(n)), d = m * m + 2 * k * e, q = Math.sqrt(d - 2 * k * Math.sin(b)) / k, a
        }
        var c = [-98, 38],
            f = [29.5, 45.5],
            e = 1E3,
            j = [480, 250],
            g, k, d, q;
        return a.invert = function (m) {
            var a = (m[0] - j[0]) / e,
                b = q + (m[1] - j[1]) / e;
            m = Math.atan2(a, b);
            a = Math.sqrt(a * a + b * b);
            return [(g + m / k) / l, Math.asin((d - a * a * k * k) / (2 * k)) / l]
        }, a.origin = function (a) {
            return arguments.length ? (c = [+a[0], +a[1]], b()) : c
        }, a.parallels = function (a) {
            return arguments.length ? (f = [+a[0], +a[1]], b()) : f
        }, a.scale = function (m) {
            return arguments.length ?
                (e = +m, a) : e
        }, a.translate = function (m) {
            return arguments.length ? (j = [+m[0], +m[1]], a) : j
        }, b()
    };
    d3.geo.albersUsa = function () {
        function a(a) {
            var g = a[0],
                k = a[1];
            return (50 < k ? c : -140 > g ? f : 21 > k ? e : b)(a)
        }
        var b = d3.geo.albers(),
            c = d3.geo.albers().origin([-160, 60]).parallels([55, 65]),
            f = d3.geo.albers().origin([-160, 20]).parallels([8, 18]),
            e = d3.geo.albers().origin([-60, 10]).parallels([8, 18]);
        return a.scale = function (j) {
            return arguments.length ? (b.scale(j), c.scale(0.6 * j), f.scale(j), e.scale(1.5 * j), a.translate(b.translate())) : b.scale()
        },
        a.translate = function (j) {
            if (!arguments.length) return b.translate();
            var g = b.scale() / 1E3,
                k = j[0],
                d = j[1];
            return b.translate(j), c.translate([k - 400 * g, d + 170 * g]), f.translate([k - 190 * g, d + 200 * g]), e.translate([k + 580 * g, d + 430 * g]), a
        }, a.scale(b.scale())
    };
    d3.geo.bonne = function () {
        function a(a) {
            var d = a[0] * l - f,
                q = a[1] * l - e;
            j ? (a = g + j - q, q = d * Math.cos(q) / a, d = a * Math.sin(q), q = a * Math.cos(q) - g) : (d *= Math.cos(q), q *= -1);
            return [b * d + c[0], b * q + c[1]]
        }
        var b = 200,
            c = [480, 250],
            f, e, j, g;
        return a.invert = function (a) {
            var d = (a[0] - c[0]) / b;
            a = (a[1] -
                c[1]) / b;
            if (j) {
                var e = g + a,
                    m = Math.sqrt(d * d + e * e);
                a = g + j - m;
                d = f + m * Math.atan2(d, e) / Math.cos(a)
            } else a *= -1, d /= Math.cos(a);
            return [d / l, a / l]
        }, a.parallel = function (b) {
            return arguments.length ? (g = 1 / Math.tan(j = b * l), a) : j / l
        }, a.origin = function (b) {
            return arguments.length ? (f = b[0] * l, e = b[1] * l, a) : [f / l, e / l]
        }, a.scale = function (f) {
            return arguments.length ? (b = +f, a) : b
        }, a.translate = function (b) {
            return arguments.length ? (c = [+b[0], +b[1]], a) : c
        }, a.origin([0, 0]).parallel(45)
    };
    d3.geo.equirectangular = function () {
        function a(a) {
            return [b * (a[0] /
                360) + c[0], b * (-a[1] / 360) + c[1]]
        }
        var b = 500,
            c = [480, 250];
        return a.invert = function (a) {
            return [360 * ((a[0] - c[0]) / b), -360 * ((a[1] - c[1]) / b)]
        }, a.scale = function (c) {
            return arguments.length ? (b = +c, a) : b
        }, a.translate = function (b) {
            return arguments.length ? (c = [+b[0], +b[1]], a) : c
        }, a
    };
    d3.geo.mercator = function () {
        function a(a) {
            var e = a[0] / 360;
            a = -(Math.log(Math.tan(Math.PI / 4 + a[1] * l / 2)) / l) / 360;
            return [b * e + c[0], b * Math.max(-0.5, Math.min(0.5, a)) + c[1]]
        }
        var b = 500,
            c = [480, 250];
        return a.invert = function (a) {
            return [360 * ((a[0] - c[0]) / b), 2 * Math.atan(Math.exp(-360 *
                ((a[1] - c[1]) / b) * l)) / l - 90]
        }, a.scale = function (c) {
            return arguments.length ? (b = +c, a) : b
        }, a.translate = function (b) {
            return arguments.length ? (c = [+b[0], +b[1]], a) : c
        }, a
    };
    d3.geo.path = function () {
        function a(a, b) {
            return "function" == typeof e && (j = p(e.apply(this, arguments))), k(a) || null
        }
        function b(a) {
            return g(a).join(",")
        }
        function c(a) {
            for (var b = Math.abs(d3.geom.polygon(a[0].map(g)).area()), d = 0, c = a.length; ++d < c;) b -= Math.abs(d3.geom.polygon(a[d].map(g)).area());
            return b
        }
        function f(a) {
            for (var b = d3.geom.polygon(a[0].map(g)),
                    d = b.area(), b = b.centroid(0 > d ? (d *= -1, 1) : -1), c = b[0], e = b[1], f = d, j = 0, q = a.length; ++j < q;) b = d3.geom.polygon(a[j].map(g)), d = b.area(), b = b.centroid(0 > d ? (d *= -1, 1) : -1), c -= b[0], e -= b[1], f -= d;
            return [c, e, 6 * f]
        }
        var e = 4.5,
            j = p(e),
            g = d3.geo.albersUsa(),
            k = h({
                FeatureCollection: function (a) {
                    var b = [];
                    a = a.features;
                    for (var d = -1, c = a.length; ++d < c;) b.push(k(a[d].geometry));
                    return b.join("")
                },
                Feature: function (a) {
                    return k(a.geometry)
                },
                Point: function (a) {
                    return "M" + b(a.coordinates) + j
                },
                MultiPoint: function (a) {
                    var d = [];
                    a = a.coordinates;
                    for (var c = -1, e = a.length; ++c < e;) d.push("M", b(a[c]), j);
                    return d.join("")
                },
                LineString: function (a) {
                    var d = ["M"];
                    a = a.coordinates;
                    for (var c = -1, e = a.length; ++c < e;) d.push(b(a[c]), "L");
                    return d.pop(), d.join("")
                },
                MultiLineString: function (a) {
                    var d = [];
                    a = a.coordinates;
                    for (var c = -1, e = a.length, f, g, j; ++c < e;) {
                        f = a[c];
                        g = -1;
                        j = f.length;
                        for (d.push("M"); ++g < j;) d.push(b(f[g]), "L");
                        d.pop()
                    }
                    return d.join("")
                },
                Polygon: function (a) {
                    var d = [];
                    a = a.coordinates;
                    for (var c = -1, e = a.length, f, g, j; ++c < e;) if (f = a[c], g = -1, 0 < (j = f.length - 1)) {
                            for (d.push("M"); ++g <
                                j;) d.push(b(f[g]), "L");
                            d[d.length - 1] = "Z"
                        }
                    return d.join("")
                },
                MultiPolygon: function (a) {
                    var d = [];
                    a = a.coordinates;
                    for (var c = -1, e = a.length, f, g, j, q, h, k; ++c < e;) {
                        f = a[c];
                        g = -1;
                        for (j = f.length; ++g < j;) if (q = f[g], h = -1, 0 < (k = q.length - 1)) {
                                for (d.push("M"); ++h < k;) d.push(b(q[h]), "L");
                                d[d.length - 1] = "Z"
                            }
                    }
                    return d.join("")
                },
                GeometryCollection: function (a) {
                    var d = [];
                    a = a.geometries;
                    for (var b = -1, c = a.length; ++b < c;) d.push(k(a[b]));
                    return d.join("")
                }
            }),
            d = a.area = h({
                FeatureCollection: function (a) {
                    var b = 0;
                    a = a.features;
                    for (var c = -1,
                            e = a.length; ++c < e;) b += d(a[c]);
                    return b
                },
                Feature: function (a) {
                    return d(a.geometry)
                },
                Polygon: function (a) {
                    return c(a.coordinates)
                },
                MultiPolygon: function (a) {
                    var d = 0;
                    a = a.coordinates;
                    for (var b = -1, e = a.length; ++b < e;) d += c(a[b]);
                    return d
                },
                GeometryCollection: function (a) {
                    var b = 0;
                    a = a.geometries;
                    for (var c = -1, e = a.length; ++c < e;) b += d(a[c]);
                    return b
                }
            }, 0),
            q = a.centroid = h({
                Feature: function (a) {
                    return q(a.geometry)
                },
                Polygon: function (a) {
                    a = f(a.coordinates);
                    return [a[0] / a[2], a[1] / a[2]]
                },
                MultiPolygon: function (a) {
                    a = a.coordinates;
                    for (var d, b = 0, c = 0, e = 0, g = -1, j = a.length; ++g < j;) d = f(a[g]), b += d[0], c += d[1], e += d[2];
                    return [b / e, c / e]
                }
            });
        return a.projection = function (d) {
            return g = d, a
        }, a.pointRadius = function (d) {
            return "function" == typeof d ? e = d : (e = +d, j = p(e)), a
        }, a
    };
    d3.geo.bounds = function (a) {
        var b = Infinity,
            c = Infinity,
            f = -Infinity,
            e = -Infinity;
        return r(a, function (a, g) {
            a < b && (b = a);
            a > f && (f = a);
            g < c && (c = g);
            g > e && (e = g)
        }), [
            [b, c],
            [f, e]
        ]
    };
    var x = {
        Feature: function (a, b) {
            r(a.geometry, b)
        },
        FeatureCollection: function (a, b) {
            for (var c = a.features, f = 0, e = c.length; f < e; f++) r(c[f].geometry,
                    b)
        },
        GeometryCollection: function (a, b) {
            for (var c = a.geometries, f = 0, e = c.length; f < e; f++) r(c[f], b)
        },
        LineString: s,
        MultiLineString: function (a, b) {
            for (var c = a.coordinates, f = 0, e = c.length; f < e; f++) for (var j = c[f], g = 0, h = j.length; g < h; g++) b.apply(null, j[g])
        },
        MultiPoint: s,
        MultiPolygon: function (a, b) {
            for (var c = a.coordinates, f = 0, e = c.length; f < e; f++) for (var j = c[f][0], g = 0, h = j.length; g < h; g++) b.apply(null, j[g])
        },
        Point: function (a, b) {
            b.apply(null, a.coordinates)
        },
        Polygon: function (a, b) {
            for (var c = a.coordinates[0], f = 0, e = c.length; f <
                e; f++) b.apply(null, c[f])
        }
    };
    d3.geo.circle = function () {
        function a() {}
        function b(a) {
            return g.distance(a) < j
        }
        function c(a) {
            for (var b = -1, c = a.length, e = [], f, h, k, l, p; ++b < c;) p = g.distance(k = a[b]), p < j ? (h && e.push(u(h, k)((l - j) / (l - p))), e.push(k), f = h = null) : (h = k, !f && e.length && (e.push(u(e[e.length - 1], h)((j - l) / (p - l))), f = h)), l = p;
            h && e.length && (p = g.distance(k = e[0]), e.push(u(h, k)((l - j) / (l - p))));
            a = 0;
            h = (b = e.length) ? [e[0]] : e;
            for (l = g.source(); ++a < b;) {
                k = g.source(e[a - 1])(e[a]).coordinates;
                c = 0;
                for (f = k.length; ++c < f;) h.push(k[c])
            }
            return g.source(l),
            h
        }
        var f = [0, 0],
            e = 89.99,
            j = e * l,
            g = d3.geo.greatArc().target(Object);
        a.clip = function (a) {
            return g.source("function" == typeof f ? f.apply(this, arguments) : f), k(a)
        };
        var k = h({
            FeatureCollection: function (a) {
                var b = a.features.map(k).filter(Object);
                return b && (a = Object.create(a), a.features = b, a)
            },
            Feature: function (a) {
                var b = k(a.geometry);
                return b && (a = Object.create(a), a.geometry = b, a)
            },
            Point: function (a) {
                return b(a.coordinates) && a
            },
            MultiPoint: function (a) {
                var c = a.coordinates.filter(b);
                return c.length && {
                    type: a.type,
                    coordinates: c
                }
            },
            LineString: function (a) {
                var b = c(a.coordinates);
                return b.length && (a = Object.create(a), a.coordinates = b, a)
            },
            MultiLineString: function (a) {
                var b = a.coordinates.map(c).filter(function (a) {
                    return a.length
                });
                return b.length && (a = Object.create(a), a.coordinates = b, a)
            },
            Polygon: function (a) {
                var b = a.coordinates.map(c);
                return b[0].length && (a = Object.create(a), a.coordinates = b, a)
            },
            MultiPolygon: function (a) {
                var b = a.coordinates.map(function (a) {
                    return a.map(c)
                }).filter(function (a) {
                    return a[0].length
                });
                return b.length && (a = Object.create(a),
                    a.coordinates = b, a)
            },
            GeometryCollection: function (a) {
                var b = a.geometries.map(k).filter(Object);
                return b.length && (a = Object.create(a), a.geometries = b, a)
            }
        });
        return a.origin = function (b) {
            return arguments.length ? (f = b, a) : f
        }, a.angle = function (b) {
            return arguments.length ? (j = (e = +b) * l, a) : e
        }, a.precision = function (b) {
            return arguments.length ? (g.precision(b), a) : g.precision()
        }, a
    };
    d3.geo.greatArc = function () {
        function a() {
            for (var a = "function" == typeof b ? b.apply(this, arguments) : b, h = "function" == typeof c ? c.apply(this, arguments) :
                    c, g = u(a, h), k = f / g.d, d = 0, a = [a]; 1 > (d += k);) a.push(g(d));
            return a.push(h), {
                type: "LineString",
                coordinates: a
            }
        }
        var b = t,
            c = z,
            f = 6 * l;
        return a.distance = function () {
            var a = "function" == typeof b ? b.apply(this, arguments) : b,
                f = "function" == typeof c ? c.apply(this, arguments) : c;
            return u(a, f).d
        }, a.source = function (c) {
            return arguments.length ? (b = c, a) : b
        }, a.target = function (b) {
            return arguments.length ? (c = b, a) : c
        }, a.precision = function (b) {
            return arguments.length ? (f = b * l, a) : f / l
        }, a
    };
    d3.geo.greatCircle = d3.geo.circle
})();
var HomepageMap = {
    options: {
        plotInterval: 250,
        highlightInterval: 2E3,
        modeRemovalTime: 15E3
    },
    nowShowing: null,
    highlightLoop: 0,
    initialize: function () {
        var scale = 1050,
            point = [630, 260];
        $("body").hasClass("standalone") && (scale = 1920, point = [900, 470]);
        this.projection = d3.geo.mercator().scale(scale).translate(point);
        $("body").hasClass("standalone") && d3.json("/j/carbon-world.json", function (data) {
            d3.select("svg.world").selectAll("path").data(data.features).enter().append("path").attr("d", d3.geo.path().projection(d3.geo.mercator().scale(scale).translate(point)))
        });
        this.options.world_mode = true;
        this.refreshData();
        var hover = $("body").hasClass("mobile") ? "touchstart" : "mouseenter",
            leavehover = $("body").hasClass("mobile") ? "touchend" : "mouseleave",
            t = this;
        $("#map-sessions").on(hover, ".blip", function () {
            this.unhighlight();
            this.stopHighlighting();
            $(this).addClass("retain");
            $(this).parents(".session").addClass("touching")
        }).on(leavehover, ".blip", function () {
            this.startHighlighting(600);
            $(this).removeClass("retain");
            $(this).parents(".session").removeClass("touching")
        })
    },
    refreshData: function () {
        $.ajax({
            url: "http://quizlet.com/homepage/map-activity/",
            dataType: "jsonp",
            type: "GET",
            data: {
                last_id: this.lastId
            },
            success: function (data) {
                this.items = data.items;
                this.totalItems = this.items.length;
                this.plotLoop = setInterval(
                    this.plotNextItem.bind(this),
                    this.options.plotInterval
                );
                this.startHighlighting(4 * this.options.plotInterval)
            }.bind(this)
        })
    },
    startHighlighting: function (timeout) {
        this.highlightLoop = setTimeout(function () {
            this.highlightRandomSession();
            this.highlightLoop = setInterval(
                this.highlightRandomSession.bind(this),
                this.options.highlightInterval)
        }.bind(this), timeout)
    },
    stopHighlighting: function () {
        clearInterval(this.highlightLoop);
        clearTimeout(this.highlightLoop)
    },
    highlightRandomSession: function () {
        if (!this.paused) {
            this.unhighlight();
            var eligSessions = $("#map-sessions .session").not(".showing").not(".remove");
            this.nowShowing = $(eligSessions.toArray().getRandom()).addClass("showing")
        }
    },
    unhighlight: function () {
        null !== this.nowShowing && this.nowShowing.removeClass("showing")
    },
    plotNextItem: function () {
        if (!this.paused) {
            var next = this.items.shift();
            var uneligible = 0 == next.longitude && 0 == next.latitude || !next.location;
            if (uneligible)
                this.plotNextItem();
            else
                (this.plotActivity(next), this.items.push(next));
        }
    },
    plotActivity: function (act) {
        var projected =
            this.projection([act.longitude, act.latitude]),
            toSub = {
                setname: act.set,
                location: act.location
            };
        if (500 < projected[0])
            toSub.extraClasses = "flipped";
        var rendered = $($.trim(this.sessionHtml).substitute(toSub)).css({
            left: Math.round(projected[0] + 2 * (Math.random() - 0.5) - 2),
            top: Math.round(projected[1] + 2 * (Math.random() - 0.5) - 2)
        });
        rendered.appendTo("#map-sessions");
        rendered.data("item", act);
        setTimeout(function () {
            rendered.children(".blip").removeClass("new")
        }, 10);
        var tryToRemove = function (blip) {
            var dontWait = !blip.hasClass("retain") && !blip.parent(".session").hasClass("showing")
            if (dontWait) {
                blip.addClass("remove");
                setTimeout(function () {
                    blip.parents(".session").remove()
                }.bind(blip), 1700);
            } else {
                setTimeout(function () {tryToRemove(blip)}, 4000)
            }
        };
        setTimeout(function () {
            var blip = rendered.children(".blip");
            tryToRemove(blip)
        }, this.options.modeRemovalTime)
    },
    pause: function () {
        this.paused = true
    },
    unpause: function () {
        this.paused = false
    },
    sessionHtml: '\t\t<div class="session {extraClasses}">\t\t\t<div class="new blip"></div>\t\t\t<div class="label">\t\t\t\t<div class="setname">{setname}</div>\t\t\t\t<div class="location">{location}</div>\t\t\t\t<span class="arrow"></span>\t\t\t</div>\t\t</div>\t'
};

QWait("dom", function () {
    QLoad("homepage_map")
});

QWait("dom", function () {
    QLoad("homepage")
});
