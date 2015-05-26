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
    mapLocalStorageWithTable: function ()
    {
        app.noteCollection = new NoteCollection();
        app.noteCollection.init();        
    },

    // Initialise a new node object
    createNote : function(isDebugging) {
        app.myCurrentNote = new Note();
        app.myCurrentNote.debugging = isDebugging || false;
        return app.myCurrentNote;
    }
    
};

// Define a global jQuery function
jQuery.fn.tagName = function () {
    return this.prop("tagName").toLowerCase();;
};