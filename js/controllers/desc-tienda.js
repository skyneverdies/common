'use strict';

angular.module('starter.desctienda', [])

.controller('DesctiendaController', function ($scope, $state, $stateParams, $timeout, 
											$ionicScrollDelegate, busyIndicator, $interval,
											$ionicBackdrop, $ionicModal, CategoriasService, 
											DataLocalService, $window , $ionicSlideBoxDelegate, 
											$mdBottomSheet, $mdToast, ContentProvider, checkEnter, downloadInProcess) {
	$scope.$on('$ionicView.beforeEnter',function(){
		WL.Logger.debug('DesctiendaController ionicView.beforeEnter :: ');
	}); 
	
	var CATEGORIAS_COLLECTION_NAME = 'categoriasdesc';
	var DESCBANNER_COLLECTION_NAME = 'descbanner';

	// Set Header
	$scope.$parent.showHeader();
	$scope.$parent.clearFabs();
	$scope.isExpanded = false;
	$scope.$parent.setExpanded(false);
	$scope.$parent.setHeaderFab(false);
	$scope.cuponesXcategoria = {};
	$scope.columcss = '';
	$scope.colum_line_css = 'col-5';
	$scope.catId = 'AB';
	$scope.imagentoZoom = '';
	$scope.zoomMin = 1;
	$scope.timeOutFind = 0;
	$scope.jsonSliderOptions = [];
	$scope.selectedIndex = 0;
	$scope.items;
	$scope.items2;
	$scope.checkPrimera = [];
	var arregloImagenes;
	var arregloImagenesService;
	var arregloArchivoService;
	var tempVigencia = localStorage.getItem('localStorageVersionador') || '';
	if (tempVigencia == '') {
		console.log('localStorageVersionador vacio');
	} else {
		var	vigencia = JSON.parse(tempVigencia);
		$scope.myStyleVigencia = 	{
		    "background-color" 	: 	vigencia[0].color,
		    "margin-top"		: 	"1vh"
		}
	}
				  	
	$scope.vista1 = function (){

		busyIndicator.show();
			$timeout( function(){
				busyIndicator.hide();
				},1000);

		document.addEventListener("deviceready", function(){
	       	$(".cupon").attr({"id": "cupon1"});
	    });
		document.addEventListener("deviceready", function(){
	       	$(".grid1").attr({"src": "images/desctienda/grid_1_on.png"});
	    });
	    document.addEventListener("deviceready", function(){
	       	$(".grid2").attr({"src": "images/desctienda/grid_2_off.png"});
	    });
	    document.addEventListener("deviceready", function(){
	       	$(".grid3").attr({"src": "images/desctienda/grid_3_off.png"});
	    });
	}

	$scope.vista2 = function (){

		busyIndicator.show();
			$timeout( function(){
				busyIndicator.hide();
				},1000);

		document.addEventListener("deviceready", function(){
	       	$(".cupon").attr({"id": "cupon2"});
	    });
		document.addEventListener("deviceready", function(){
	       	$(".grid1").attr({"src": "images/desctienda/grid_1_off.png"});
	    });
	    document.addEventListener("deviceready", function(){
	       	$(".grid2").attr({"src": "images/desctienda/grid_2_on.png"});
	    });
	    document.addEventListener("deviceready", function(){
	       	$(".grid3").attr({"src": "images/desctienda/grid_3_off.png"});
	    });
	}

	$scope.vista3 = function (){
		busyIndicator.show();
			$timeout( function(){
				busyIndicator.hide();
				},1000);

		document.addEventListener("deviceready", function(){
	       	$(".cupon").attr({"id": "cupon3"});
	    });
		document.addEventListener("deviceready", function(){
	       	$(".grid1").attr({"src": "images/desctienda/grid_1_off.png"});
	    });
	    document.addEventListener("deviceready", function(){
	       	$(".grid2").attr({"src": "images/desctienda/grid_2_off.png"});
	    });
	    document.addEventListener("deviceready", function(){
	       	$(".grid3").attr({"src": "images/desctienda/grid_3_on.png"});
	    });
	}

	document.addEventListener("deviceready", onDevideReady, false);

	function onDevideReady() {

		busyIndicator.show();
		$timeout( function(){
			busyIndicator.hide();
			},1000);

		if (downloadInProcess.getTotal() != 0) {
			WL.SimpleDialog.show("Advertencia", "Estamos descargando tus cupones, intenta en un momento más.", [ { text: "Aceptar", handler: function(){} } ]);
		}

		var temp = localStorage.getItem('localStorageCupones') || '';

		if (temp == '') {
			console.log('entro al if temp2');
			$scope.conexion = 0;
			$scope.jsonSliderOptions = CategoriasService.getAll();
		} else {
			console.log('entro al else temp2');
			$scope.items = JSON.parse(temp);
			if ($scope.items.length == 1) {
				$scope.conexion = 2;
				WL.SimpleDialog.show("Advertencia", "Por el momento no tenemos cupones disponibles para esta fecha.", [ { text: "Aceptar", handler: function(){} } ]);
			} else {
				$scope.vigencia = vigencia[0].vigencia;
				$scope.conexion = 1;
	    		$scope.primera = 1;
			}
		}
	}

	$scope.showImages = function(index) {
		$scope.imagentoZoom = $scope.items[index].raw;
		$scope.showModal('views/cupones/gallery-zoomview.html');
	};

	$scope.showImages2 = function(index) {
		$scope.imagentoZoom = $scope.items2[index].raw;
		$scope.showModal('views/cupones/gallery-zoomview.html');
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

});