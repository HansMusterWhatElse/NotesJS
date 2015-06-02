var helperFn = {

    // Create a 128 bit guid 
    createGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // Check for undefined & empty
    isEmpty: function (str) {
        return (!str || !str.length);
    },

    // Split the query string
    splitQueryString: function (source) {
        try {
            var keys = {};
            source.replace(
                /([^=&]+)=([^&]*)/g,
                function (full, key, value) {
                    keys[key] = value;
                    return "";
                });
            return keys;
        } catch (e) {
            console.log("Splitting the query string failed: " + e);
        }
    },

    // Decode URI component
    decodeString: function (str) {
        return decodeURIComponent(str).replace("+", " ");
    },

    parseDateObj: function (dateObj) {
        try {
            var timeStamp = Date.parse(dateObj);
            return isNaN(timeStamp) === false ? new Date(dateObj) : '';
        } catch (e) {
            console.log("The handlebars helper function 'formatDate' couldn't parse: " + dateObj);
        }
    },

    // Creates a moment  from a date object and as result formats it according to the formatString
    createAndFormatMomentObj: function (date, formatString) {
        var momDate = moment(date);
        if (momDate) {
            return helperFn.formatMomentObj(momDate, formatString)
        } else {
            console.log("The helper function 'createAndFormatMomentObj' couldn't convert: " + date)
        }
    },
    formatMomentObj: function (obj, format) {
        var res;
        res = obj.format(format);
        return res ? res : '';
    },
};

Object.length = function (obj) {
    var length = 0,
        key;
    for (key in obj) {
        obj.hasOwnProperty(key) && size++; // ignore native properties
    }
    return length;
};


// Global jQuery functions
(function ($) {
    $.fn.tagName = function () {
        return this.prop("tagName").toLowerCase();
    };

    // Adds a customised funtion to jQuery which is charge of generating a (key, value) pair object
    $.fn.serialiseObject = function () {
        var obj = {};
        var serialisationFn = this.serializeArray();
        $.each(serialisationFn, function () {
            if (obj[this.name] !== undefined) {
                if (!obj[this.name].push) {
                    obj[this.name] = [obj[this.name]];
                }
                obj[this.name].push(this.value || "");
            } else {
                obj[this.name] = this.value || "";
            }
        });
        return obj
    };
}(jQuery));

// Global handlebars helper functions
(function (handlebars) {
    handlebars.registerHelper('formatDate', function (prop, obj) {
        var date = helperFn.parseDateObj(obj.formDataObj[prop]);
        if (date === '') {
            return ''
        } else {
            var momDateObj = moment(date);
            if (prop === "creationdate") {
                return momDateObj.format('LL');
            } else if (prop == 'duedate') {
                var ms = moment(date).diff((new Date)),
                    duration = moment.duration(ms),
                    dayDiff = Math.floor(duration.days()),
                    $elem = $('<strong>').text(momDateObj.format('MMM D, YYYY'));

                if (dayDiff < 2) {
                    return $elem.addClass(prop + '-red')[0].outerHTML;
                } else if (dayDiff < 7) {
                    return $elem.addClass(prop + '-orange')[0].outerHTML;
                }
                else {
                    return $elem.addClass(prop + '-green')[0].outerHTML;
                }
            }
        }
    })
}(Handlebars));

