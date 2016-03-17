define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'd3',
    'moment',
    'fullcalendar',
    "splunkjs/mvc/searchmanager",
    'contrib/text!app/templates/HomeView.html',
    'app/utils/DataParser'
], function(
    $,
    _,
    Backbone,
    Bootstrap,
    d3,
    moment,
    Fullcalendar,
    SearchManager,
    Template,
    DataParser
) {
    function generateBuckets(start, end){
        var buckets = {};
        while (start.isBefore(end)){
            buckets[start.format("YYYY-MM-DD")] = 0;
            start.add(1, "d");
        }
        return buckets;
    }

    function heatMapColorforValue(value){
      var h = (1.0 - value) * 240;
      return "hsl(" + h + ", 100%, 50%)";
    }

    return Backbone.View.extend({
        template: Template,
        initialize: function(options) {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this._compiledTemplate = _.template(this.template);
            this._options = options;
            this._calendarData = null;
        },
        render: function() {
            this.$el.html(this._compiledTemplate({}));
            this.$(".calendar").fullCalendar({
                viewRender: this.onViewRender.bind(this)
            });
            return this;
        },
        onViewRender: function(view) {
            var viewMoment = view.calendar.getDate();
            this.decorateCalendar(viewMoment.clone().startOf("month"),
                viewMoment.clone().endOf("month"));
        },
        decorateCalendar: function(start, end) {
            var sm = new SearchManager({
                id: _.uniqueId("calendar"),
                search: "* sourcetype=iwork:calendar | fields start, stop, subject, attendees",
                earliest_time: start.toISOString(),
                latest_time: end.toISOString(),
            });
            var results = sm.data('results', {
                count: 0,
                offset: 0
            });
            var buckets = generateBuckets(start, end);
            var that = this;
            results.on("data", function(model, data) {
                var dp = new DataParser(data);
                for (var i = 0; i < dp.length; ++i){
                    var s = moment(dp.getRowField(i, "start"));
                    var d = -s.diff(dp.getRowField(i, "stop"), "minutes");
                    buckets[s.format("YYYY-MM-DD")] += d;
                }
                that.$(".calendar .fc-day").css("background", "none");
                for (var key in buckets){
                    if (buckets.hasOwnProperty(key)){
                        var day = that.$(".calendar .fc-day[data-date='"+key+"']");
                        var ratio = buckets[key] / 8 / 60;
                        if (ratio > 1){
                            ratio = 1;
                        }
                        day.css("background", heatMapColorforValue(ratio));
                    }
                }
            });
        },
    });
});
