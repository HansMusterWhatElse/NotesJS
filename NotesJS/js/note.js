function NoteObject(id) {
    this.uid = id;
    this.attachements = [];
    this.serializedFormData = "";
};

function Note() {
    this.output = [];
    this.debugging = false;
    this.currentWorkingObject = new NoteObject(helperFn.createGuid());
    this.addAttachement = function (files) {
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
        $('#upload-output').html('<ul>' + this.output.join('') + '</ul>');
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
            // Set the guid for the testing environment to the last serialized guid => localstorage
            this.debugging && testingObj.storeGuid(this.currentWorkingObject.uid);
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
    };

    this.populateForm = function () {
        if (this.currentWorkingObject.serializedFormData) {
            var elem = helperFn.splitQueryString(this.currentWorkingObject.serializedFormData);
            $.each(elem, function (key, value) {
                var decodedValue = helperFn.decodeString(value);
                setFormValue(key, decodedValue);
            });
        }
    };

    // Clear the form with an empty string
    this.clearForm = function() {
        if (this.currentWorkingObject.serializedFormData) {
            var elem = helperFn.splitQueryString(this.currentWorkingObject.serializedFormData),
                note = this; // hack to access the Note object
            $.each(elem, function (key) {
                note.setFormValue(key, "");
            });
        }
    }

    this.setFormValue = function (key, value) {
        var $res = $("#note-form").find("[name='" + key + "']");
        if ($res.length === 1 || $res.is('input:radio')) {
            switch ($res.tagName()) {
                case "input":
                    // Input radio button
                    if ($res.is('input:radio')) {
                        // checks for "high", "medium", "low" => if the value variable is empty => set to unchecked
                        value ? $("input[name='" + key + "'][value='" + value + "']").attr('checked', 'checked') :
                            $("input[name='" + key + "'][value='" + value + "']").attr('checked', false);
                    } else {
                        // Input regular
                        $res.val(value);
                    }
                    break;
                case "textarea":
                    $res.val(value);
                    break;
                case "button":
                    $res.html(!helperFn.isEmpty(value) ? value : "Status");
                    break;
                default:
                    console.log("Mapping for the deserialisation process failed. Key: " + key + " Value: " + value);
                    break;
            }
        } else {
            console.log("Duplicate entries for Key: " + key + " Value: " + value);
        }
    }
};

function NoteCollection() {
    this.collection = [];
    this.init = function () {
        this.mapLocalStorage();
        this.populateTable();
    };

    // Retrieves all the data from the local storage which use a guid as key
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

    // Populates the table with the notes from the local storage => passes the deserialised object to the handlebar framework
    this.populateTable = function () {
        var nodeCol = this;
        $.each(this.collection, function (index, obj) {
            var deserializedObj = helperFn.splitQueryString(obj.serializedFormData);
            $.each(deserializedObj, function (key, value) {
                deserializedObj[key] = nodeCol.getColValue(key, value);
            });
           // var html = app.template(deserializedObj);
           // fTemplate.clone().appendTo("#row" + (row + 1)).children()
           //.filter("img").attr("src", "product1.jpg").end()
           //.filter("label").attr("for", fNames[i]).text(fNames[i]).end()
           //.filter("input").attr({
           //    name: fNames[i],
           //    value: 0
           // });

           // <!-- HTML templates -->
           // <script id="flowerTmpl" type="text/x-handlebars-template">
           // {{#each flowers}}
           // <div class="dcell">
           // <img src="product1.jpg" />
           // <label for="{{product}}">{{name}}:</label>
           // <input name="{{product}}"
           //    data-price="{{price}}"
           //    data-stock="{{stock}}"
           //    value={{stock}}
           //    min="0"
           //    max="{{stock}}"
           //    required />
           // </div>
            //            {{/each}}$

            var templResult = $("#flowerTmpl").template(data).filter("*");
        });
    };

    // Sets the column values for the <td> elements in the note collection table
    this.getColValue = function (key, value) {
        switch (key) {
            case "status":
                if (value !== "Status" && !helperFn.isEmpty(value)) { // Table display => icon
                    return value.match(/:\s*(\w+)/g)[0] === "Pending" ?
                       '<span class="glyphicon glyphicon-ok icon"></span>' :
                       '<span class="glyphicon glyphicon-remove icon"></span>';
                } else {
                    return "Status"; // Button value
                }
            case "duedate":
                return !helperFn.isEmpty(value) ? value.match(/([^\s]+)/)[0] : "";
            case "optpriority":
                return value === "high" ? '<span class="glyphicon glyphicon-circle-arrow-up icon">' :
                    value === "medium" ? '<span class="glyphicon glyphicon-circle-arrow-left icon">' :
                    '<span class="glyphicon glyphicon-circle-arrow-down icon">';
            case "creationdate":
                return new Date(value);
            default:
                return value;
        }
    };
};