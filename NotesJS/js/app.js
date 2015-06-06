// Initialises the application
$(function () {
    app.init();
});

var app = {
    init: function () {
        // Initialise the handlebar template
        app.initTemplates()
        // Create an initial Note object
        app.createNote();
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
        app.myCurrentNote.setDebugging(isDebugging || true);
        return app.myCurrentNote;
    },

    // Loads the specified note to the form
    loadNoteToForm: function (guid) {
        app.createNote();
        app.myCurrentNote.setNoteObj(app.noteCollection.retrieveNoteObjectFromCollection(guid));
        app.myCurrentNote.populateForm();
    },

    // Loads the specified note to the form
    removeNote: function (guid) {
        app.myCurrentNote.clearForm();
        app.noteCollection.deleteNote(guid);
        app.createNote();
    },

    saveForm : function(){
        app.myCurrentNote.serialise();
        app.myCurrentNote.clearForm();
        app.mapLocalStorageWithTable();
    },

    filterTable : function(){
        app.noteCollection.filter();
    },

    initTemplates : function(){
        var noteTemplate = $("#note-row-template").html(),
            outputTemplate = $("#attachement-li-template").html();

        app.noteTemplate = Handlebars.compile(noteTemplate);
        app.outputTemplate = Handlebars.compile(outputTemplate);
    }
};