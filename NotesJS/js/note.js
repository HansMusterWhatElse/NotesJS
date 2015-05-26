function NoteObject(id) {
    this.uid = id;
    this.attachements = [];
    this.serializedFormData = "";
};

function Note() {
    this.output = [];
    this.currentWorkingObject = new NoteObject(helperFn.createGuid());
    this.addAttachement = function (files, obj) {
        // Display a message concerning the selected files & store the file in the local storage
        for (var i = 0, f; f = files[i]; i++) {
            var fileReader = new FileReader();
            fileReader.onload = (function (file, curObject) {
                return function (evt) {
                    // Read out file contents as a data URL => result => base64 encoded data string
                    var base64File = evt.target.result;
                    curObject.attachements.push(base64File);
                }
            })(f, this.currentWorkingObject);

            // Async
            fileReader.readAsDataURL(f);

            // Display
            this.displayOutputMessage(f);
        }
        $uploadOutput.html('<ul>' + this.output.join('') + '</ul>');
    };
    this.displayOutputMessage = function (f) {
        this.output.push('<li><strong>',
            escape(f.name),
            '</strong> (',
            f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate.toLocaleDateString(), '</li>');
    };
    this.serialize = function (form, paramObj) {
        this.currentWorkingObject.serializedFormData = form + '&' + $.param(paramObj);
        try {
            localStorage.setItem(this.currentWorkingObject.uid, JSON.stringify(this.currentWorkingObject));
        } catch (e) {
            console.log("Saving item to storage failed: " + e);
        }
    };
    this.deserialize = function (uid) {
        try {
            return JSON.parse(localStorage.getItem(uid));
        } catch (e) {
            console.log("Retrieving item from storage failed: " + e);
        }
    }

    this.populateForm = function () {
        if (this.currentWorkingObject.serializedFormData) {
            var elem = splitQueryString(this.currentWorkingObject.serializedFormData);
            // Repopulate the form
            $.each(elem, function (key, value) {
                var $res = $form.find("[name='" + key + "']"),
                    decodedValue = decodeString(value);
                if ($res.length === 1 || $res.is('input:radio')) {
                    switch ($res.tagName()) {
                        case "input":
                            if ($res.is('input[value=' + decodedValue + ']:radio')) {
                                // Input radio butto
                                $("input[name='" + key + "'][value='" + decodedValue + "']").attr('checked', 'checked');
                            } else {
                                // Input regular
                                $res.val(decodedValue);
                            }
                            break;
                        case "textarea":
                            $res.append(decodedValue);
                            break;
                        case "button":
                            $res.html(decodedValue);
                            break;
                        default:
                            console.log("Mapping for the deserialisation process failed. Key: " + key + " Value: " + value);
                            break;
                    }
                } else {
                    console.log("Duplicate entries for Key: " + key + " Value: " + value);
                }
            });
        }
    };
};

function NoteCollection() {
    this.collection = [];
    this.init = function () {
        this.mapLocalStorage();
        this.populateTable();
    };
    this.mapLocalStorage = function () {
        for (var i = 0, len = localStorage.length; i < len; i++) {
            var key = localStorage.key(i);
            if (key.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g)) {
                var note = new Note();
                note = note.deserialize(key);
                if (note) {
                    this.collection.push(note);
                }
            }
        }
    };
    this.populateTable = function () {
        var nodeCol = this;
        $.each(this.collection, function (index, obj) {
            var deserializedObj = helperFn.splitQueryString(obj.serializedFormData);
            $.each(deserializedObj, function (key, value) {
                deserializedObj[key] = nodeCol.getColValue(key, helperFn.decodeString(value));
            });
            var html = app.template(deserializedObj);
        });
    };

    this.getColValue = function(key, value) {
        switch (key) {
            case "status":
                if (value !== "Status") {
                    return value.match(/:\s+(\w+)/g)[0] === "Pending" ?
                       '<span class="glyphicon glyphicon-ok icon"></span>' :
                       '<span class="glyphicon glyphicon-remove icon"></span>';
                } else {
                    return "";
                }                       
            case "duedate":
                return !helperFn.isEmpty(value) ? value.match(/([^\s]+)/)[0] : "";
            case "optpriority":
                return value === "high" ? '<span class="glyphicon glyphicon-circle-arrow-up icon">' :
                    value === "medium" ? '<span class="glyphicon glyphicon-circle-arrow-left icon">' :
                    '<span class="glyphicon glyphicon-circle-arrow-down icon">';
            default:
                return value;
        }
    };
};