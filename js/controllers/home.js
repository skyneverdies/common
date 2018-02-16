'use strict';

angular.module('starter.home', [])

.controller('HomeController', function($ionicPlatform, $scope, $state, $stateParams, $timeout, $interval,
										$ionicSlideBoxDelegate, HomeService, ContentProvider, descargaJson, descargaJson2,
										checkEnter, downloadInProcess, facturacionService, consultaLogin) {	
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
	$scope.obtnerContenido = true;
	var intervalo = 9000; //intervalo de tiempo en milisegundos
    var numrepit = 3;
    var uri0 = encodeURI("https://www3.costco.com.mx/portal/Cupones/versionador_cupones.json");
    var uri1 = encodeURI("https://www3.costco.com.mx/portal/Cupones/JsonData1.json");
    //var uri0 = encodeURI("http://10.100.70.9/cupones/versionador_cupones.json");
    //var uri1 = encodeURI("http://10.100.70.9/cupones/JsonData1.json");

	var relativeFilePath0 = "versionador_cupones.json";
	var relativeFilePath1 = "JsonData1.json";
	$scope.json = [];
	$scope.arranque = 0;
	$scope.checkConnection;

	function connection () {
		var networkState = navigator.connection.type;

	    var states = {};
	    states[Connection.UNKNOWN]  = 'Unknown connection';
	    states[Connection.ETHERNET] = 'Ethernet connection';
	    states[Connection.WIFI]     = 'WiFi connection';
	    states[Connection.CELL_2G]  = 'Cell 2G connection';
	    states[Connection.CELL_3G]  = 'Cell 3G connection';
	    states[Connection.CELL_4G]  = 'Cell 4G connection';
	    states[Connection.CELL]     = 'Cell generic connection';
	    states[Connection.NONE]     = 'No network connection';

	    return states[networkState];
	}

	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady(){

		var consultaConnection = connection();
		
	    if(consultaConnection == 'No network connection'){
	    	console.log('No tiene acceso a inteernet');
	    }else {
	    	if (descargaJson.getAll() == 0) {
	    		descargaJson.addone();
	    		descargaVersionador();
	        } else {
	            console.log('No es la primera vez que entra');
	        }
   	    }
    }

	function descargaVersionador(){
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		   var fileTransfer = new FileTransfer();
		   fileTransfer.download(
		      uri0,		
		      fileSystem.root.toURL() + relativeFilePath0,
		      function (entry) {
		         console.log("Se ha descargado el archivo versionador_cupones.json");
		         leerArchivo();
		      },
		      function (error) {
		      	console.log('Error al descargar versionador_cupones.json ::' + error);
		      }
		   );
		});
    }

    function leerArchivo (){

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFile, failFile);

		function gotFile(fileSystem) {
			fileSystem.root.getFile("versionador_cupones.json", null, gotFileEntro, fallo);
		}

		function failFile() {
			console.log('fallo gotFS ::');
		}

		function gotFileEntro(fileEntry) {
	        console.log('entro a gotFileEntry ::');
	        fileEntry.file(archivoEncontrado, archivoNoEncontrado);
	    }

	    function fallo (){
	    	console.log('No encontro archivo ::');
	    }

	    function archivoEncontrado(file){
	        console.log('entro a gotFile ::');
	        readFileVersionesAsText(file);
	    }

	    function readFileVersionesAsText(file) {
	        var reader = new FileReader();
	        reader.onloadend = function(evt) {
	            console.log("Read as text :: " + evt.target.result);
	            var tempVersionador1 = localStorage.getItem('localStorageVersionador') || '';
	            if (tempVersionador1 == '') {
	            	localStorage.setItem('localStorageVersionador', evt.target.result);
	            	var temporal = JSON.parse(evt.target.result);
	            	console.log('Se gusardo evt.target.result :::: ' + temporal[0].version + " " + temporal[0].vigencia);
	            	downloadInProcess.addone();
	            	descargaArchivoCupones();
	            } else {
	            	var tempVersionador2 = JSON.parse(tempVersionador1);
	            	var contenidoDelArchivo = JSON.parse(evt.target.result);
	            	console.log('Versiones :: ' + JSON.stringify(tempVersionador2[0].version) + ' & ' + JSON.stringify(contenidoDelArchivo[0].version));
	            	if (tempVersionador2[0].version == contenidoDelArchivo[0].version) {
	            		console.log('Son los mismo cupones');
	            	} else {
	            		localStorage.removeItem('localStorageVersionador');
	            		localStorage.setItem('localStorageVersionador', evt.target.result);
	            		downloadInProcess.addone();
	            		descargaArchivoCupones();

	            	}
	            }
	        };
	        reader.readAsText(file);
	    }

	    function archivoNoEncontrado(evt) {
	        console.log(evt.target.error.code);
		}
	}

	function descargaArchivoCupones () {
		localStorage.removeItem('localStorageCupones');
		console.log('Comenzo la descarga de cupones');
		//document.addEventListener("deviceready", existe, false);
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            fileSystem.root.getFile(relativeFilePath1, { create: false }, fileExists, fileDoesNotExist);
        }, getFSFail); //of requestFileSystem
	}

    function fileExists(fileEntry){
		$scope.borrar();
    }

    function fileDoesNotExist(){
        $scope.download();
    }

    function getFSFail(evt) {
        WL.Logger.debug('getFSFail ::' + evt.target.error.code);
    }

    $scope.borrar = function(){

       window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successCallback, errorCallback)

		function successCallback(fs) {
		console.log('entro al successCallback');
		  fs.root.getFile(relativeFilePath1, {create: false}, function(fileEntry) {
		     fileEntry.remove(function() {
		        //alert('File txt removed.');
		        $scope.download();
		     }, errorCallback);

		  }, errorCallback);
		}

		function errorCallback(error) {
			console.log('entro al errorCallback');
		    //alert("ERROR: " + error.code)
		}            
    };

    $scope.download = function(){
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		    var fileTransfer = new FileTransfer();
		    fileTransfer.download(
		      	uri1,		
		      	fileSystem.root.toURL() + relativeFilePath1,
		      	function (entry) {
		         	console.log("Success ::");
		        	onFileReady();
		      	},
		      	function (error) {
		      		downloadInProcess.reset();
			 		console.log('No encontro el archivo ::');
		      	}
		   	);
		});
    }

    function onFileReady (){
		console.log("entro a onDeviceReady y al if::");
	
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

		function gotFS(fileSystem) {
			console.log('entro a gotFS ::');
			fileSystem.root.getFile("JsonData1.json", null, gotFileEntry, failed);
		}

		function fail() {
			console.log('fallo gotFS ::');
		}

		function gotFileEntry(fileEntry) {
	        console.log('entro a gotFileEntry ::');
	        fileEntry.file(gotFile, fail);
	    }

	    function failed (){
	    	console.log('No encontro archivo ::');
	    }

	    function gotFile(file){
	        console.log('entro a gotFile ::');
	        readAsTextFile(file);
	    }

	    function readAsTextFile(file) {
	        var reader = new FileReader();
	        reader.onloadend = function(evt) {
	        	localStorage.setItem('localStorageCupones', evt.target.result);
	        	downloadInProcess.reset();
	            //console.log('Se gusardo evt.target.result de cupones:: ' + evt.target.result);
	        };
	        reader.readAsText(file);
	    }

	    function fail(evt) {
	        console.log(evt.target.error.code);
		}
	}


	$scope.getBanner = function () {
		WL.Logger.debug("HomeController getBanner ......................... ");
		
		var HOME_COLLECTION_NAME = 'home';
		var options = { limit: 6 };
		busyIndicator.show();
		
		if (WL.JSONStore && WL.JSONStore.get(HOME_COLLECTION_NAME) != undefined){

			WL.JSONStore.get(HOME_COLLECTION_NAME)
			.findAll(options)
			.then(function (arrayResults) {
				try{
					if( arrayResults.length > 0 ){
						//$scope.obtnerContenido = false;
						WL.Logger.debug("HomeController coleccion data arrayResults.length:: " +arrayResults.length);
						//Borrar los elementos temporales del arreglo
						$scope.jsonHomeSlideBanner = [];
						//$scope.jsonHomeSlideBanner.splice(0, $scope.jsonHomeSlideBanner.length);
						for (var i = 0; i < arrayResults.length; i++) {
							var item = arrayResults[i].json;
							$scope.jsonHomeSlideBanner.push(item);
						}
						WL.Logger.debug("HomeController of Local jsonHomeSlideBanner.length:: " +$scope.jsonHomeSlideBanner.length);
						//$state.go($state.current, {}, {reload: true});

						$ionicSlideBoxDelegate.stop();
						WL.Logger.debug("HomeController in  ionicSlideBoxDelegate.stop........ ");
						
						//RECIEN AGREGADO
						$ionicSlideBoxDelegate.start();
						$ionicSlideBoxDelegate.slide(0);
						$ionicSlideBoxDelegate.update();

					}else{
						$scope.jsonHomeBanner = [];
						$scope.jsonHomeBanner = HomeService.getAll();
						WL.Logger.debug("HomeController of Local jsonHomeBanner.length:: " +$scope.jsonHomeBanner.length);
					}
					
				}catch (error) {
					WL.Logger.error("No se pueden obtener los documentos JSON del Home Banner. "+ error.message);
					$scope.jsonHomeBanner = [];
					$scope.jsonHomeBanner = HomeService.getAll();

					$timeout( function(){
						busyIndicator.hide();
						},200
					);
					busyIndicator.hide();
				}

				$scope.errorMsg = "";

				$timeout( function(){
					WL.Logger.debug("HomeController in Time out final :: Oculta loading... ");
					
					busyIndicator.hide();
				},100);
					
			})
			.fail(function (errorObject) {
				WL.Logger.ctx({ pretty: true }).debug(errorObject);
				$scope.errorMsg = "No fue posible cargar el banner";
				$scope.jsonHomeBanner = [];
				$scope.jsonHomeBanner = HomeService.getAll();
				WL.Logger.debug("HomeController Error al consultar colecci?n HOME_BANNER, jsonHomeBanner.length:: " +$scope.jsonHomeBanner.length);

				$timeout( function(){
					},60
				);
				busyIndicator.hide();
			});
		}else{
			$scope.jsonHomeBanner = [];
			//$scope.jsonHomeBanner.splice(0, $scope.jsonHomeBanner.length);
			$scope.jsonHomeBanner = HomeService.getAll();
			WL.Logger.debug("HomeController of Local $scope.jsonHomeBanner.length:: " +$scope.jsonHomeBanner.length);
			
			$timeout( function(){
				busyIndicator.hide();
			},60);
		}
		
	};
	
	$scope.onSwipe = function () {
		$timeout( function(){
				WL.Logger.debug("HomeController onSwipe ......................... " +$ionicSlideBoxDelegate.currentIndex());
			},0
		);
	};

	function callObtenContenidos() {
        WL.Logger.debug("InitCtrl callObtenContenidos obtnerContenidois:: "+$scope.obtnerContenido);
        if ( $scope.obtnerContenido ){
        	//$scope.obtnerContenido = false;
            $scope.getBanner();
        }
    }
	
	var estaSincronizado = false;
	var intervalo2 = 200; //intervalo de tiempo en milisegundos
	var numrepit2 = 2;
	$scope.enlinea = true;
	
	function getNetworkInfoCallback(info) {
		if (info.isNetworkConnected == true || info.isNetworkConnected == 'true') {
		$scope.enlinea = true;
		ContentProvider.runSincronizaColeccion(0);
		}else{
		$scope.enlinea = false;
		}
	}
	
	$scope.getBanner();
    
    function callGetState() {
    	WL.Logger.debug('GetState :: '+ContentProvider.getStateSinc() );
    	if(ContentProvider.getStateSinc != "EJECUTANDO"){
    		if (estaSincronizado){
		    	WL.Logger.debug('callGetState... Esta sincronizado llama getCategorias ');
		    	busyIndicator = new WL.BusyIndicator("content", { text: "Actualizanddo...", boxLength: 182 });
		    	busyIndicator.show();
		    	$scope.getBanner();
		    	estaSincronizado = false;
		    	// Donde refrescar el View?
		    	//alert('DesctiendaController 1... ');
    		}else{
    			//alert('DesctiendaController 2... ');
		    	if($scope.enlinea == true){
		    	//ContentProvider.runSincronizaColeccion(5);
		    	WL.Device.getNetworkInfo(getNetworkInfoCallback);
		    	WL.Logger.debug('Invoca a ContentProvider... En espera la sincronizacion de contenido ');
		    	}
		    estaSincronizado = true;
    	//alert('DesctiendaController 3... ');
    		}
    	}else {
	    	WL.Logger.debug('callGetState Esperar Que pasos seguen aqui? :: ');
	    	//alert('DesctiendaController 4... ');
    	}
    }


    $scope.conection = function (num) {

    	var consultaConnection = connection();

	   	if(consultaConnection == 'No network connection'){
	    WL.SimpleDialog.show("Advertencia", "No tienes acceso a internet, verifica tu conexión e inténtalo más tarde.", [ { text: "Aceptar", handler: function(){} } ]);
	   	} else {
	           switch (num) {
	           	case 1:
	           	var ref = window.open(encodeURI('https://www3.costco.com.mx/portal/UrlMap/getUrl.jsp?index=3'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
	           	break;
	           	case 2:
	           	var ref = window.open(encodeURI('https://www3.costco.com.mx/portal/UrlMap/getUrl.jsp?index=1'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
	           	break;
	           	case 3:
	           	var ref = window.open(encodeURI('https://www3.costco.com.mx/portal/UrlMap/getUrl.jsp?index=2'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
	           	break;
	           	case 4:
	           	var ref = window.open(encodeURI('https://www3.costco.com.mx/portal/UrlMap/getUrl.jsp?index=4'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
	           	break;
	           	default:
	           	console.log("Opción no válida");
	           	break;
	        }
	   }
	}
	
	$scope.conection1 = function () {
		
		var consultaConnection = connection();

	    if(consultaConnection == 'No network connection'){
	    	WL.SimpleDialog.show("Advertencia", "No tienes acceso a internet, verifica tu conexión e inténtalo más tarde.", [ { text: "Aceptar", handler: function(){} } ]);
	    }else {
            var ref = window.open(encodeURI('https://www3.costco.com.mx/portal/CuponeraMovil.jsp'), '_blank', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
	    }
	}

	$scope.conection2 = function () {
		
		var consultaConnection = connection();

	    if(consultaConnection == 'No network connection'){
	    	WL.SimpleDialog.show("Advertencia", "No tienes acceso a internet, verifica tu conexión e inténtalo más tarde.", [ { text: "Aceptar", handler: function(){} } ]);
	    }else {
            var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
            
            if((deviceType == "iPad") || (deviceType == "iPhone")){
                var ref = window.open(encodeURI('https://m.costco.com.mx'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
            } else {
                var ref = window.open(encodeURI('https://m.costco.com.mx'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
            }
	    }
	}

	$scope.conection3 = function () {
		
		var consultaConnection = connection();

	    if(consultaConnection == 'No network connection'){
	    	WL.SimpleDialog.show("Advertencia", "No tienes acceso a internet, verifica tu conexión e inténtalo más tarde.", [ { text: "Aceptar", handler: function(){} } ]);
	    }else {
	    	//document.addEventListener("deviceready", onDeviceReady3, false);
            var ref = window.open(encodeURI('https://www3.costco.com.mx/wps/portal/publico/FacturaMovil/'), '_blank', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
	    }
	}

	$scope.checkLog = function(dir){
        busyIndicator.show();
        var dataServices;
        $scope.datosServicio;
        var uuid;
        var key;
        var value;
            
        dataServices = localStorage.getItem('dataService') || '';

        if (dataServices.length != 0) {
            $scope.datosServicio = JSON.parse(dataServices);
        }
        
        if (dataServices == '' || $scope.datosServicio.validated != 'OK') {
            console.log('No se ha ingresado');
            $state.go('app.login');
            busyIndicator.hide();
        } else {
            var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
        
            if((deviceType == "iPad") || (deviceType == "iPhone")){
                // Ambiente iPhone
                key = 'uuid';
                var touchIdMessage = 'TouchID Message'

                var win = function(value) {
                    console.log("GET SUCCESS - Key: " + key + " Value: " + value);
                    uuid = value;
                    //verificaLogin();
                    consultaLogin.consulta(uuid, dir);
                };
                var fail = function(error) {
                        console.log("GET FAIL - Key: " + key + " Error: " + error);
                };
                //Keychain.get(win, fail, key, touchIdMessage);
                if(cordova != undefined){
                    cordova.exec(win, fail, "Keychain", "get", [key, touchIdMessage]);
                }else{
                    WL.Logger.debug('Key Chain :: Es ambiente Web no existe cordova.... ');
                }
            } else {
                // Ambiente Android
                uuid = device.uuid;
                console.log("device " + uuid);
                //verificaLogin();
                consultaLogin.consulta(uuid, dir);
            }
        }
        //busyIndicator.hide();
    }

	$scope.estadoDeFacturacion = function(){
		busyIndicator.show();
		
		var invocationData = getEstadoFacturacion();

        WL.Client.invokeProcedure(invocationData,{
            onSuccess : function(result) {
            	busyIndicator.hide();                
                var httpStatusCode = result.status;
                if (200 == httpStatusCode) {
                    var invocationResult = result.invocationResult;
                    var isSuccessful = invocationResult.isSuccessful;
                    if (true == isSuccessful) {                            
                        console.log('datos ya validados::' + JSON.stringify(invocationResult));
                        if (invocationResult.estado == 'offline') {
                        	facturacionService.cambiaEstadoFacturacion(0);
                        	$state.go('app.facturacion');
                        }else{
                        	facturacionService.cambiaEstadoFacturacion(1);
                        	$state.go('app.facturacion');
                        }
                    } 
                    else {                        
                        console.log('No es successful');
                        $state.go('app.facturacion');
                    }                    
                } 
                else {
                    console.log('Error de servidor != 200');
                    $state.go('app.facturacion');
                }
            },
            onFailure : function() {
            	busyIndicator.hide();
                console.log('sin respuesta del servidor');
                WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                //WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
            }
        });
	}

	$ionicPlatform.registerBackButtonAction(function () {
            console.log('ButtonBack oprimido en home.');
            if ($state.current.name=="app.home"){
	      navigator.app.exitApp();
	    } else {
	      navigator.app.backHistory();
	    }
  	}, 100);

			
})
;