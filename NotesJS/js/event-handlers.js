$(function () {
    $('#datetimepicker').datetimepicker({
        //format: 'D-M-YY hh:mm'
    });

    $(".upload-drop-zone").on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).css('border', '2px solid #ccc');
    });
    $(".upload-drop-zone").on('dragleave', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).css('border', '2px dashed #ccc');
    });
    $(".upload-drop-zone").on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    $(".upload-drop-zone").on('drop', function (e) {
        $(this).css('border', '2px dashed #ccc');
        e.preventDefault();
        var files = e.originalEvent.dataTransfer.files;
        // Storing process
        app.myCurrentNote.addAttachement(files);

    });
    $(document).on('dragenter', function (e) {
        // Prevents the default action of the browser to open the file in the window
        e.stopPropagation();
        e.preventDefault();
    });
    $(document).on('dragover', function (e) {
        // Prevents the default action of the browser to open the file in the window
        e.stopPropagation();
        e.preventDefault();
    });
    $(document).on('drop', function (e) {
        // Prevents the default action of the browser to open the file in the window
        e.stopPropagation();
        e.preventDefault();
    });

    // Save form button
    $("button.btn.btn-default[type='submit'").on('click', function (e) {
        // Pass a serialised object and clear the form
        app.saveForm();
        // Prevents the page from reloading and thus another unnecessary initilatisation of app.init()
        e.preventDefault();
        $('#createNoteView').hide('slow');
    });

    $('#addNote').on('click', function () {
        // Create new note object which gets stored in the global app
        app.createNote();
        // Set the creation date to the hidden field => creationdate
        $('#creationdate').val(new Date());
        $('#createNoteView').toggle('slow', function () {
            if ($(this).is(':visible')) {
                // Set the guid to the hidden field
                $("#note-form").find("input[name='guid'][type='hidden']").val(app.myCurrentNote.getNoteObj().guid);
            }
        });
    });

    // Form : Status
    // Updates the button text regarding the status "Pending" or "Closed" and consequently sets a hidden field with the value
    $(".dropdown-menu").find('a').on("click", function (e) {
        var val = $(this).text();
        $('.dropdown-toggle').text("Status: " + val);
        $('#status').val(val);
    });


    // Remove an attachement from the form output
    $('.upload-output').on('click', 'a', function (e) {
        var index = $(this).attr('href');
        $(this).parent().remove()
        e.preventDefault();
        app.myCurrentNote.removeAttachement(Number(index));
    });

    // Event handler for the edit / delete action from the table
    $('.note-table-body').on('click', 'a', function (e) {
        var guid = $(this).parent().siblings('.note-guid').text(),
            iconClass = $(this).children().attr('class')

        if (/-pencil$/g.test(iconClass)) {
            app.loadNoteToForm(guid);
            $('#createNoteView').toggle('slow');
        } else if (/-trash$/g.test(iconClass)) {
            app.removeNote(guid);
            $(this).closest('tr').remove();
            if ($('#createNoteView').is(':visible')) {
                $('#createNoteView').toggle('slow');
            }
        }
        e.preventDefault();
    });

    // Event handler for the sorting actions
    $('.note-table-header').on('click', 'a', function (e) {
        app.filterTable();
    });
});

