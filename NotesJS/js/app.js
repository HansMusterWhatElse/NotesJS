var app = {
    init: function () {
        // Initialise the handlebar template
        var source = $("#note-row-template").html();
        app.template = Handlebars.compile(source);

        // Initialise the note collection
        app.mapLocalStorageWithTable();

        // Initialise the current note
        app.myCurrentNote = new Note();
    },
    
    // Map the local storage and populate the table with the data
    mapLocalStorageWithTable: function ()
    {
        app.noteCollection = new NoteCollection();
        app.noteCollection.init();        
    }

};