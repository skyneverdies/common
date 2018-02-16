'use strict';

angular.module('starter.generales', [])

    .controller('StaticController', function ($scope, $stateParams, $timeout) {
        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        /* Set Motion
        $timeout(function () {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        // Set Ink
        ionicMaterialInk.displayEffect();*/

        $scope.conection4 = function () {
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
                //document.addEventListener("deviceready", onDeviceReady4, false);
                var ref = window.open(encodeURI('https://portal.banamex.com.mx/solicitud_tdc_v3/index.html?surcursal=8082&canal=16&pos=75105&idproducto=920270&empresa=168&ecid=AF-SitioCostcoAfiliado-CreditCardPrivate-Costco-COA-INT-10042016-Emp168'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
            }
        }

    })
;

/*
    .controller('ActivityCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');

        $timeout(function () {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();
    })
    ;
*/