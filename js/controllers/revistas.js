
/* JavaScript content from js/controllers/revistas.js in folder common */
/* global angular, document, window */
'use strict';

angular.module('starter.revistas', [])

    .controller('VerPortadasController', function ($scope, $stateParams, $timeout, 
                                                    $interval, busyIndicator, 
                                                    ContactoService, cfpLoadingBar, ContentProvider, descargaService) {
        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        try { // Get access to app file system for storage of individual documents
            //busyIndicator = new WL.BusyIndicator("content", { text: "Descargando Portadas...", boxLength: 240 });
            //busyIndicator.showw();

            var CONTACTO_COLLECTION_NAME = 'contacto';
            var options = { limit: 1 };
            //busyIndicator.show();
            $scope.jsonPortadas = [];
            $scope.jsonDescargas = [];
            WL.Logger.debug('VerPortadasController ContentProvider.data.idContEject:: '+ContentProvider.data.idContEject );            
            $scope.jsonDescargas = descargaService.getAll();
            
            
            //alert("Al abrir la vista" + JSON.stringify($scope.jsonDescargas));

            if (WL.JSONStore && WL.JSONStore.get(CONTACTO_COLLECTION_NAME) != undefined){

                WL.JSONStore.get(CONTACTO_COLLECTION_NAME)
                .findAll(options)
                .then(function (arrayResults) {
                        
                    try{
                        if( arrayResults.length > 0 ){
                            //Borrar los elementos temporales del arreglo
                            $scope.jsonPortadas.splice(0, $scope.jsonPortadas.length);
                            for (var i = 0; i < arrayResults.length; i++) {
                                var item = arrayResults[i].json;
                                $scope.jsonPortadas.push(item);
                            }
                        }else{
                            WL.Logger.debug("VerPortadasController in try else...");
                            $scope.jsonPortadas.splice(0, $scope.jsonPortadas.length);
                            $scope.jsonPortadas = ContactoService.getAll();
                        }
                    }catch (error) {
                        WL.Logger.error("VerPortadasController. No se pueden obtener los documentos JSON de las Portadas. "+ error.message);
                        $scope.jsonPortadas.splice(0, $scope.jsonPortadas.length);
                        $scope.jsonPortadas = ContactoService.getAll();
                        WL.Logger.debug("VerPortadasController in error chatch jsonPortadas length:: " +$scope.jsonPortadas.length );
                        $timeout( function(){
                            },200
                        );
                        //busyIndicator.hide();
                    }

                    $scope.errorMsg = "";

                    $timeout( function(){
                        WL.Logger.debug("VerPortadasController try jsonPortadas length:: " +$scope.jsonPortadas.length );
                    },100);
                        
                })
                .fail(function (errorObject) {
                    WL.Logger.ctx({ pretty: true }).debug(errorObject);
                    $scope.errorMsg = "No fue posible cargar las portadas de revista";
                    $scope.jsonPortadas.splice(0, $scope.jsonPortadas.length);
                    $scope.jsonPortadas = ContactoService.getAll();

                    $timeout( function(){
                         WL.Logger.debug("VerPortadasController fail in jsonPortadas length:: " +$scope.jsonPortadas.length );
                        },60
                    );
                    //busyIndicator.hide();
                });
            }else{
                $scope.jsonPortadas.splice(0, $scope.jsonPortadas.length);
                $scope.jsonPortadas = ContactoService.getAll();
                WL.Logger.debug("CuponesController of Local $scope.jsonPortadas.length:: " +$scope.jsonPortadas.length);
                
                $timeout( function(){
                    //busyIndicator.hide();
                },60);
            }

            if ($scope.jsonDescargas.length != 0) {
                WL.SimpleDialog.show("Advertencia", "La revista continua descargandose.", [ { text: "Aceptar", handler: function(){} } ]);
            }
            
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        } catch (error) {
            WL.Logger.debug("Cannot get access to file system in web app");
        }
        
        WL.Logger.debug("VerPortadasController... ");

        // Set Ink
        //ionicMaterialInk.displayEffect();

        var documentsCollection;
        var collectionPDF = "documents";
        var ctx = {};
        var collections2 = {};
        var nbDocsFound;
        var docsToUpdate;
        var docsToAdd;
        var localPath;
        $scope.docname = '';
        var flag = false;
        var file = "file.txt";
        var dirpath;

        collections2[collectionPDF] = {
            searchFields: { name: "string", timestamp: "integer" },
        };

        var storageLocation = "";
        console.log(device.platform);
        switch (device.platform) {
            case "Android":
                storageLocation = 'file:///storage/emulated/0/Download/';
                break;
            case "iOS":
                storageLocation = cordova.file.documentsDirectory;
                break;
        }

        function gotFS(fileSystem) {
            //WL.Logger.debug("got fs: fileSystem.name:" + fileSystem.name);
            //WL.Logger.debug("fileSystem.root.name:" + fileSystem.root.name);
            ctx.fileSystem = fileSystem;
            //busyIndicator.hide();
        }

        function fail(evt) {
            //busyIndicator.hide();
            WL.Logger.debug("Received failed event", evt);
            console.dir(evt);
        }

        $scope.obtenDocumento = function (docName) {

            console.log("storageLocation es :: " + storageLocation);

            if ($scope.jsonDescargas.length != 0) {
                WL.SimpleDialog.show("Advertencia", "La revista continua descargandose.", [ { text: "Aceptar", handler: function(){} } ]);
            } else {
                $scope.docname = docName;
                WL.Logger.debug("se llamo obtenDocumento " + docName + " " + $scope.docname);
            }            
            
            //alert("se llamo a obtenDocumento" + docName + " " + $scope.docname);
            /*
            if(docName.length > 0){
                var localPathPDF = getFilePath(docName);
                $scope.docname = docName;
                $scope.abrirPDF(localPathPDF);
                }
            */
            $scope.existe(docName);            
        }

        $scope.abortarDescarga = function (docName) {

            WL.Logger.debug("clicket abortarDescarga :: "+docName);
            $scope.docname = docName;
            //var localPathPDF = getFilePath(docName);
            window.resolveLocalFileSystemURL(storageLocation, function(dir) {
                dir.getFile(docName, {create:false}, function(fileEntry) {
                          fileEntry.remove(function(){
                              console.log("The file has been removed succesfully");
                          },function(error){
                              console.log("Error deleting the file");
                              // Error deleting the file
                          },function(){
                            console.log("The file doesn't exist");
                             // The file doesn't exist
                          });
                });
            });

            /*
            window.resolveLocalFileSystemURL(
                storageLocation, // retrieve directory
                function (dirEntry) {
                    WL.Logger.debug("I am in directory " + storageLocation);
                    dirEntry.getFile( // open new file in write mode
                        $scope.docname,
                        { create: false, exclusive: false },
                        removeDocumentoCallback,
                        errorCallback);
                },
            fail);

            //window.requestFileSystem(type, size, successCallback, errorCallback)
            function removeDocumentoCallback(fileEntry) {
                WL.Logger.debug("removeDocumentoCallback file entry:: ", storageLocation); 

                fileEntry.remove(function() {
                    WL.Logger.debug('File removed.');
                    $scope.complete();
                }, errorCallback);
            }

            function errorCallback(error) {
                WL.Logger.debug("ERROR in remove. Error code:: " + error.code);
                $scope.complete();
            }
            */

        }

        //Verificar archivo txt
        $scope.existe = function(docName){
            //alert("se llamo existe");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                fileSystem.root.getFile("text.txt", { create: false }, fileExists, fileDoesNotExist);
            }, getFSFail); //of requestFileSystem
        };

        function fileExists(fileEntry){
            //alert("File " + fileEntry.fullPath + " exists!");
            $scope.borrar();
        }

        function fileDoesNotExist(){
            //WL.Logger.debug("este es docnname " + docName);
            //alert("se llamo fileDoesNotExist desde borrarPDF" + $scope.docname);
            //alert("file txt does not exist");

            if($scope.docname.length > 0){
                //alert("entro al if > 0");
            
            //var localPathPDF = getFilePath($scope.docname);
            WL.Logger.debug("printlocalpath***" + storageLocation + $scope.docname);
            //$scope.docname = docName;
            $scope.abrirPDFPDF();
            
            }else{
                //alert("entro al else");
            }
        }

        function getFSFail(evt) {
            WL.Logger.debug(evt.target.error.code);
        }

        $scope.borrar = function(){

           window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successCallback, errorCallback)

           function successCallback(fs) {
              fs.root.getFile('text.txt', {create: false}, function(fileEntry) {
                 fileEntry.remove(function() {
                    //alert('File txt removed.');
                    $scope.borrarPDF();
                 }, errorCallback);

              }, errorCallback);
           }

           function errorCallback(error) {
              //alert("ERROR: " + error.code)
           }            
        };

        $scope.borrarPDF = function() {
        //alert("se llamo a borrarPDF para borrar: " + $scope.docname);
            window.resolveLocalFileSystemURL(storageLocation, function(dir) {
                dir.getFile($scope.docname, {create:false}, function(fileEntry) {
                          fileEntry.remove(function(){
                              console.log("The file has been removed succesfully");
                              fileDoesNotExist();
                          },function(error){
                              console.log("Error deleting the file");
                              fileDoesNotExist();
                              // Error deleting the file
                          },function(){
                            console.log("The file doesn't exist");
                             // The file doesn't exist
                             fileDoesNotExist();
                          });
                });
            });

            /*
           window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successCallback, errorCallback)

           function successCallback(fs) {
              fs.root.getFile($scope.docname, {create: false}, function(fileEntry) {
                 fileEntry.remove(function() {
                    //alert('File PDF removed.');
                    fileDoesNotExist();

                 }, errorCallback);

              }, errorCallback);
           }

           function errorCallback(error) {
              //alert("ERROR: " + error.code);
              fileDoesNotExist();
           }
           */            
        };               



        $scope.abrirPDFPDF = function () {
            //alert("PDFPDF");
            if(cordova != undefined){
                cordova.exec(fileViewSuccess, fileViewFailure, "FileOpener2", "open", [storageLocation + $scope.docname, 'application/pdf']);
            }else{
                WL.Logger.debug('abrirPDF :: Es ambiente Web no existe cordova.... ');
            }
            
        }


        function fileViewSuccess() {
        	WL.Logger.debug('fileViewSuccess ...');
        }

        function fileViewFailure() {
            WL.Logger.debug('fileViewFailure el documento :: '+ $scope.docname+ ' aun no ha sido descargado');
            try{
                var networkState = navigator.connection.type;
                //WL.Logger.debug(' networkState :: '+networkState);

                var states = {};
                states[Connection.UNKNOWN]  = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI]     = 'WiFi connection';
                states[Connection.CELL_2G]  = 'Cell 2G connection';
                states[Connection.CELL_3G]  = 'Cell 3G connection';
                states[Connection.CELL_4G]  = 'Cell 4G connection';
                states[Connection.CELL]     = 'Cell generic connection';
                states[Connection.NONE]     = 'none';
                if(states[networkState] == 'WiFi connection'){
                    $scope.confirmDownloadDocument();
                }else{

                    navigator.globalization.getPreferredLanguage(
                        function (language) {
                            var title     = 'Advertencia';
                            //var template  = 'Iniciará la descarga de la revista con una duración aproximada de 2 minutos.';
                            var template  = 'Es necesaria una conexión WiFi para descargar la revista.';
                            var btn1      = 'Aceptar';
                            if (language.value == 'en-US' || language.value == 'en-MX' 
                                || language.value == 'english' || language.value == 'ingles' ){
                                    
                                //title     = 'Download Magazine';
                                //template  = 'Start downloading the magazine with an approximate duration of 2 minutes.';
                                title     = 'Warning';
                                template  = 'A WiFi connection is required to download the magazine.';
                                btn1      = 'Accept';
                            }
                            
                            WL.SimpleDialog.show(title, template, [
                                {   text : btn1, handler : function() { }
                                }
                            ]);
                        },
                        function () {
                            WL.Logger.debug("can't get language");
                        }
                    );

                }
            }
            catch( error ){
                WL.Logger.error("Error en scope.checkConnection: "+ error.message);
            }
        }

        $scope.confirmDownloadDocument = function () {
            navigator.globalization.getPreferredLanguage(
                function (language) {
                    var title     = 'Descarga de Revista';
                    var template  = 'La descarga de revista podría durar algunos minutos.';
                    var btn1      = 'Aceptar';
                    var btn2      = 'Cancelar';
                    if (language.value == 'en-US' || language.value == 'en-MX' 
                        || language.value == 'english' || language.value == 'ingles' ){
                            
                        title     = 'Download Magazine';
                        template  = 'Magazine downloading could take a few minutes.';
                        btn1      = 'Accept';
                        btn2      = 'Cancel';
                    }
                    
                    WL.SimpleDialog.show(title, template, [
                        {
                            text : btn1,
                            handler : function() {$scope.downloadRemoteDocument( $scope.docname )}
                        },
                        {
                            text : btn2,
                            handler : function(){ WL.Logger.debug('buton cancel');}
                        }
                    ]);
                    },
                function () {
                WL.Logger.debug("can't get language");
                }
            );
        }


        /**
         * Version where the download of individual documents is made by invoking a remote web server.
         * Comment this function if you want to use the other implementation
         * Replace the pdfRemoteUrl variable with the base URL of the remote web server
         */
        
	    var pdfRemoteUrl = "http://mobile.costco.com.mx/mwdserverstub/rest/revistas/pdf/";
        //var pdfRemoteUrl = "http://192.168.1.67:10080/mwdserverstub/rest/contacto/pdf/";
	    //var pdfRemoteUrl = "http://10.100.70.147:10080/mwdserverstub/rest/revistas/pdf/";
        //var pdfRemoteUrl = "https://www3.costco.com.mx/portal/CostcoContacto/pdf/"; //TODO: replace with URL of the web server where documents are located
        $scope.downloadRemoteDocument = function (docName) {
            $scope.start();
            descargaService.addone();
            $scope.jsonDescargas = descargaService.getAll();
            //alert("Ya iniciada la descarga " + JSON.stringify($scope.jsonDescargas));
            $scope.createFile();

            //WL.Logger.debug("downloadRemoteDocument:pdfRemoteUrl: " + pdfRemoteUrl + ":docName: " + docName);
            //localPath = getFilePath(docName);
            WL.Logger.debug("downloading Document to : " + storageLocation + $scope.docname);

            var fileTransfer = new FileTransfer();
            var intervalo = 160; //intervalo de tiempo en milisegundos
            var numrepit = 990;

            $scope.progreso= 0.001;

            $interval(callAtIntervalProgress, intervalo, numrepit);
            
            fileTransfer.download(
                pdfRemoteUrl + docName, // remote file location
                storageLocation + $scope.docname, // where to store file locally
                function (entry) {
                    console.log('se descargo en ::' + storageLocation + $scope.docname);
                    $scope.complete();
                    descargaService.reset();
                    $scope.jsonDescargas = descargaService.getAll();
                    //alert("Ya se descargo " + JSON.stringify($scope.jsonDescargas));
                    $scope.borrarborrar();

                    navigator.globalization.getPreferredLanguage(
                        function (language) {
                            var title     = 'Descarga de Revista terminada';
                            var template  = 'La descarga de revista ha terminado, ¿Desea visualizarla?.';
                            var btn1      = 'Aceptar';
                            var btn2      = 'Cancelar';
                            if (language.value == 'en-US' || language.value == 'en-MX' 
                                || language.value == 'english' || language.value == 'ingles' ){
                                    
                                title     = 'Download Magazine finished';
                                template  = 'Magazine downloading completed. ¿Do you want to open it?.';
                                btn1      = 'Accept';
                                btn2      = 'Cancel';
                            }
                            
                            WL.SimpleDialog.show(title, template, [
                                {
                                    text : btn1,
                                    handler : function() {$timeout(function() {$scope.cargaPDF();}, 1000);}
                                },
                                {
                                    text : btn2,
                                    handler : function(){ WL.Logger.debug('buton cancel');}
                                }
                            ]);
                            },
                        function () {
                        WL.Logger.debug("can't get language");
                        }
                    );
                    WL.Logger.debug("download complete: " + entry.fullPath);
                },
                function (error) {
                    WL.Logger.debug("download error code" + error.code);
                    $scope.abortarDescarga($scope.docname);

                    if (error.code == 3){

                        navigator.globalization.getPreferredLanguage(
                            function (language) {
                                var title     = 'Error en la descarga';
                                var template  = 'No hay comunicación con el servidor. Por favor, asegurate de estar conectado a una red Wifi con acceso a internet para realizar la descarga de la revista.';
                                var btn1      = 'Aceptar';
                                if (language.value == 'en-US' || language.value == 'en-MX' 
                                    || language.value == 'english' || language.value == 'ingles' ){
                                        
                                    title     = "Error in download";
                                    template  = "Has communication breakdown with server. Please be sure to be connected to a wireless network with Internet access for downloading magazine";
                                    btn1      = "Accept";
                                }
                                
                                WL.SimpleDialog.show(title, template, [
                                    {   text : btn1, handler : function() { $scope.complete(); }
                                    }
                                ]);
                            },
                            function () {
                                WL.Logger.debug("can't get language");
                            }
                        );

          	        }
                    //$scope.complete();
                    descargaService.reset();
                    $scope.jsonDescargas = descargaService.getAll();
                   
                },
                null, // or, pass false
                {}
            );
        }

        //Crea indicador de que la descarga del PDF de completo
        $scope.createFile = function(){
            // Wait for PhoneGap to load
            //
            //document.addEventListener("deviceready", onDeviceReady, false);
            // PhoneGap is ready
            //
            //function onDeviceReady() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
            //}

            function gotFS(fileSystem) {
            fileSystem.root.getFile("text.txt", {create: true, exclusive: false}, gotFileEntry, fail);
            }

            function gotFileEntry(fileEntry) {
                fileEntry.createWriter(gotFileWriter, fail);
            }
            
            function gotFileWriter(writer) {
            WL.Logger.debug("se creo text.txt")
                /*
                writer.onwriteend = function(evt) {
                    WL.Logger.debug("contents of file now 'some sample text'");
                    writer.truncate(11);  
                    writer.onwriteend = function(evt) {
                        WL.Logger.debug("contents of file now 'some sample'");
                        writer.seek(4);
                        writer.write(" different text");
                        writer.onwriteend = function(evt){
                            WL.Logger.debug("contents of file now 'some different text'");
                        }
                    };
                };
                writer.write("some sample text");
                */
            }
                        
            function fail(error) {
                WL.Logger.error(error.code);
            }

        };

        $scope.borrarborrar = function(){

           window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successCallback, errorCallback)

           function successCallback(fs) {
              fs.root.getFile('text.txt', {create: false}, function(fileEntry) {
                 fileEntry.remove(function() {
                    //alert('File txt removed.');
                 }, errorCallback);

              }, errorCallback);
           }

           function errorCallback(error) {
              WL.Logger.debug("ERROR: " + error.code);
           }            
        };        


        function callAtIntervalProgress() {
            if ($scope.progreso < 0.99){
                cfpLoadingBar.set($scope.progreso); // Set the loading bar to X%
                $scope.progreso = $scope.progreso + 0.001
            }
        }


        function getFilePath(fileName) {
            if(ctx.fileSystem.root != undefined){
                 return ctx.fileSystem.root.toURL() + fileName;
            }else{
                   window.open('http://mobile.costco.com.mx/mwdserverstub/rest/revistas/pdf/'+fileName, 
										 '_blank', 'closebuttoncaption=Salir,EnableViewPortScale=yes');
                 return false;
            }
        }

        function getTarget() {
            return "_blank";
        }

        $scope.cargaPDF = function () {
            if(cordova != undefined){
                WL.Logger.debug('cargaPDF: scope.progreso: '+$scope.progreso);
                cordova.exec(fileOpenerSuccess, fileOpenerFailure, "FileOpener2", "open", [storageLocation + $scope.docname, 'application/pdf']);
            }else{
                WL.Logger.debug('cargaPDF :: Es ambiente Web no existe cordova.... ');
            }
        }

        function fileOpenerSuccess(data) {
            WL.Logger.debug('fileOpenerSuccess:: ');
        }

        function fileOpenerFailure(data) {

            navigator.globalization.getPreferredLanguage(
                function (language) {
                    var title     = 'Error en la descarga';
                    var template  = 'No es posible mostrar la revista. Por favor, inténtelo de nuevo.';
                    var btn1      = 'Aceptar';
                    if (language.value == 'en-US' || language.value == 'en-MX' 
                        || language.value == 'english' || language.value == 'ingles' ){
                        
                        title     = "Error in download";
                        template  = "Unable to display the magazine. Please try again later";
                        btn1      = "Accept";
                    }
                    
                    WL.SimpleDialog.show(title, template, [
                        {   text : btn1, handler : function() { }
                        }
                    ]);
                    },
                function () {
                    WL.Logger.debug("can't get language");
                }
            );
        }

        $scope.start = function() {
            cfpLoadingBar.start();
        };

        $scope.complete = function () {
            if ($scope.progreso < 0.91){
                $scope.progreso = 0.95;
                cfpLoadingBar.set($scope.progreso);
            }
            $timeout(function() {
                    cfpLoadingBar.complete();
                }, 2200
            );
            
        }

    })
   ;
