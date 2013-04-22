var HomepageMap = {
    options: {
        plotInterval: 250,
        highlightInterval: 2000,
        modeRemovalTime: 15000
    },
    nowShowing: null,
    highlightLoop: 0,
    initialize: function () {
        var width = 960,
            height = 960;

        this.projection = d3.geo.mercator()
            .scale((width + 1) / 2 / Math.PI)
            .translate([width / 2, height / 2])
            .precision(.1);

        var path = d3.geo.path()
            .projection(this.projection);

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("world-50m.json", function(error, world) {
          svg.insert("path")
              .datum(topojson.object(world, world.objects.land))
              .attr("class", "land")
              .attr("d", path);

          svg.insert("path")
              .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
              .attr("class", "boundary")
              .attr("d", path);
        });

        d3.select(self.frameElement).style("height", height + "px");

        this.options.world_mode = true;
        this.refreshData();
        var hover = $("body").hasClass("mobile") ? "touchstart" : "mouseenter",
            leavehover = $("body").hasClass("mobile") ? "touchend" : "mouseleave";
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
    substitute: function (string, data, optRegex) {
        return string.replace(optRegex || /\\?\{([^{}]+)\}/g, function (b, key) {
            return "\\" == b.charAt(0) ?
                b.slice(1) : null != data[key] ? data[key] : ""
        })
    },
    getRandom: function (arr) {
        if (arr.length)
            return arr[Math.floor(Math.random()*arr.length)];
        else
            return null;
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
            this.nowShowing = $(this.getRandom(eligSessions.toArray())).addClass("showing")
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
        var rendered = $(this.substitute($.trim(this.sessionHtml), toSub));
        rendered  = rendered.css({
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
