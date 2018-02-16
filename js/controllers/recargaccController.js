'use strict';

angular.module('starter.recargacc', ['ui.utils.masks'])

.controller('RecargaccController', function ($ionicPlatform, $scope, $state, $stateParams, $timeout, 
											$ionicScrollDelegate, busyIndicator, $interval,
											$ionicBackdrop, $ionicModal, $window , 
											$ionicSlideBoxDelegate, $mdBottomSheet, $mdToast, checkRecargaCC, $http) {

	// Set Header
	$scope.$parent.showHeader();
	
	var dataServicesTemp;
	var datosServicio;
	$scope.validacionMonto = 0;
	$scope.hideForm = 0;
	dataServicesTemp = localStorage.getItem('dataService') || '<empty>';
	datosServicio = JSON.parse(dataServicesTemp);

	//var prmOrderId = localStorage.getItem('prmOrderId') || '';
	//var prmTrxId = localStorage.getItem('prmTrxId') || '';
	var prmMembershipIPK = datosServicio.ipk;
	var prmCardNumber = datosServicio.membershipNumber;
	//var prmAmountBalance = localStorage.getItem('prmAmountBalance', prmAmountBalance);
	var fechaUltimaActualizacion = localStorage.getItem('fechaUltimaActualizacion') || '';
	var amount = localStorage.getItem('prmAmountBalanceFmt') || '';
	//var amount = localStorage.getItem('prmAmountBalance') || '';
    //console.log('este es el formato ' + amount);

    $scope.amount = amount;
    $scope.saldo = { monto: 0,
    fecha: fechaUltimaActualizacion
    };
    $scope.limite = 5000.00;
	$scope.cvv = 0;
 	$scope.dataReload = {monto : "0.00"};
 	var tempCashCard = localStorage.getItem('prmCashCardNumber') || '';
    $scope.cashCard = tempCashCard.substr(tempCashCard.length - 4);

 	var cardsTemp = localStorage.getItem('cards') || '';
 	$scope.cards = JSON.parse(cardsTemp);
 	console.log('cardsTemp en el controlador recarga :: ' + JSON.stringify($scope.cards[0].prmStatus));
 	if($scope.cards[0].prmStatus == 'N'){
 		console.log('prmStatus = N');
		$scope.hideForm = 1;
		WL.SimpleDialog.show('Advertencia', 'No cuentas con tarjetas de crédito registradas, ingresa a nuestro portal web "https://www3.costco.com.mx/" para registrar una.', [ { text: "Aceptar", handler: function(){} } ]);
 	}else{
 		console.log('Cuneta con tarjetas registradas');
 	}

 	$scope.verificarCVV = function(prmMarca){
        $scope.dataReload.cvv='';
        $scope.dataReload.cvvAmex='';
        console.log("prmIdTarjetaDigital" + prmMarca);
        if (prmMarca == 1) {
            $scope.cvv = 1;
            
        } else {
            $scope.cvv = 0;
            
        }
    }

    $scope.enviaRecarga = function(form){
    	var prmOrderId = localStorage.getItem('prmOrderId') || '';
		var prmTrxId = localStorage.getItem('prmTrxId') || '';

        // Valida limite        
        var valorMonto = parseFloat($scope.dataReload.monto);
        console.log("valorMonto : " + valorMonto);
        if (valorMonto > $scope.limite) {
                console.log("Monto mayor al limite permitido");
                $scope.validacionMonto = 1;
                //form.monto.$setValidity("tel", false);
            return false;
        }
        if (valorMonto == 0.00) {
                console.log("Monto igual a 0");
                $scope.validacionDiferenteCero = 1;
                //form.monto.$setValidity("tel", false);
            return false;
        }
                
    	busyIndicator.show();
    	console.log('se llamo enviaRecarga  ' + JSON.stringify($scope.dataReload));
    	var prmIdTarjetaDigital = $scope.dataReload.prmIdTarjetaDigital.toString();
    	var prmAmount = $scope.dataReload.monto.toString();
      	if($scope.cvv == 1){
            var prmCvc = $scope.dataReload.cvvAmex;  
        }
        else{
        	var prmCvc = $scope.dataReload.cvv;
        }
        var prmMarca = $scope.campoCards.prmMarca;
      	
      	if(checkRecargaCC.getTotal() == 0){
      		checkRecargaCC.addone();
      		enviaServicioRecarga(prmOrderId, prmTrxId, prmCardNumber, prmMembershipIPK, prmIdTarjetaDigital, prmAmount, prmCvc, prmMarca);
      	} else {
      		console.log('Intento enviar la recarga de nuevo');
      	}
    }

    function enviaServicioRecarga(prmOrderId, prmTrxId, prmCardNumber, prmMembershipIPK, prmIdTarjetaDigital, prmAmount, prmCvc, prmMarca){

    	//console.log('entro a enviaServicioRecarga');
   		//console.log('datos de servicio reload card entro envia ::' + prmOrderId + " " + prmTrxId + " " + prmMembershipIPK + " " + prmCardNumber + " " + prmIdTarjetaDigital + " " + prmAmount + " " + prmCvc + " " + prmMarca);
    	//$http.get('https://wwwqa.costco.com.mx/wps/eMobile/service/payment?prmOrderId=' + prmOrderId + '&prmTrxId=' + prmTrxId + '&prmCardNumber=' + prmCardNumber + '&prmMembershipIPK=' + prmMembershipIPK + '&prmIdTarjetaDigital=' + prmIdTarjetaDigital + '&prmAmount=' + prmAmount + '&prmCvc=' + prmCvc + '&prmMarca=' + prmMarca)
       	$http.get("https://"+ambiente+".costco.com.mx/wps/eMobile/service/payment?prmOrderId=" + prmOrderId + "&prmTrxId=" + prmTrxId + "&prmCardNumber=" + prmCardNumber + "&prmMembershipIPK=" + prmMembershipIPK + "&prmIdTarjetaDigital=" + prmIdTarjetaDigital + "&prmAmount=" + prmAmount + "&prmCvc=" + prmCvc + "&prmMarca=" + prmMarca)
        .success(function(data){
			console.log('servicio tarjetas 321:: ' + JSON.stringify(data));
			if (data.status == 'OK' && data.validated == 'CORRECT') {
				//busyIndicator.hide();
				generaIdTransaccion();	
				checkRecargaCC.reset();
				consultaVinculacionCC(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
				//$state.go('app.homecc');
			} if (data.status == 'NO' && data.validated == 'DECLINED') {
				generaIdTransaccion();
				checkRecargaCC.reset();
				//busyIndicator.hide();
				WL.SimpleDialog.show('Advertencia', 'Transacción declinada, es necesario se comunique con su banco para autorizar la compra. Gracias', [ { text: "Aceptar", handler: function(){} } ]);
			}
			else {
				generaIdTransaccion();
				checkRecargaCC.reset();
				//busyIndicator.hide();
		    	WL.SimpleDialog.show('Datos incorrectos', 'Datos incorrectos, por favor vuelve a intentar', [ { text: "Aceptar", handler: function(){} } ]);
			}
   		})
   		.error(function(data){
   			console.log('servicio tarjetas 123:: ' + JSON.stringify(data));
   			generaIdTransaccion();
   			checkRecargaCC.reset();
    		WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
   		});



    	/*
    	var invocationData = getReloadCard(prmOrderId, prmTrxId, prmCardNumber, prmMembershipIPK, prmIdTarjetaDigital, prmAmount, prmCvc, prmMarca);
	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
	            var httpStatusCode = result.status;
	            if (200 == httpStatusCode) {
	                var invocationResult = result.invocationResult;
	                var isSuccessful = invocationResult.isSuccessful;
	                console.log('invocationResult' + JSON.stringify(invocationResult));
	                if (true == isSuccessful) {					                	
						if (invocationResult.status == 'OK' && invocationResult.validated == 'CORRECT') {
							console.log('servicio tarjetas 321:: ' + JSON.stringify(invocationResult));
							//busyIndicator.hide();
							generaIdTransaccion();					
							checkRecargaCC.reset();
							consultaVinculacionCC(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
							//$state.go('app.homecc');
						} else {
							generaIdTransaccion();
							checkRecargaCC.reset();
							//busyIndicator.hide();
	                    	WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
						}

	                } else {
	                	generaIdTransaccion();
	                	checkRecargaCC.reset();
	                	//busyIndicator.hide();
	                    WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	                }
	            } else {
	            	generaIdTransaccion();
	            	checkRecargaCC.reset();
	            	//busyIndicator.hide();
	                WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	            }
	        },
	        onFailure : function() {
	        	generaIdTransaccion();
	        	checkRecargaCC.reset();
        		//busyIndicator.hide();
	        	WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	        }
	    });
	    */
    }    

    function generaIdTransaccion () {
		var invocationData = getAdapterGeneraIdTransaccion();

	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
	    	    var httpStatusCode = result.status;
	    	    if (200 == httpStatusCode) {
	    	        var invocationResult = result.invocationResult;
	    	        var isSuccessful = invocationResult.isSuccessful;
	    	        if (true == isSuccessful) {
	    	            var prmOrderId = invocationResult.prmOrderId;
	    	            var prmTrxId = invocationResult.prmTrxId;
	    	        	localStorage.setItem('prmOrderId', prmOrderId);
	    	        	localStorage.setItem('prmTrxId', prmTrxId);
	    	        	busyIndicator.hide();
	    	        	console.log('Realizo una nueva transaccion y una orden');
	    	        } else {
	    	        	busyIndicator.hide();
	    	        	console.log('error http 1::');
//			    	            alert("Error. isSuccessful=" + isSuccessful);
						WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	    	        	//$state.go('app.socio');
	    	        }                    
	    	    } else {
	    	    	busyIndicator.hide();
	    	    	console.log('error http 2::');			    	        
					WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	    	    	//$state.go('app.socio');
	    	    }
	        },
	        onFailure : function() {
	        	busyIndicator.hide();
	    		WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	        }
	    });
	};

	function consultaVinculacionCC (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber) {
		var invocationData = getAdapterConsultaVinculacionCC(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
        		//checkHomeCC.reset();
	            var httpStatusCode = result.status;
	            if (200 == httpStatusCode) {
	                var invocationResult = result.invocationResult;
	                var isSuccessful = invocationResult.isSuccessful;
	                if (true == isSuccessful) {
						var prmAmountBalanceReg = localStorage.getItem('prmAmountBalance') || '';
	                	var prmStatus = invocationResult.prmStatus;
	                	var prmAmountBalance = invocationResult.prmAmountBalance;
	                	var prmCashCardNumber = invocationResult.prmCashCardNumber;
	                	localStorage.setItem('consulta.prmStatus', prmStatus);
	                	//localStorage.setItem('prmAmountBalance', prmAmountBalance);
	                	localStorage.setItem('prmCashCardNumber', prmCashCardNumber);

	    	        	if (prmAmountBalanceReg != prmAmountBalance
	    	        			|| (!fechaUltimaActualizacion || 0 === fechaUltimaActualizacion.length)) {
	    	        		var fecha = new Date();
	    	        		fechaUltimaActualizacion = formatDate(fecha);
	    	        		localStorage.setItem('fechaUltimaActualizacion', fechaUltimaActualizacion);
	    					$scope.saldo = {monto: 0,
						 					fecha: fechaUltimaActualizacion
						 					};
	    	        	} 
	    	        	var formatNumber = {
											separador: ",", // separador para los miles
											sepDecimal: '.', // separador para los decimales
											formatear:function (num){
											num +='';
											var splitStr = num.split('.');
											var splitLeft = splitStr[0];
											var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
											var regx = /(\d+)(\d{3})/;

											while (regx.test(splitLeft)) {
												splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
												console.log('Entro al while');
											}
												return this.simbol + splitLeft  +splitRight;
												console.log(this.simbol + splitLeft  +splitRight);
											},
											new:function(num, simbol){
												this.simbol = simbol ||'';
												return this.formatear(num);
											}
										}

						var amount = formatNumber.new(prmAmountBalance, "$");
					    console.log('este es el formato ' + amount);
						$scope.amount = amount;
//						localStorage.setItem('prmAmountBalance', amount);
						localStorage.setItem('prmAmountBalance', prmAmountBalance);
						localStorage.setItem('prmAmountBalanceFmt', amount);
						busyIndicator.hide();
						WL.SimpleDialog.show("Confirmación", "Recarga exitosa.", [ { text: "Aceptar", handler: function(){} } ]);
						$state.go('app.homecc');
	                } else {
	                    busyIndicator.hide();
	        			WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	                }
	            } else {
	                busyIndicator.hide();
	        		WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	            }
	        },
	        onFailure : function(result) {
        		busyIndicator.hide();
	        	WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	        }
	    });
	};

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
	           if (opc ==3) {
	           	var ref = window.open(encodeURI('https://www3.costco.com.mx/wps/portal/publico/PORTALSOCIOS'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
	           }
	           if (opc == 2) {
	           	var ref = window.open(encodeURI('https://www3.costco.com.mx/wps/portal/publico/AyudaTD'), '_system', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
	           }
	   }
	};

	$scope.regresa = function(){
		console.log('entro a return');
		$state.go('app.isregistrocc');
	}

	var tSalida = $scope.cards[0].prmTimer;
	var tS = parseInt(tSalida);
	var res = tS*1000;
	if($scope.cards.length == 0){
		console.log("valor tarjetas vacio: " +  $scope.cards.length);
	}else{
		var time = $timeout(function(){
			$scope.closeModal();
			$scope.timeTer = $state.go('app.homecc');
			WL.SimpleDialog.show("Advertencia", "El tiempo para recargar se ha agotado", [ { text: "Aceptar", handler: function(){} } ]);
		}, res );
	}

    $scope.$on('$ionicView.leave', function(){
		console.log('Reset antes de irse ::');
		checkRecargaCC.reset();
		$timeout.cancel(time);
	});

	$ionicPlatform.registerBackButtonAction(function () {
  		console.log('ButtonBack oprimido en recargaCC');
  		$state.go('app.isregistrocc');
  	}, 100);

  	$ionicModal.fromTemplateUrl('my-modal.html', {
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
	$scope.$on('modal.hidden', function() {
		// Execute action
		console.log('dataReload ::' + JSON.stringify($scope.cards) + ' ' + $scope.dataReload.prmIdTarjetaDigital);
		//console.log('dataReload ::' + $scope.cards);
		for (var i = 0; i < $scope.cards.length ; i++) {
			console.log('valor de i ::' + i + ' ' + JSON.stringify($scope.cards[i]));
			if ($scope.dataReload.prmIdTarjetaDigital == $scope.cards[i].prmIdTarjetaDigital) {
				console.log("caaards" + JSON.stringify($scope.cards[i]));
				$scope.campoCards = $scope.cards[i];
			}
		}
	});
})

.directive('awLimitLength', function () {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
          attrs.$set("ngTrim", "false");
          var limitLength = parseInt(attrs.awLimitLength, 5);// console.log(attrs);
          scope.$watch(attrs.ngModel, function(newValue) {
            if(ngModel.$viewValue.length>limitLength){
              ngModel.$setViewValue( ngModel.$viewValue.substring(0, limitLength ) );
              ngModel.$render();
            }
          });
        }
    };
});