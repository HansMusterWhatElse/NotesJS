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
    }
};






