var NoteCollection = NoteCollection || (function (window, document, undefined) {
    function NoteCollectionFn() {
        var _noteObjectCollection = [];

        this.init = function () {
            this.mapLocalStorage();
            this.populateTable();
        };

        // Getter + Setter
        this.getCol = function () {
            return _noteObjectCollection;
        }
        this.setCol = function (value) {
            _noteObjectCollection = value;
        }

        // Retrieves all the data from the local storage which use a guid as key
        this.mapLocalStorage = function () {
            for (var i = 0, len = localStorage.length; i < len; i++) {
                var key = localStorage.key(i);
                if (key.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g)) {
                    var note = new Note();
                    note = note.deserialise(key);
                    if (note) {
                        _noteObjectCollection.push(note);
                    }
                }
            }
        };

        this.retrieveNoteObjectFromCollection = function (guid) {
            for (var i = 0; i < _noteObjectCollection.length; i++) {
                if (_noteObjectCollection[i].guid === guid) {
                    return _noteObjectCollection[i];
                }
            }

            console.log("Could find a note object with the guid: " + guid);
            return new Note();
        };

        this.deleteNote = function (guid) {
            // Delete from collection
            for (var i = 0; i < _noteObjectCollection.length; i++) {
                if (_noteObjectCollection[i].guid === guid) {
                    _noteObjectCollection.splice(i, 1);
                }
            }
            // Delete from local storage
            localStorage.removeItem(guid);
        }

        // Populates the table with the notes from the local storage => passes the deserialised object to the handlebar framework
        this.populateTable = function () {
            var html = app.noteTemplate(_noteObjectCollection);
            $('.note-table-body').html(html);
        };

        // Sorting functiom
        this.filter = function (search, isAsc, limit, sort) {

            var tempRes = [];
            var reg = new RegExp(search, 'g');

            // Search (Search)
            if (search) {
                for (var i = 0; i < _noteObjectCollection.length; i++) {
                    var formData = _noteObjectCollection[i].formDataObj;
                    if (formData) {
                        for (key in formData) {
                            var d = formData[key].match(reg);
                            if (formData[key].match(reg)) {
                                tempRes.push(_noteObjectCollection[i]);
                            }
                        }
                    }
                }
            }

            // Sorting (IsAsc, Sort) 
            if (sort && tempRes.length > 0) {
                tempRes.sort(function (a, b) {
                    var sortProp = sort ? sort : "Status";
                    var propA = a.formDataObj[sortProp];
                    var propB = b.formDataObj[sortProp];

                    if (isAsc) {
                        if (propA < propB)
                            return -1;
                        if (propA > propB)
                            return 1;
                        return 0;
                    } else {
                        if (propA > propB)
                            return -1;
                        if (propA < propB)
                            return 1;
                        return 0;
                    }
                });
            }

            // Set the sorted & filtered array => deletes the other entries!
            _noteObjectCollection = tempRes;
            this.populateTable();

        };
    };

    return NoteCollectionFn;
})()

