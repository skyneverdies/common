'use strict';

angular.module('starter.isregistrocc', [])

.controller('IsRegistroController', function ($scope, $state, $stateParams, $timeout, 
											$ionicScrollDelegate, busyIndicator, $interval,
											$ionicBackdrop, $ionicModal, $window , 
											$ionicSlideBoxDelegate, $mdBottomSheet, $mdToast, checkHomeCC, $http) {

	// Set Header
	$scope.$parent.showHeader();

	var dataServicesTemp;
    var datosServicio;
	
    dataServicesTemp = localStorage.getItem('dataService') || '<empty>';
    datosServicio = JSON.parse(dataServicesTemp);

	if (checkHomeCC.getTotal() == 0) {
		checkHomeCC.addone();
		busyIndicator.show();
		generaIdTransaccion();
	}  else {
		checkHomeCC.reset();
	}
		
	function consultaVinculacion () {
		var prmOrderId = localStorage.getItem('prmOrderId') || '';
		var prmTrxId = localStorage.getItem('prmTrxId') || '';
		var prmMembershipIPK = datosServicio.ipk;
		var prmCardNumber = datosServicio.membershipNumber;
		
		consultaVinculacionCC(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
	};
	
	function generaIdTransaccion () {
		//busyIndicator.show();
		//WL.Toast.show ("Generando transaccion");
		var invocationData = getAdapterGeneraIdTransaccion();
	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
        		//busyIndicator.hide();
	    	    var httpStatusCode = result.status;
	    	    if (200 == httpStatusCode) {
	    	        var invocationResult = result.invocationResult;
	    	        var isSuccessful = invocationResult.isSuccessful;
	    	        if (true == isSuccessful) {
	    	            var prmOrderId = invocationResult.prmOrderId;
	    	            var prmTrxId = invocationResult.prmTrxId;
	    	        	localStorage.setItem('prmOrderId', prmOrderId);
	    	        	localStorage.setItem('prmTrxId', prmTrxId);
	    	        	consultaVinculacion();
	    	        } else {
	    	        	busyIndicator.hide();
	    	        	console.log('error http 1::');
//			    	    alert("Error. isSuccessful=" + isSuccessful);
						WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	    	        	$state.go('app.socio');
	    	        }                    
	    	    } else {
	    	    	busyIndicator.hide();
	    	    	console.log('error http 2::');			    	        
					WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	    	    	$state.go('app.socio');
	    	    }
	        },
	        onFailure : function() {
        		busyIndicator.hide();
        		checkHomeCC.reset();
        		console.log('error http 3::');
        		//WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
        		var prmAmountBalanceReg = localStorage.getItem('prmAmountBalance') || '';
        		console.log('prmAmountBalanceReg ' + prmAmountBalanceReg);
        		if (prmAmountBalanceReg != '') {
                    console.log('no esta vacio');
                    if (prmAmountBalanceReg == '.00') {
                        $state.go('app.registrocc');
                        console.log('entro al else');     
                    } else {
                        $state.go('app.homecc');
                        console.log('entro al if');
                    }
                } else {
                    $state.go('app.registrocc');
                    console.log('entro al else');
                }
	    		//WL.Toast.show ("Fallo generacion transaccion");
	        }
	    });
	};
	
	function consultaVinculacionCC (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber) {
		var invocationData = getAdapterConsultaVinculacionCC(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
	    WL.Client.invokeProcedure(invocationData,{
	       onSuccess : function(result) {
       		checkHomeCC.reset();
	           var httpStatusCode = result.status;
	           if (200 == httpStatusCode) {
	               var invocationResult = result.invocationResult;
	               var isSuccessful = invocationResult.isSuccessful;
	               if (true == isSuccessful) {
	   						var prmAmountBalanceReg = localStorage.getItem('prmAmountBalance') || '';
	   						var fechaUltimaActualizacion = localStorage.getItem('fechaUltimaActualizacion') || '';
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
//							localStorage.setItem('prmAmountBalance', amount);
							localStorage.setItem('prmAmountBalance', prmAmountBalance);
							localStorage.setItem('prmAmountBalanceFmt', amount);
							//busyIndicator.hide();
							if (prmStatus == "N") {
		            			checkHomeCC.reset();
		            			console.log('tarjeta NO vinculada ::' +  prmStatus);
		            			//busyIndicator.hide();
		            			$state.go('app.registrocc');			            		
		        	        	//WL.Toast.show ("Certificado de gasolina no registrado");
		            		} else {
		            			checkHomeCC.reset();
		            			//busyIndicator.hide();
		            			console.log('tarjeta vinculada ::' +  prmStatus);
		            			$state.go('app.homecc');
		            		}

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
	       	$scope.amount = localStorage.getItem('prmAmountBalanceFmt') || '';
	       	var fechaUltimaActualizacion = localStorage.getItem('fechaUltimaActualizacion') || '';
	       	$scope.saldo = {monto: 0,
								fecha: fechaUltimaActualizacion
							};
       		busyIndicator.hide();
	       	WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	       }
	   });
	};
});

