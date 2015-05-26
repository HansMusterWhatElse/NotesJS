$(function () {
    $('#datetimepicker').datetimepicker({
        format: 'D-M-YY hh:mm'
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
        myCurrentNote.addAttachement(files);

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
        var formData = $("#note-form").serialize(),
            obj = {
                status: $("button[name='status']").text().replace(/\s/g, ''),
                creationDate: new Date().toLocaleDateString()
            };
        myCurrentNote.serialize(formData, obj);
        $('#createNoteView').hide('slow');
        
        // Prevents the page from reloading and thus another unnecessary initilatisation of app.init()
        e.preventDefault();
    });

    $('#addNote').on('click', function (uid) {
        $('#createNoteView').toggle('slow', function () {
            if ($(this).is(':visible')) {
                myCurrentNote = new Note();
                $("#note-form").find("input[name='guid'][type='hidden']").val(myCurrentNote.currentWorkingObject.uid);
            }
        });
    });

    $(".dropdown-menu").find('a').on("click", function (event) {
        $('.dropdown-toggle').text("Status: " + $(this).text());
    });
});

