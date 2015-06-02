// Test retrieving serialised data from local storage and subsequently populate the note form
var testingObj = {
    loadNoteToForm: function (guid) {
        // Create a new note
        app.createNote();
        // Retrieve guid
        var lastGuid = testingObj.retrieveGuid();

        if (!helperFn.isEmpty(guid) && !helperFn.isEmpty(lastGuid)) {
            // Use the key passed as parameter to the testing function, if its empty, use the one from the last serialisation
            app.myCurrentNote.noteObj = app.myCurrentNote.deserialise(guid || lastGuid);
            // Log the guid the console
            console.log('Deserialisation was done with the following key:' + (guid || lastGuid));
            // Populate the form with the deserilised data
            app.myCurrentNote.populateForm();

            $('#createNoteView').show('slow');
        }
    },

    // Stores the last serialised guid from the local storage
    storeGuid: function (guid) {
        return !!localStorage.setItem("NoteDebuggingGuid", guid);
    },

    // Retrieves the last serialised guid from the local storage
    retrieveGuid: function() {
        return localStorage.getItem("NoteDebuggingGuid");
    }
};


//testingObj.loadNoteToForm("21b70263-ccd7-492f-b70f-1b4291e89c40");