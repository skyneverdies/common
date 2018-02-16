'use strict';

angular.module('starter.membresias', [])

  .controller('MembresiasController', function ($scope, $stateParams, $timeout, $ionicModal) {
      // Set Header
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = false;
      $scope.$parent.setExpanded(false);
      $scope.$parent.setHeaderFab(false);

      // ionicMaterialInk.displayEffect();
      $scope.imagentoZoom = '';
      $scope.membresiaDataView = {};

      $scope.groups = [{id: 1, name: 'Membresía Ejecutiva', 
                        picture: 'images/membresias/membresia_ejecutiva.png', 
                        items: [], show: false },
                    { id: 2, name: 'Membresía de Negocios', 
                        picture: 'images/membresias/membresia_negocio.png', 
                        items: [], show: false },
                    {id: 3, name: 'Membresía Dorada', 
                        picture: 'images/membresias/membresia_dorada.png', 
                        items: [], show: false }];

      $scope.groups[0].items.push({
        recompensa: '2% de Recompensa sobre el total anual de sus compras.   Limitada hasta $7,500 pesos', 
        complementaria: 'Incluye Membresía Complementaria sin costo', 
        titular: 'Precio Titular: $1,100 pesos', 
        adicional1: '1a Adicional: $250 pesos', 
        adicional2: '2a Adicional: $250 pesos', 
        adicional3: '3a Adicional: $250 pesos'
      });
      $scope.groups[1].items.push({
        recompensa: 'Compras para negocio con facturación', 
        complementaria: 'Incluye Membresía Complementaria sin costo', 
        titular: 'Precio Titular: $500 pesos', 
        adicional1: '1a Adicional: $250 pesos', 
        adicional2: '2a Adicional: $250 pesos', 
        adicional3: '3a Adicional: $250 pesos'
      });
      $scope.groups[2].items.push({
        recompensa: 'Compras para el hogar', 
        complementaria: 'Incluye Membresía Complementaria sin costo', 
        titular: 'Precio Titular: $500 pesos', 
        adicional1: 'Adicional: $250 pesos', 
        adicional2: '', 
        adicional3: ''
      });

      $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
      };
      $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
      };

      $scope.showImages = function(id) {
        var index = id-1;
        $scope.name = $scope.groups[index].name;
        $scope.imagentoZoom = $scope.groups[index].picture;
        $scope.membresiaDataView = $scope.groups[index].items[0];
        $scope.showModal('views/membresias/zoomMembresia.html');
      };
      
      $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };
      
      $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove();
        $scope.imagentoZoom = "";
      };


      $scope.toggleItem= function(item) {
        if ($scope.isItemShown(item)) {
          $timeout( function(){
              $scope.shownItem = null;
            },50
          );
          
        } else {
          $timeout( function(){
              $scope.shownItem = item;
            },50
          );
          
        }
      };
      $scope.isItemShown = function(item) {
        return $scope.shownItem === item;
      };

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
                var ref = window.open(encodeURI('https://docs.google.com/gview?embedded=true&url=https://www3.costco.com.mx/portal/documentos/archivos/Contrato-06-08_Inicio_FY17.pdf'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
            }
        }

  })
;