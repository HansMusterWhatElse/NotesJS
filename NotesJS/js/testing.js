// Test retrieving serialized data from local storage and subsequently populate the note form
var testingObj = {
    loadNoteToForm: function (uid) {

        // Create a new note
        app.createNote();

        if (!helperFn.isEmpty(uid)) {
            // Retrieve guid
            var lastGuid = testingObj.retrieveGuid();
            // Use the key passed as parameter, if its empty, use the one from the last serialisation
            app.myCurrentNote.currentWorkingObject = app.myCurrentNote.deserialize(uid || lastGuid);
            // Log the guid the console
            Console.log("Deserialisation was done with the following key:" + (uid || lastGuid));
            // Populate the form with the deserilised data
            app.myCurrentNote.populateForm();
        }

        $('#createNoteView').show('slow');
    },

    // Stores the last serialised guid from the local storage
    storeGuid: function (uid) {
        return !!localStorage.setItem("NoteDebuggingGuid", uid);
    },

    // Retrieves the last serialised guid from the local storage
    retrieveGuid: function() {
        return localStorage.getItem("NoteDebuggingGuid");
    }
};


testingObj.loadNoteToForm();