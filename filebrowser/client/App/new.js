var currentDir = getParam('currentDir');
var dir = getParam('dir');

$(getInstanceID("button-save")).click(function(event) {
    var name = $(getInstanceID("name-input")).val();
    var filetype = $(getInstanceID("file-type")).val();

    var error="";

    if(name == "" || name == null){
        error = "* Name harus diisi";
    }
    if(error != ""){
        return false;
    }
    else {
        var targetdir = currentDir + name +"."+filetype;
        function getFile(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function(e) {
                if (this.status == 200) {
                    // get binary data as a response
                    callback(false, this.response);
                }
            };
            xhr.onerror = function (e) {
                callback(true, e);
            };
            xhr.send();
        }

        var dataurl = 'https://localhost:50710/files/new.docx';

        soyut.storage.getStorageKeyAsync({userId: fileSystem.userid}).then(function(storageKey) {
            var storagePath = targetdir;
            var fileUrl = 'https://localhost:5454/storage/' + storageKey + '/' + storagePath;

            function getPosition(str, m, i) { return str.split(m, i).join(m).length; }

            var safeUrl = dataurl.substring(0, 8) + "localhost" + dataurl.substring(getPosition(dataurl, ':', 2));

            console.log(safeUrl);

            // debugger;
            getFile(safeUrl, function(err, dataBuffer) {
                if (err) return;
                soyut.storage.putAsync({
                    storageKey: storageKey,
                    path: storagePath,
                    dataBuffer: dataBuffer
                }).then(function() {

                    var directory = {
                        "currentDir": currentDir,
                        "dir": dir
                    };

                    var activity = getActivityInstance();
                    activity.context.invoke('file_created', directory);
                    activity.window.close();

                });
            });

        });



        //})
    }

});