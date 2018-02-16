'use strict';

angular.module('starter.socio', [])

    .controller('SocioController', function ($scope, $stateParams, $timeout, $state, $http, $ionicModal, consultaLogin) {
        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        
        /*        
        var tempDataUser;
        var dataUser;
        tempDataUser = localStorage.getItem('dataUser') || '<empty>';
        console.log('datauser ::' + tempDataUser);
        dataUser = JSON.parse(tempDataUser);
        var nombre = dataUser.email.toLowerCase();
        var contra = dataUser.pass;
        var hash1 = dataUser.vartemp;
        $scope.profilePicture = dataUser.profilePicture;
        */
        //console.log('contra :: ' + contra);

        document.addEventListener("deviceready", function(){
            
            // var uuid = device.uuid;
            // console.log("device " + uuid);
            
            function close_accordion_section() {
                $('.accordion .accordion-section-title').removeClass('active');
                $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
            }
         
            $('.accordion-section-title').click(function(e) {
                // Grab current anchor value
                var currentAttrValue = $(this).attr('href');
         
                if($(e.target).is('.active')) {
                    close_accordion_section();
                }else {
                    close_accordion_section();
         
                    // Add active class to section title
                    $(this).addClass('active');
                    // Open up the hidden content panel
                    $('.accordion ' + currentAttrValue).slideDown(300).addClass('open'); 
                }
         
                e.preventDefault();
            });

            function close_accordion_section2() {
                 $('.accordion2 .accordion-section-title2').removeClass('active');
                 $('.accordion2 .accordion-section-content2').slideUp(300).removeClass('open');
             }

             $('.accordion-section-title2').click(function(e) {
                 // Grab current anchor value
                 var currentAttrValue = $(this).attr('href');

                 if($(e.target).is('.active')) {
                     close_accordion_section2();
                 }else {
                     close_accordion_section2();

                     // Add active class to section title
                     $(this).addClass('active');
                     // Open up the hidden content panel
                     $('.accordion2 ' + currentAttrValue).slideDown(300).addClass('open'); 
                 }

                 e.preventDefault();
            });
        });
        
        $scope.ajustes = function (){
            document.addEventListener("deviceready", function(){
                $(".opcionesAjustes").toggle(70);
            });
        }

    	var dataServices;
        $scope.datosServicio;
		
        dataServices = localStorage.getItem('dataService') || '<empty>';
        $scope.datosServicio = JSON.parse(dataServices);
        var datoMemberNumber = $scope.datosServicio.membershipNumber.toString();
        $scope.datoMemberNumber = datoMemberNumber;
        var datoExpira = $scope.datosServicio.expiry.toString();
        $scope.Expira = datoExpira;

		//console.log('los datos success son de localStorage ::' + dataServices);

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
                    var ref = window.open(encodeURI('https://wwwqa.costco.com.mx/wps/portal/publico/LoginMovil'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
                } 
                if (opc ==2) {
                    var ref = window.open(encodeURI('https://www3.costco.com.mx/wps/portal/publico/ReinicioMovil'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
                }
                if (opc ==3) {
                    var ref = window.open(encodeURI('https://wwwqa.costco.com.mx/wps/wcm/connect/publico/costcopublico/publicocostco/afiliacion/AvisoPrivacidad'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
                }
            }
        }

        $scope.cerrarSesion = function(){
            navigator.globalization.getPreferredLanguage(
            function (language) {
                var title     = 'Mi cuenta';
                var template  = '¿Cerrar sesión?';
                var btn1      = 'Aceptar';
                var btn2      = 'Cancelar';
                if (language.value == 'en-US' || language.value == 'en-MX' 
                    || language.value == 'english' || language.value == 'ingles' ){
                        
                    title     = 'My account';
                    template  = 'Close session?';
                    btn1      = 'Accept';
                    btn2      = 'Cancel';
                }
                
                WL.SimpleDialog.show(title, template, [
                    {
                        text : btn1,
                        handler : function() {
                            busyIndicator.show();
                            consultaLogin.remove();
                            busyIndicator.hide();
                            $state.go('app.login');
                        }
                    },
                    {
                        text : btn2,
                        handler : function(){                               
                            //dataServices = localStorage.getItem('dataService') || '<empty>';
                            console.log('Cancelar');                                
                    }
                    }
                ]);
                },
                function () {
                WL.Logger.debug("can't get language");
                }
            );
        }

        $scope.checkLog = function(dir){
            busyIndicator.show();
            var uuid;
            var key;
            var value;
                
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

        /*
        $scope.tomaImagen = function(){
            navigator.globalization.getPreferredLanguage(
            function (language) {
                var title     = '';
                var template  = 'Selecciona una imagen de perfil';
                var btn1      = 'Cámara';
                var btn2      = 'Galeria';
                if (language.value == 'en-US' || language.value == 'en-MX' 
                    || language.value == 'english' || language.value == 'ingles' ){
                        
                    title     = '';
                    template  = 'Pick a picture for your profile';
                    btn1      = 'Camera';
                    btn2      = 'Gallery';
                }
                
                WL.SimpleDialog.show(title, template, [
                    {
                        text : btn1,
                        handler : function() {
                            navigator.camera.getPicture(onSuccess, onFail, { quality: 10,
                                destinationType: Camera.DestinationType.FILE_URL 
                            });       
                        }
                    },
                    {
                        text : btn2,
                        handler : function(){                               
                            navigator.camera.getPicture(onSuccess, onFail, { quality: 10,
                                sourceType: Camera.PictureSourceType.PHOTOLIBRARY, 
                                allowEdit: true,
                                destinationType: Camera.DestinationType.FILE_URI
                            });                                   
                    }
                    }
                ]);
                },
                function () {
                WL.Logger.debug("can't get language");
                }
            );
        }

        // Change image source
        function onSuccess(imageData) {
            console.log('imagem ::' + imageData);
            dataUser.profilePicture = imageData;
            localStorage.setItem("dataUser", JSON.stringify(dataUser));
            var t = localStorage.getItem('dataUser') || '<empty>';
            console.log('image t ::' + t);
            $scope.profilePicture = imageData;
            $state.go($state.current, {}, {reload: true});
        }

        function onFail(message) {
            console.log('Failed because: ' + message);
        }
        */

        $ionicModal.fromTemplateUrl('modalSocios.html', {
            scope: $scope,
            animation: 'slide-in-up',
            //backdropClickToClose: true,
            hardwareBackButtonClose: true
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
    })
;