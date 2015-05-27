// Initialises the application
$(function () {
    app.init();
});

var app = {
    init: function () {

        // Initialise the handlebar template
        var source = $("#note-row-template").html();
        app.template = Handlebars.compile(source);

        // Initialise the note collection from the local storage
        app.mapLocalStorageWithTable();
    },
    
    // Map the local storage and populate the table with the data
    mapLocalStorageWithTable: function()
    {
        app.noteCollection = new NoteCollection();
        app.noteCollection.init();        
    },

    // Initialise a new node object
    createNote : function(isDebugging) {
        app.myCurrentNote = new Note();
        app.myCurrentNote.debugging = isDebugging || true;
        return app.myCurrentNote;
    }   
};

// Define a global jQuery function
jQuery.fn.tagName = function () {
    return this.prop("tagName").toLowerCase();;
};

// Adds a customised funtion to jQuery which is charge of generating a (key, value) pair object
$.fn.serialiseObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || "");
        } else {
            o[this.name] = this.value || "";
        }
    });
    return o;
};