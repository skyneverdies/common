/*-- Controlador de registro de Cash Card --*/
'use strict';

angular.module('starter.registrocc', [])

.controller('RegistroccController', function ($ionicPlatform, $scope, $state, $stateParams, $timeout, 
											$ionicScrollDelegate, busyIndicator, $interval,
											$ionicBackdrop, $ionicModal, $window , 
											$ionicSlideBoxDelegate, $mdBottomSheet, $mdToast, checkRegistroCC, $http) {
	busyIndicator.hide();
	// Set Header
	$scope.$parent.showHeader();
	$scope.datos = {};

	var dataServicesTemp;
    var datosServicio;
	
    dataServicesTemp = localStorage.getItem('dataService') || '<empty>';
    datosServicio = JSON.parse(dataServicesTemp);	
    
	var fechaUltimaActualizacion = localStorage.getItem('fechaUltimaActualizacion') || '';
		
	$scope.confirmaVinculacion = function () {
		console.log('Entro a confirmaVinculacion');
		var prmCashCardNumber = $scope.datos.cashCardNumber;
		
		var prmOrderId = localStorage.getItem('prmOrderId') || '';
		var prmTrxId = localStorage.getItem('prmTrxId') || '';
		var prmMembershipIPK = datosServicio.ipk;
		var prmCardNumber = datosServicio.membershipNumber;
		
		if (checkRegistroCC.getTotal() == 0) {
			checkRegistroCC.addone();
            vinculaCCMembresia (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber);
		} else {
			//checkRegistroCC.reset();
			console.log('ya entro una vez a la funcion');
		}
        	
	};
	
	$scope.cancelar = function () {
		checkRegistroCC.reset();
		$state.go('app.socio');
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
	           if (opc == 3) {
	           	var ref = window.open(encodeURI('https://www3.costco.com.mx/wps/wcm/connect/publico/costcopublico/publicocostco/afiliacion/TerminosCondiciones'), '_blank', 'location=no,closebuttoncaption=Inicio,EnableViewPortScale=yes');
	           }
	   }
	};
	
	function vinculaCCMembresia (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber) {
		busyIndicator.show();
		var invocationData = getAdapterVinculaCCMembresia(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber);

	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
        		busyIndicator.hide();
	            var httpStatusCode = result.status;
	            if (200 == httpStatusCode) {
	            	console.log("checo cashcard :: " + JSON.stringify(result.invocationResult));
	                var invocationResult = result.invocationResult;
	                var isSuccessful = invocationResult.isSuccessful;
	                if (true == isSuccessful) {
	                	var prmStatus = invocationResult.prmStatus;
	                	var prmAmountBalance = invocationResult.prmAmountBalance;
	                	var prmCashCardNumber = invocationResult.prmCashCardNumber;
	                	localStorage.setItem('vincula.prmStatus', prmStatus);
	                	localStorage.setItem('prmAmountBalance', prmAmountBalance);
//		                	WL.Toast.show ("Status:"+prmStatus);
	                	
	        	    	var mensaje = "";
	        	    	if (prmStatus == "Y") {
	        	    		//mensaje = "Certificado de gasolina registrado exitosamente";
		                	//WL.Toast.show (mensaje);
	            			checkRegistroCC.reset();
	            			consultaVinculacion();
	            			
//		            			$state.go('app.homecc');		            			
	        	    	} else {
	        	    			//mensaje = "No se ha podido vincular la CC";
	        	    			//WL.Toast.show (mensaje);
	        	    			checkRegistroCC.reset();
	        	    			busyIndicator.hide();
		        				WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	        	    	}
//		        	    	WL.SimpleDialog.show("Mensaje", mensaje, [{text:"Aceptar",handler:function(){}}]);
	                } 
	                else {
	                	checkRegistroCC.reset();
						busyIndicator.hide();
		        		WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	                }                    
	            } 
	            else {
	            	checkRegistroCC.reset();
					busyIndicator.hide();
		        	WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	            }
	        },
	        onFailure : function() {
	        	checkRegistroCC.reset();
        		busyIndicator.hide();
		        WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	        	
	        }
	    });
	};
	
 	function consultaVinculacion () {
 		
		console.log('Entro a consultaVinculacion');

		var prmOrderId = localStorage.getItem('prmOrderId') || '';
		var prmTrxId = localStorage.getItem('prmTrxId') || '';
		var prmMembershipIPK = datosServicio.ipk;
		var prmCardNumber = datosServicio.membershipNumber;
		var prmOrderId = localStorage.getItem('prmOrderId') || '';
		var prmTrxId = localStorage.getItem('prmTrxId') || '';
		var prmMembershipIPK = datosServicio.ipk;
		var prmCardNumber = datosServicio.membershipNumber;

		consultaVinculacionCC(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
	};

	function consultaVinculacionCC (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber) {
		console.log('Entro a consultaVinculacionCC');

		var invocationData = getAdapterConsultaVinculacionCC(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
        		checkRegistroCC.reset();
	            var httpStatusCode = result.status;
	            if (200 == httpStatusCode) {
	    			//console.log('Entro a consultaVinculacionCC response');
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
	        onFailure : function() {
	        	$scope.amount = localStorage.getItem('prmAmountBalance') || '';
	        	var fechaUltimaActualizacion = localStorage.getItem('fechaUltimaActualizacion') || '';
	        	$scope.saldo = {monto: 0,
			 					fecha: fechaUltimaActualizacion
			 					};
        		busyIndicator.hide();
	        	WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	        }
	    });
	};

	$scope.$on('$ionicView.leave', function(){
		console.log('Reset antes de irse ::');
		checkRegistroCC.reset();
	});
	
  	$ionicPlatform.registerBackButtonAction(function () {
  		console.log('ButtonBack oprimido en registroCC');
  		$state.go('app.socio');
  	}, 100);

});

