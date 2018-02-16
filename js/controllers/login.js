'use strict';

angular.module('starter.login', [])

    .controller('LoginController', function ($scope, $stateParams, $timeout, $state, $http, $ionicPopup, checkRecargaCC) {
        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $scope.user = {};
        var uuid;
        var key;
        var value;
        var mensajeSession;

        document.addEventListener("deviceready", onDevice, false);
		      function onDevice() {
            mensajeSession = localStorage.getItem('mensajeSession') || '';
            if (mensajeSession == '') {
                WL.SimpleDialog.show('Aviso', 'Su cuenta para inicio de sesión es la misma que usa en la página de internet, si no cuenta con una presione "Crear cuenta".', [ { text: "Aceptar", handler: function(){} } ]);
                localStorage.setItem("mensajeSession", "mensajeSession");
            } else {
                console.log("No es la primera vez que entra");
            }

            var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
            
            if((deviceType == "iPad") || (deviceType == "iPhone")){
                // Ambiente iPhone
                key = 'uuid';
                var touchIdMessage = 'TouchID Message'

                var win = function(value) {
                    console.log("GET SUCCESS - Key in login: " + key + " Value: " + value);
                    if (value == null) {
                        uuid = device.uuid;
                        console.log("device " + uuid);
                        key = 'uuid';
                        value = uuid;
                        var useTouchID = false;

                        var win = function() {
                                console.log("SET SUCCESS - Key in login: " + key);
                            };
                        var fail = function(error) {
                                console.log("SET FAIL - Key in login: " + key + " Error: " + error);
                            };
                        //Keychain.set(win, fail, key, value, useTouchID);
                        if(cordova != undefined){
                            cordova.exec(win, fail, "Keychain", "set", [key, value, useTouchID]);
                        }else{
                            WL.Logger.debug('Key Chain :: Es ambiente Web no existe cordova.... ');
                        }
                    } else {
                        console.log('entro al else');
                        //uuid = device.uuid;
                        uuid = value;
                    }
                };
                var fail = function(error) {
                        console.log("GET FAIL - Key in login: " + key + " Error: " + error);
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
                console.log("device in login" + uuid);
            }
			
		    }

        //submit del boton de login para enviar el servicio
      $scope.getDatosLogin = function(){
      	var nombre = $scope.user.email.toLowerCase();
      	var tempPass = $scope.user.pass;

          var shaObj1 = new jsSHA("SHA-1", "TEXT");
          shaObj1.update(tempPass);
          var hash1 = shaObj1.getHash("B64");
          //console.log("hash1" + hash1);

          var shaObj256 = new jsSHA("SHA-256", "TEXT");
          shaObj256.update(tempPass);
          var contra = shaObj256.getHash("HEX");
          //console.log("256" + contra);
      	//console.log('http://192.168.91.94:10039/eMobile/authentication?email=' + nombre + '&password=' + contra + '&ouid=' + uuid);
      	busyIndicator.show();
          if(checkRecargaCC.getTotal() == 0){
              checkRecargaCC.addone();
              login(nombre, contra, hash1, uuid);
          } else {
              console.log('Intento enviar el login de nuevo');
          } 
      }

      function login(nombre, contra, hash1, uuid){
          //$http.get('https://wwwqa.costco.com.mx/wps/eMobile/service/authentication?email=' + nombre + '&password=' + contra + '&vartemp=' + hash1 + '&ouid=' + uuid)
          //console.log("https://"+ambiente+".costco.com.mx/wps/eMobile/service/authentication?email=");
          $http.get("https://"+ambiente+".costco.com.mx/wps/eMobile/service/authentication?email=" + nombre + "&password=" + contra + "&vartemp=" + hash1 + "&ouid=" + uuid)
          .success(function(data){
              console.log('los datos validated son::' + JSON.stringify(data.validated));
              //localStorage.setItem("dataService", JSON.stringify(data));
              busyIndicator.hide();
              if (data.validated != "OK") {  
                 switch(data.validated) {
                     case "OUID_INCORRECT":
                         $scope.loginFail = 2;
                         $scope.user.pass = '';
                         checkRecargaCC.reset();
                         $state.go('app.login');
                         console.log("ooouid incorrect");
                         break;
                     case "ENCRYPT":
                         $scope.loginFail = 3;
                         $scope.user.pass = '';
                         checkRecargaCC.reset();
                         $state.go('app.login');
                         console.log("ooouid encrypt");
                         break;
                     default:
                         $scope.loginFail = 1;
                         $scope.user.pass = '';
                         checkRecargaCC.reset();
                         $state.go('app.login');
                         console.log("ooouid ninguno de los dos");
                         break;
                 }
             } else {
                 $scope.user.pass = contra;
                 $scope.user.vartemp = hash1;
                 console.log('estos son los datos del socio ::' + JSON.stringify($scope.user));
                 localStorage.setItem("dataService", JSON.stringify(data));
                 //localStorage.setItem("dataUser", JSON.stringify($scope.user));
                  if (WL.JSONStore && WL.JSONStore.get(DATA_USER_COLLECTION_NAME) != undefined) {
                      WL.JSONStore.get(DATA_USER_COLLECTION_NAME).add($scope.user).then(function (msg) {
                          checkRecargaCC.reset();
                          $state.go('app.socio');
                      }).fail(function (errorObject) {
                          console.log('error add data ::' + JSON.stringify(errorObject));
                      });
                  } else {
                      console.log('== undefined ::');
                      WL.JSONStore.init(collections, optionsIni)
                      .then(function () {
                          //handle success
                          WL.JSONStore.get(DATA_USER_COLLECTION_NAME).add($scope.user).then(function (msg) {
                              checkRecargaCC.reset();
                              $state.go('app.socio');
                          }).fail(function (errorObject) {
                              console.log('error add data ::' + JSON.stringify(errorObject));                              
                          });
                      })
                      .fail(function (errorObject) {
                          //handle failure
                          console.log('no function');
                      });
                  }
             }
          })
          .error(function(data){
              busyIndicator.hide();
              checkRecargaCC.reset();
              WL.SimpleDialog.show("Advertencia", "No pudimos completar esta acción, inténtalo de nuevo más tarde.", [ { text: "Aceptar", handler: function(){} } ]);
              console.log('los datos error son ::' + JSON.stringify(data));
          });            
      }

      $scope.conection = function (opc) {
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
             if (opc == 1) {
                 var ref = window.open(encodeURI('https://www3.costco.com.mx/wps/portal/publico/RegistroMovil'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
             } 
             if (opc ==2) {
                 var ref = window.open(encodeURI('https://www3.costco.com.mx/wps/portal/publico/ReinicioMovil'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
             }
             if (opc ==3) {
                 var ref = window.open(encodeURI('https://www3.costco.com.mx/wps/wcm/connect/publico/costcopublico/publicocostco/afiliacion/AvisoPrivacidad'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
             }
         }
	    }

      $scope.$on('$ionicView.leave', function(){
          console.log('Reset antes de irse ::');
          checkRecargaCC.reset();
          //$timeout.cancel(time);
      });
    })
;