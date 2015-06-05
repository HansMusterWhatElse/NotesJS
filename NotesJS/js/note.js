function NoteObject(guid) {
    this.guid = guid;
    this.attachmentIndex = 0; // "href" value to identify the item in the <output> element
    this.attachements = [];
    this.formDataObj = {};
};

var Note = Note || (function(window, document, undefined) {
    function NoteFn() {
        // Private 
        var _debugging = false;
        var _noteObj = new NoteObject(helperFn.createGuid());

        // Getter + Setter
        this.getNoteObj = function () {
            return _noteObj;
        }
        this.setNoteObj = function (value) {
            _noteObj = value;
        }
        this.getDebugging = function () {
            return _debugging;
        }
        this.setDebugging = function (value) {
            _debugging = value;
        }

        this.addAttachement = function (files) {
            // Display a message concerning the selected files & store the file in the local storage
            for (var i = 0, f; f = files[i]; i++) {
                var fileReader = new FileReader(),
                    nextIndex = this.getNextFreeIndex();  // next index in the attachement object array => slicing elements lowers the index number
                fileMetaData = {
                    index: _noteObj.attachmentIndex++,
                    name: f.name, // escape
                    type: f.type,
                    size: f.size,
                    lastMod: helperFn.createAndFormatMomentObj(f.lastModifiedDate, 'LL')
                };
                this.addDataToAttachementObj(nextIndex, fileMetaData);

                fileReader.onload = (function (file, obj) {
                    return function (evt) {
                        // Read out file contents as a data URL => result => base64 encoded data string
                        var base64File = evt.target.result;
                        obj["note"].addDataToAttachementObj(obj["index"], { data: base64File })
                    };
                })(f, { note: this, index: nextIndex }); // hack => fileReader.onload() takes just one additional parameter for the closure function, thus the workaround with the object 
                // it also seems that the argument e.g index has to be passed explicit and can't be accessed (different value) via this 

                // Async => reading file
                fileReader.readAsDataURL(f);
            }

            this.writeAttachementsToOutput();
        };

        this.writeAttachementsToOutput = function () {
            var html = app.outputTemplate(_noteObj.attachements);
            $('.upload-output').html(html);
        };

        this.removeAttachement = function (index) {
            // remove the object from the array with property index == index (
            for (var i = 0; i < _noteObj.attachements.length; i++) {
                if (_noteObj.attachements[i].index === index) {
                    _noteObj.attachements.splice(i, 1);
                }
            }
        }

        // Gets the next free index value for the attachement object
        this.getNextFreeIndex = function () {
            return _noteObj.attachements.length;
        }

        this.addDataToAttachementObj = function (index, obj) {
            // Add additional file related data to the attachement object array
            if (_noteObj.attachements[index]) {
                $.extend(true, _noteObj.attachements[index], obj);
            } else {
                _noteObj.attachements[index] = obj
            }
        };

        this.serialise = function () {
            _noteObj.formDataObj = $("#note-form").serialiseObject();
            var jsonString = JSON.stringify(_noteObj);
            try {
                localStorage.setItem(_noteObj.guid, jsonString);
                if (this._debugging) {
                    // Set the guid for the testing environment to the last serialised guid => localstorage
                    testingObj.storeGuid(_noteObj.guid);
                    console.log(jsonString);
                }
                return _noteObj;
            } catch (e) {
                console.log("Saving item to storage failed: " + e);
            }
        };

        this.deserialise = function (guid) {
            try {
                var serialisedObj = JSON.parse(localStorage.getItem(guid));
                if (this._debugging) {
                    // Set the guid for the testing environment to the last serialised guid => localstorage
                    testingObj.storeGuid(guid);
                    console.log(serialisedObj);
                }
                return serialisedObj;
            } catch (e) {
                console.log("Retrieving item from storage failed: " + e);
            }
        };

        this.populateForm = function () {
            // Form data
            var node = this;
            if (_noteObj.formDataObj) {
                $.each(_noteObj.formDataObj, function (key, value) {
                    node.setFormValue(key, value);
                });
            }

            // Attachements
            this.writeAttachementsToOutput();
        };

        // Clear the form with an empty string
        this.clearForm = function () {
            if (_noteObj.formDataObj) {
                var nodeObj = this;
                $.each(_noteObj.formDataObj, function (key) {
                    nodeObj.setFormValue(key, "");
                });
            }
        };

        this.setFormValue = function (key, value) {
            var $res = $("#note-form").find("[name='" + key + "']");
            var isRadio = $res.is('input:radio');
            if ($res.length === 1 || isRadio) { // check for duplicates
                switch ($res.tagName()) {
                    case "input":
                        // Input radio button
                        if (isRadio) {
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
        };
    };

    

    return NoteFn;

})(window, document, undefined);
