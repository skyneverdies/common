/* global angular, document, window */
'use strict';

angular.module('starter.sucursales', [])


  .controller('InitCtrl', function ($scope, $stateParams, $timeout, $interval,
                              sucursalesService, $state, busyIndicator) {


    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $scope.totalSucursales = sucursalesService.getTotal();
    $scope.botonMas = true;
    $scope.obtnerTodasSuc = true;
    $scope.jsonObjSuc = [];

    var todas = sucursalesService.getAll();
    var paramMostrar = 100;
    var listaSucursalesPorMostrar = [];
    var options = {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 0
    };

    //WL.Logger.debug("InitCtrl listando sucursales:" + paramMostrar + " de:" + $scope.totalSucursales);
    WL.Device.getNetworkInfo(getNetworkInfoCallback);
    
    function callTodasSucursales() {
        //WL.Logger.debug("InitCtrl listando sucursales is:: "+$scope.obtnerTodasSuc);
        if ( $scope.obtnerTodasSuc ){
              $scope.obtnerTodasSuc = false;
              listaSucursalesPorMostrar = todas;
              $scope.mostrarDistancia = false;
              $scope.jsonObjSuc = sucursalesService.getByNumber(paramMostrar, listaSucursalesPorMostrar);
              busyIndicator.hide();
        }
    }

    function getNetworkInfoCallback(info) {
        busyIndicator = new WL.BusyIndicator("content", { text: "Buscando ubicación...", boxLength: 250 });
        busyIndicator.show();

        if (info.isNetworkConnected == true || info.isNetworkConnected == 'true') {
            var intervalo = 10000; //intervalo de tiempo en milisegundos
            var numrepit = 2;
            $interval(callTodasSucursales, intervalo, numrepit);
            //WL.Logger.debug("InitCtrl getNetworkInfoCallback:: "+JSON.stringify(info));
            navigator.geolocation.getCurrentPosition(function (pos, options) {
                try {
                    $scope.obtnerTodasSuc = false;
                    WL.Logger.debug("Inicio por ubicacion ");
                    //alert("getCurrentPosition a: " + pos.coords.latitude);
                    $scope.mostrarDistancia = true;
                    $scope.buscarSucursalCercana(pos.coords.latitude, pos.coords.longitude);
                    busyIndicator.hide();
                    $timeout( function(){ },200
                    );
                } catch (error) {
                    WL.Logger.debug("Error en InitCtrl. Al intentar obtener las sucursales. ");
                    listaSucursalesPorMostrar = todas;
                    $scope.mostrarDistancia = false;
                    $scope.jsonObjSuc = sucursalesService.getByNumber(paramMostrar, listaSucursalesPorMostrar);
                    $scope.obtnerTodasSuc = false;
                    busyIndicator.hide();
                    $timeout( function(){ },100
                    );
                }

            }, 
            function (error) {
                busyIndicator.hide();
                WL.Logger.debug("Error en InitCtrl. Al intentar obtener la posición con geolocation.getCurrentPosition.");
                listaSucursalesPorMostrar = todas;
                $scope.mostrarDistancia = false;
                $scope.jsonObjSuc = sucursalesService.getByNumber(paramMostrar, listaSucursalesPorMostrar);
                $scope.obtnerTodasSuc = false;
                $timeout( function(){ 
                    return;
                  },100
                );
            }
          ); //Fin getCurrentPosition
    
        }else{
            WL.Logger.debug('Dispositivo Fuera de linea: ');
            //WL.SimpleDialog.show("Advertencia", "No cuenta con señal a Internet, la información mostrada puede no ser la más reciente ", [ { text: "Aceptar", handler: function(){} } ]);
            listaSucursalesPorMostrar = todas;
            $scope.mostrarDistancia = false;
            $scope.jsonObjSuc = sucursalesService.getByNumber(paramMostrar, listaSucursalesPorMostrar);
            $scope.obtnerTodasSuc = false;
            busyIndicator.hide();
        }
    }
    
    $scope.rad = function (x) { return x * Math.PI / 180; };

    $scope.buscarSucursalCercana = function (lat, lng) {
      //WL.Logger.debug("buscarSucursalCercana a: " + lat + " - " + lng);
      //alert("buscarSucursalCercana a: " + lat + " - " + lng);
      var R = 6371; // radius of earth in km
      var distances = [];
      var closest = -1;

      for (var i = 0; i < todas.length; i++) {
        var mlat = todas[i].latitud;
        var mlng = todas[i].longitud;
        var dLat = $scope.rad(mlat - lat);
        var dLong = $scope.rad(mlng - lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos($scope.rad(lat)) * Math.cos($scope.rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        todas[i].distancia = $scope.roundNumber(d);
        distances[i] = { dis: todas[i].distancia, id: todas[i].id, name: todas[i].nombre };
        if (closest == -1 || d < distances[closest].dis) {
          closest = i;
        }
     }

     var arraySort = distances.sort($scope.SortByDistance);
     WL.Logger.debug("Sucursales ordenadas por distancia ");
     var sucursalesOrdenadas = [];

     for (var s = 0; s < arraySort.length; s++) {
        var temp = sucursalesService.getById(arraySort[s].id);
        temp.distancia = arraySort[s].dis;
        sucursalesOrdenadas.push(temp);
     }

      /*
       var sucursalesOrdenadas=[];
       var sucursalesOrdenadas=todas.sort(ObjectSortByDistance);
       */

      // Actualizar objeto ordenado.
      //WL.Logger.debug("Objeto sucursales generado... " + sucursalesOrdenadas.length);
      listaSucursalesPorMostrar = sucursalesOrdenadas;
      $scope.jsonObjSuc = sucursalesService.getByNumber(paramMostrar, listaSucursalesPorMostrar);
      //WL.Logger.debug("Objeto $scope.jsonObjSuc length... " + $scope.jsonObjSuc.length);

      $timeout( function(){
          busyIndicator.hide();
        },300
      );
      
      //alert("La sucursal mas cercana es : " + todas[closest].nombre);
    };
    
    $scope.roundNumber = function (val) {
      var parsed = parseFloat(val, 10);
      if (parsed !== parsed) { return null; } // check for NaN
      var rounded = Math.round(parsed * 100) / 100;
      return rounded;
    };

    $scope.ObjectSortByDistance = function (a, b) {
      var aName = a.distancia;
      var bName = b.distancia;
      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    };

    $scope.SortByDistance = function (a, b) {
      var aName = a.dis;
      var bName = b.dis;
      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    };

    $scope.addMoreSuc = function () {
      paramMostrar += 5;
      $scope.jsonObjSuc = sucursalesService.getByNumber(paramMostrar, listaSucursalesPorMostrar);
      if (paramMostrar >= $scope.totalSucursales) {
        $scope.botonMas = false;
      }
    };

    $scope.search = function () {
      $state.go('search');
    };


  })


  .controller('SearchCtrl', function ($scope, sucursalesService, $state,
    $timeout) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    //$ionicNavBarDelegate.showBackButton(true);

    $scope.opciones = {
      val: '10'
    };
    //$scope.direccion="54090";
    $scope.opcionBusqueda = "1";

    $scope.borrar = function () {
      WL.Logger.debug("borrar");
      $scope.direccion = "";
    };

    $scope.validar2 = function (uno, dos, tres) {
      WL.Logger.debug("Validando datos Max " + uno + " - Dir " + dos + " - Opc " + tres);
    };

    $scope.validar = function () {
      WL.Logger.debug("Validando datos Max " + $scope.opciones.val + " - Dir " + $scope.direccion + " - Opc " + $scope.opcionBusqueda);

      if ($scope.opcionBusqueda == '2' && !$scope.direccion)
        alert("Falta completar la información");
      else
        $state.go('list', { total: $scope.opciones.val, direccion: $scope.direccion, busqueda: $scope.opcionBusqueda });

      return;
    };

  })


  .controller('ListCtrl', function ($scope, $stateParams, sucursalesService, $rootScope,
    $timeout, busyIndicator) {

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    //$ionicNavBarDelegate.showBackButton(true);

    $scope.totalSucursales = sucursalesService.getTotal();
    $scope.botonMas = true;

    var todas = sucursalesService.getAll();
    var paramDireccion = $stateParams.direccion;
    var paramMostrar = eval($stateParams.total);
    var paramBusqueda = $stateParams.busqueda;
    var listaSucursalesPorMostrar = [];
    $scope.mostrarDistancia = false;
    $scope.jsonObjSuc = [];

    //WL.Logger.debug("direccion " + paramDireccion + " Opcion " + paramBusqueda + " mostrar " + paramMostrar);
    //WL.Logger.debug("listando sucursales de:" + $scope.totalSucursales);

    /*
     $scope.loading = $ionicLoading.show({
     content: 'Buscando ubicación...',
     showBackdrop: false
     });
     */
    busyIndicator = new WL.BusyIndicator("content", { text: "Buscando ubicación...", boxLength: 250 });
    busyIndicator.show();

    if (paramBusqueda == 1) {
      WL.Logger.debug("Busqueda General");
      //WL.Logger.debug("todas son:: " + todas.length);
      listaSucursalesPorMostrar = todas;

      //WL.Logger.debug("borrando el objeto " + listaSucursalesPorMostrar[0].distancia);
      $scope.jsonObjSuc = sucursalesService.getByNumber(paramMostrar, listaSucursalesPorMostrar);
      //$ionicLoading.hide();
      busyIndicator.hide();
    }
    else {
      if (paramBusqueda == 2) {
        WL.Logger.debug("Busqueda por direccion");
        $scope.mostrarDistancia = true;
        paramDireccion += ",MX";
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': paramDireccion }, function (results, status) {
          //WL.Logger.debug("Estatus: " + status);
          if (status == 'OK') {
            var markerOptions = { position: results[0].geometry.location };
            var markerG = new google.maps.Marker(markerOptions);
            /*
            $rootScope.marker = markerG;
            $rootScope.direccion = paramDireccion; */
            $scope.marker = markerG;
            $scope.direccion = paramDireccion;

            buscarSucursalCercana(markerG.getPosition().lat(), markerG.getPosition().lng());
          } else {
            alert("Geocoding no tuvo éxito debido a: " + status);
          }
        });
      }
      else {
        WL.Logger.debug("Busqueda por ubicacion ");
        $scope.mostrarDistancia = true;

        $scope.rad = function (x) { return x * Math.PI / 180; };

        $scope.buscarSucursalCercana = function (lat, lng) {
          WL.Logger.debug("buscarSucursalCercana a: " + lat + " - " + lng);

          var R = 6371; // radius of earth in km
          var distances = [];
          var closest = -1;

          for (var i = 0; i < todas.length; i++) {
            var mlat = todas[i].latitud;
            var mlng = todas[i].longitud;
            var dLat = $scope.rad(mlat - lat);
            var dLong = $scope.rad(mlng - lng);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos($scope.rad(lat)) * Math.cos($scope.rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            todas[i].distancia = $scope.roundNumber(d);
            distances[i] = { dis: todas[i].distancia, id: todas[i].id, name: todas[i].nombre };
            if (closest == -1 || d < distances[closest].dis) {
              closest = i;
            }
          }

          var arraySort = distances.sort($scope.SortByDistance);
          WL.Logger.debug("Sucursales ordenadas por distancia ");
          var sucursalesOrdenadas = [];
          for (var s = 0; s < arraySort.length; s++) {
            var temp = sucursalesService.getById(arraySort[s].id);
            temp.distancia = arraySort[s].dis;
            sucursalesOrdenadas.push(temp);
          }

          /*
           var sucursalesOrdenadas=[];
           var sucursalesOrdenadas=todas.sort(ObjectSortByDistance);
           */

          // Actualizar objeto ordenado.
          WL.Logger.debug("Objeto sucursales generado... " + sucursalesOrdenadas.length);
          listaSucursalesPorMostrar = sucursalesOrdenadas;
          $scope.jsonObjSuc = sucursalesService.getByNumber(paramMostrar, listaSucursalesPorMostrar);
          busyIndicator.hide();
          return;
        };

        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(function (pos, options) {
          WL.Logger.debug("Posicion actual obtenida... " + pos.coords.latitude + "," + pos.coords.longitude);
          $scope.buscarSucursalCercana(pos.coords.latitude, pos.coords.longitude);
        }, function (error) {
          console.warn('ERROR(' + error.code + '): ' + error.message);
          var mensaje = error.message;
          if (error.code == 2)
            mensaje = "La licalización no está activada.";
          alert('No se pudo obtener la ubiación: [' + error.code + ']:' + mensaje);
          //$ionicLoading.hide();
          busyIndicator.hide();
          return;
        });
      }
    }

    $scope.roundNumber = function (val) {
      var parsed = parseFloat(val, 10);
      if (parsed !== parsed) { return null; } // check for NaN
      var rounded = Math.round(parsed * 100) / 100;
      return rounded;
    };

    $scope.ObjectSortByDistance = function (a, b) {
      var aName = a.distancia;
      var bName = b.distancia;
      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    };

    $scope.SortByDistance = function (a, b) {
      var aName = a.dis;
      var bName = b.dis;
      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    };

    $scope.addMoreSuc = function () {
      paramMostrar += eval($stateParams.total);
      WL.Logger.debug("Mostrar mas sucursales paramMostrar: " + paramMostrar);
      $scope.jsonObjSuc = sucursalesService.getByNumber(paramMostrar, listaSucursalesPorMostrar);
      if (paramMostrar >= $scope.totalSucursales) {
        $scope.botonMas = false;
      }
    };

  })


  .controller('ViewCtrl', function ($scope, $compile, $stateParams, sucursalesService, $rootScope, $interval,
                                    $ionicPopup, $timeout, busyIndicator, DataLocalService) {
      // Set Header
      $scope.$parent.showHeader();
      $scope.$parent.clearFabs();
      $scope.isExpanded = false;
      $scope.$parent.setExpanded(false);
      $scope.$parent.setHeaderFab(false);
      $scope.sucursal = $stateParams.idSucursal;
      
      if( $scope.sucursal != undefined && $scope.sucursal != null && $scope.sucursal != "") {
        WL.Logger.debug("ViewCtrl scope.sucursal:: "+$scope.sucursal);
        DataLocalService.data.idSucursalSelect = $scope.sucursal;
      }else{
        $scope.sucursal = DataLocalService.data.idSucursalSelect;
      }
      WL.Logger.debug("ViewCtrl Asigned Suc:: " + $scope.sucursal);
      
      $scope.detalle = sucursalesService.getById($scope.sucursal);
      
      $scope.servicios = {
        "REVELADO_DIGITAL": { etiqueta: "Revelado digital", icon: "ion-images" },
        "CHOCOLATERIA": { etiqueta: "Chocolatería", icon: "ion-bug" },
        "SERVICIO_DELI": { etiqueta: "Servicio Deli", icon: "ion-android-hand" },
        "ENTREGA_NEGOCIO": { etiqueta: "Entrega a su Negocio", icon: "ion-ios7-home" },
        "CENTRO_LLANTERO": { etiqueta: "Centro Llantero", icon: "ion-model-s" },
        "AYUDA_AUDITIVA": { etiqueta: "Centro de Ayuda Auditiva", icon: "ion-volume-high" },
        "FRUTAS_VERDURAS": { etiqueta: "Frutas y Verduras", icon: "ion-ios-nutrition" },
        "CARNICERIA": { etiqueta: "Carnicería", icon: "ion-fork" },
        "PANADERIA": { etiqueta: "Panadería", icon: "ion-cloud" },
        "FUENTE_SODAS": { etiqueta: "Fuente de Sodas", icon: "ion-android-restaurant" },
        "FARMACIA": { etiqueta: "Farmacia", icon: "ion-medkit" },
        "OPTICA": { etiqueta: "Óptica", icon: "ion-eye" },
        "FLORERIA": { etiqueta: "Florería", icon: "ion-ios-rose" }
      }

      var posicion = false;
      var icon = "images/sucursales/logosucursales_01.png";
      
      // Por default ocultamos la seccion de indicaciones:
      //document.getElementsByTagName("ion-item")[0].style.display = 'none';
      document.getElementById("indicaciones").style.display = 'none';

      WL.Logger.debug("Detalle: " + $scope.detalle.nombre);
      if ($rootScope.marker) {
        WL.Logger.debug("Root " + $rootScope.marker.getPosition().lat());
        WL.Logger.debug("Direccion " + $rootScope.direccion);
      }else if ($scope.marker){
         WL.Logger.debug("scope " + $scope.marker.getPosition().lat());
         WL.Logger.debug("Direccion " + $scope.direccion);
      }

      var LatLngList = [];
      var misCoordenadas;
      var map;
      var mapOptions;
      $scope.ocultaMapa = true;

      //WL.Logger.debug("init ViewCtrl");

      WL.Device.getNetworkInfo(getNetworkInfoCallback);

      function getNetworkInfoCallback(info) {

          if (info.isNetworkConnected == true || info.isNetworkConnected == 'true') {
              //WL.Logger.debug("InitCtrl getNetworkInfoCallback:: "+JSON.stringify(info));
              $scope.iniciar();

          }else{
              busyIndicator.hide();
              document.getElementById('map').style.display = "none";
              navigator.globalization.getPreferredLanguage(
                  function (language) {
                    var title     = 'Advertencia';
                    var template  = 'No cuenta con señal a Internet, la información mostrada puede no ser la más reciente.';
                    var btn1      = 'Aceptar';
                    if (language.value == 'en-US' || language.value == 'en-MX' 
                      || language.value == 'english' || language.value == 'ingles' ){
                        
                      title     = "Warning";
                      template  = "No signal Internet, the information shown may not be the most recent.";
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
      }

      $scope.mapa = function () {
        var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
        if(deviceType == "iPad" || deviceType == "iPhone"){
            var ref = window.open(encodeURI('http://maps.apple.com/?q=' + $scope.detalle.latitud + ',' + $scope.detalle.longitud), '_system');
        } else {
            var ref = window.open(encodeURI('http://maps.google.com/?q=' + $scope.detalle.latitud + ',' + $scope.detalle.longitud), '_system');
        }
      }

      function callOcultaMapa() {
          //alert("InitCtrl listando sucursales is:: "+$scope.ocultaMapa);
          if ( $scope.ocultaMapa ){
                $scope.ocultaMapa = false;
                document.getElementById("indicaciones").style.display = 'none';
          }
      }
      
      $scope.iniciar = function () {

      WL.Logger.debug("init map...");
      busyIndicator = new WL.BusyIndicator("content", { text: "Buscando ubicación...", boxLength: 252 });
      busyIndicator.show();

        try{
            /*19.419444, -99.145556
            buscarSucursalCercana a: 19.40225021081805 - -99.27494546819965
            */
            
            var myLatlng = new google.maps.LatLng($scope.detalle.latitud, $scope.detalle.longitud);
              LatLngList.push(new google.maps.LatLng($scope.detalle.latitud, $scope.detalle.longitud));

              if(google){
                mapOptions = {
                  center: myLatlng,
                  zoom: 15,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  disableDefaultUI: true
                };

                map = new google.maps.Map(document.getElementById("map"), mapOptions);

                //Marker + infowindow + angularjs compiled ng-clic
                var cm = "<br>Cómo llegar aquí?";
                var contentString = "<div><a ng-click='clickTest()'>" + $scope.detalle.nombre + "</a></div>";
                var compiled = $compile(contentString)($scope);


                var infowindow = new google.maps.InfoWindow({
                  content: compiled[0]
                });

                var marker = new google.maps.Marker({
                  position: myLatlng,
                  map: map,
                  icon: icon,
                  title: $scope.detalle.nombre
                });

                google.maps.event.addListener(marker, 'click', function () {
                  infowindow.open(map, marker);
                });
                
                $scope.map = map;
                $scope.centerOnMe();
              }else{
                  document.getElementById('map').style.display = "none";
                  navigator.globalization.getPreferredLanguage(
                    function (language) {
                      var title     = 'Advertencia';
                      var template  = 'No fue posible obtener el mapa de localización. Asegurate de tener activado el servicio de localización y vuelve a intentarlo.';
                      var btn1      = 'Aceptar';
                      if (language.value == 'en-US' || language.value == 'en-MX' 
                        || language.value == 'english' || language.value == 'ingles' ){
                          
                        title     = "Warning";
                        template  = "It was not possible to obtain the location map. Make sure you have activated the location service and try again.";
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
              

        } catch (error) {
              WL.Logger.debug("Error. No fue posible optener el mapa de ubicación. " + error.message);
              busyIndicator.hide();
        }
        
      };


      //google.maps.event.addDomListener(window, 'load', initialize);

      var bounds;

      $scope.centerOnMe = function () {
        WL.Logger.debug("In function centerOnMe");

        var intervalo = 6000; //intervalo de tiempo en milisegundos
        var numrepit = 2;
        $interval(callTodasSucursales, intervalo, numrepit);
        
        if (!$scope.map) {
          //busyIndicator.hide();
          WL.Logger.debug("No se encuentra el mapa");
          return;
        };
        
        /*
        if (posicion) {
        $scope.map.fitBounds(bounds);
        return;
        } else {
        WL.Logger.debug("No se pudo encontrar la posición");
        }*/
        //WL.Logger.debug("Before getCurrentPosition...");
        var options = {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 0
        };
        
        navigator.geolocation.getCurrentPosition(function (pos, options) {
            WL.Logger.debug("centerOnMe getCurrentPosition Posicion: " +JSON.stringify(pos));
          try {
            $scope.ocultaMapa = false;
            posicion = true;
            misCoordenadas = pos;
            var myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            $scope.map.setCenter(myLatlng);

            var markerA = new google.maps.Marker({
              position: myLatlng,
              map: $scope.map,
              title: 'Mi posición actual'
            });

            /* centrar marcas en mapa */
            bounds = new google.maps.LatLngBounds();
            LatLngList.push(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
              bounds.extend(LatLngList[i]);
            }
            $scope.map.fitBounds(bounds);

            var contentString = "<div><a ng-click='clickTest()'>Mi posición</a></div>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({
              content: compiled[0]
            });

            google.maps.event.addListener(markerA, 'click', function () {
              infowindow.open($scope.map, markerA);
            });
            //$scope.map.setZoom(9);
            
            //$scope.clickTest();
            $timeout( function(){
              $scope.clickTest();
            },500);

          } catch (error) {
            WL.Logger.debug("Error. Al intentar obtener la posición con geolocation.getCurrentPosition:: " + error.message);
            //document.getElementsByTagName("ion-item")[0].style.display = 'none';
            busyIndicator.hide();
          }

        }, function (error) {
            var mensaje = error.message;
            //document.getElementsByTagName("ion-item")[0].style.display = 'none';
            WL.Logger.debug("Error Como llegar a... "+ mensaje);
            $scope.showConfirm();
            
            if (error.code == 2 || error.code == 1){
              mensaje = "La licalización no está activada.";
            }
            WL.Logger.debug('No se pudo obtener la ubiación: [' + error.code + ']:' + mensaje);
            busyIndicator.hide();
            
        });

      };

      $scope.clickTest = function () {
        //alert($scope.detalle.nombre);
        WL.Logger.debug("On clickTest Como llegar a... ");
        try {
          WL.Logger.debug("clickTest getCurrentPosition misCoordenadas: " +JSON.stringify(misCoordenadas));
          if (misCoordenadas) {
            // Mostrar las indicaciones de como llegar
            //document.getElementsByTagName("ion-item")[0].style.display = 'block';
            document.getElementById("indicaciones").style.display = 'block';

            WL.Logger.debug("De " + misCoordenadas.coords.latitude + " , " + misCoordenadas.coords.longitude);
            WL.Logger.debug("a " + $scope.detalle.latitud + "," + $scope.detalle.longitud);

            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();

            var request = {
              origin: misCoordenadas.coords.latitude + "," + misCoordenadas.coords.longitude,
              destination: $scope.detalle.latitud + "," + $scope.detalle.longitud,
              travelMode: google.maps.DirectionsTravelMode['DRIVING'],
              unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
              provideRouteAlternatives: false
            };

            directionsService.route(request, function (response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap($scope.map);
                directionsDisplay.setPanel(document.getElementById("panel_ruta"));
                directionsDisplay.setDirections(response);
              } else {
                alert("No existen rutas entre ambos puntos");
              }
            });

            busyIndicator.hide();

          } else {
            busyIndicator.hide();
          }
        } catch (error) {
          WL.Logger.debug("Error. No fue posible determinar la ruta de llegada a la sucursal" + error.message);
          busyIndicator.hide();
        }


      };
    
      $scope.callNativeSettings = function () {
        if(cordova != undefined){
          WL.Logger.debug('callNativeSettings... ');
          cordova.exec(nativeSettingsSuccess, nativeSettingsFailure, "NativeSettings", "open", []);
        }else{
          WL.Logger.debug('callNativeSettings :: Es ambiente Web no existe cordova.... ');
        }
          
      }

      function nativeSettingsSuccess(data) {
        WL.Logger.debug('OK :: nativeSettingsSuccess............... ');
      }

      function nativeSettingsFailure(data) {
        WL.Logger.debug("No es posible mostrar las preferencias del dispositivo.");
      }


    // A confirm dialog
    /*
    $scope.showConfirm = function() {
      WL.Logger.debug('On showConfirm');
      var confirmPopup = $ionicPopup.confirm({
        title: 'Servicio de Localización inactivo',
        okText: 'Si',
        cancelText: 'No',
        template: '¿Deséa habilitar el Servicio de Localización de su dispositivo móvil para esta aplicación?'
      });

      confirmPopup.then(function(res) {
        WL.Logger.debug('On showConfirm then');
        if(res) {      
          $scope.callNativeSettings();
        } else {
          WL.Logger.debug('Cancel');
        }
      });
    };*/
    $scope.showConfirm = function() {
      navigator.globalization.getPreferredLanguage(
        function (language) {
          var title     = 'Servicio de Localización inactivo';
          var template  = 'Para localizar la sucursal más cercana se requiere que habilite el Servicio de Localización de su dispositivo móvil.';
          var btn1      = 'Aceptar';
          var btn2      = 'Cancelar';
          if (language.value == 'en-US' || language.value == 'en-MX' 
              || language.value == 'english' || language.value == 'inglés' ){
                
              title     = 'Inactive Service Location';
              template  = 'To locate the nearest store is required to enable Service Location of your mobile device.';
              btn1      = 'Accept';
              btn2      = 'Cancel';
          }
         
          WL.SimpleDialog.show(title, template, [
            {
              text : btn1,
              handler : function() {$scope.callNativeSettings()}
            },
            {
              text : btn2,
              handler : function(){ WL.Logger.debug('cancel');}
            }
          ]);
        },
        function () {
          WL.Logger.debug("can't get language");
        }
      );
 
    };
    
  })
;
