'use strict';

angular.module('starter.menu', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $location, $interval,
                                        $state, $stateParams, $ionicScrollDelegate, ContentProvider, facturacionService, consultaLogin) {
    	//$scope.platform = ionic.Platform.platform();
    	
        // Form data for the login modal
        $scope.loginData = {};
        $scope.isExpanded = false;
        $scope.hasHeaderFabLeft = false;
        $scope.hasHeaderFabRight = false;

        /*
        var navIcons = document.getElementsByClassName('ion-navicon');
        for (var i = 0; i < navIcons.length; i++) {
            navIcons.addEventListener('click', function () {
                this.classList.toggle('active');
            });
        }*/
                    
        var path = $location.path();
        $scope.options = $scope.options || {};
        if (path.indexOf('submit') != -1){
            $scope.options.hideBackButton = true;
            //document.getElementsByClassName('ion-navicon')[0].style.display = 'none';
        }
        else{
            $scope.options.hideBackButton = false;
            //document.getElementsByClassName('ion-navicon')[0].style.display = 'block';
        }

        ////////////////////////////////////////
        // Layout Methods
        ////////////////////////////////////////

        $scope.hideNavBar = function () {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        };

        $scope.showNavBar = function () {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        };

        $scope.noHeader = function () {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }
        };
        

        $scope.setExpanded = function (bool) {
            $scope.isExpanded = bool;
        };

        $scope.setHeaderFab = function (location) {
            var hasHeaderFabLeft = false;
            var hasHeaderFabRight = false;

            switch (location) {
                case 'left':
                    hasHeaderFabLeft = true;
                    break;
                case 'right':
                    hasHeaderFabRight = true;
                    break;
            }

            $scope.hasHeaderFabLeft = hasHeaderFabLeft;
            $scope.hasHeaderFabRight = hasHeaderFabRight;
        };

        $scope.hasHeader = function () {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (!content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }

        };

        $scope.hideHeader = function () {
            $scope.hideNavBar();
            $scope.noHeader();
        };

        $scope.showHeader = function () {
            $scope.showNavBar();
            $scope.hasHeader();
        };

        $scope.clearFabs = function () {
            var fabs = document.getElementsByClassName('button-fab');
            if (fabs.length && fabs.length > 0) {
                fabs[0].remove();
            }
        };
                        
        document.addEventListener("resume", function() {
            WL.Logger.debug("***Se detuvo intervalo***");
            $interval.cancel(intervalo);
            if($state.current.name.indexOf('app') !== -1 ) {
            	WL.Logger.debug('AppCtrl ->  Resume State:: '+$state.current.name);
                
                if($state.current.name == 'app.viewDetalle' ) {
                    $state.go('app.sucursales', $stateParams, {reload: true, inherit: false});
                    //$state.reload();
                    WL.Logger.debug('Reload app.viewDetalle ...');
                    //$scope.appCtrl.resetMember();
                }
                
            }
            //$interval(callGetState, intervalo, numrepit);
            //ContentProvider.runSincronizaContenido();
        }, false);

        var time = 45000; 
        var numrepit = 1;
        var intervalo;


        document.addEventListener("pause", function() {
        	WL.Logger.debug('AppCtrl -> pause');
                //if($state.current.name.indexOf('app') !== -1 ) {
                   //WL.Logger.debug("entro al iffffffff");
            intervalo = $interval(function () {
                WL.Logger.debug("***Ejecutando intervalo***");
                WL.Device.getNetworkInfo(function (info) {
                    if(info.isNetworkConnected == true || info.isNetworkConnected == 'true'){
                        WL.Logger.debug("SI TIENE CONEXION");
                        if(ContentProvider.getStateSinc() != "EJECUTANDO"){
                           $state.go('app.home');
                           ContentProvider.runSincronizaContenido();
                       }
                    }else{
                        WL.Logger.debug("NO TIENE CONEXION");
                    }
                });
            }, time, numrepit);                
                   
                //}
           }, false
        );     

        function callGetState() {
             WL.Logger.debug('GetState :: '+ContentProvider.getStateSinc() );
        }

        $scope.conection1 = function () {
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

            if(states[networkState] == 'No network connection'){
                WL.SimpleDialog.show("Advertencia", "No tienes acceso a internet, verifica tu conexión e inténtalo más tarde.", [ { text: "Aceptar", handler: function(){} } ]);
            }else {
                var ref = window.open(encodeURI('https://www3.costco.com.mx/portal/CuponeraMovil.jsp'), '_blank', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
            }
        }

        $scope.conection2 = function () {
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

            if(states[networkState] == 'No network connection'){
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

        /*
        $scope.conection3 = function () {
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

            if(states[networkState] == 'No network connection'){
                WL.SimpleDialog.show("Advertencia", "No tienes acceso a internet, verifica tu conexión e inténtalo más tarde.", [ { text: "Aceptar", handler: function(){} } ]);
            }else {
                //document.addEventListener("deviceready", onDeviceReady3, false);
                var ref = window.open(encodeURI('https://www3.costco.com.mx/wps/portal/publico/FacturaMovil/'), '_blank', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
            }
        }
        */

        $scope.isLogin = function(){
           var dataServices;
           $scope.datosServicio;
               
           dataServices = localStorage.getItem('dataService') || '';

           if (dataServices.length != 0) {
               $scope.datosServicio = JSON.parse(dataServices);
           }
           
           if (dataServices == '' || $scope.datosServicio.validated != 'OK') {
               return false;
           } else {
               return true;
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
                        WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                        //WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
                    }                    
                } 
                else {
                    console.log('Error de servidor != 200');
                    WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
                    //WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
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
    });
