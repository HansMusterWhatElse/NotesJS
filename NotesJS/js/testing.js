// Test retrieving serialized data from local storage and subsequently populate the note form
function loadNoteToForm(uid) {
    myCurrentNote = new Note();

    if (!helperFn.isEmpty(uid)) {
        myCurrentNote.currentWorkingObject = myCurrentNote.deserialize(uid);
        myCurrentNote.populateForm();
    }

    $('#createNoteView').show('slow');
};

loadNoteToForm("3dd17764-1b37-40b0-83db-e9cf71231fc2");