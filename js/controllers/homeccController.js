'use strict';

angular.module('starter.homecc', [])

.controller('HomeccController', function ($ionicPlatform, $scope, $state, $stateParams, $timeout,
											$ionicScrollDelegate, busyIndicator, $interval,
											$ionicBackdrop, $ionicModal, $window ,
											$ionicSlideBoxDelegate, $mdBottomSheet, $mdToast, checkHomeCC, $http) {
	
	// Set Header
	$scope.$parent.showHeader();

	var dataServicesTemp;
	var datosServicio;
	dataServicesTemp = localStorage.getItem('dataService') || '<empty>';
	datosServicio = JSON.parse(dataServicesTemp);
	var prmOrderId = localStorage.getItem('prmOrderId') || '';
    var prmTrxId = localStorage.getItem('prmTrxId') || '';
    var uuid;
    var key;
    var value;
    var tempCashCard = localStorage.getItem('prmCashCardNumber') || '';
    $scope.cashCard = tempCashCard.substr(tempCashCard.length - 4);

  	if (checkHomeCC.getTotal() == 0) {
			checkHomeCC.addone();

			//busyIndicator.show();
			var fechaUltimaActualizacion = localStorage.getItem('fechaUltimaActualizacion') || '';
			
			$scope.saldo = { monto: 0,
		 					fecha: fechaUltimaActualizacion
		 					};
		 	$scope.amount = localStorage.getItem('prmAmountBalanceFmt') || '';
			busyIndicator.hide();
  	}  else {
			checkHomeCC.reset();
			busyIndicator.hide();
  	}

	$scope.consultaLogin = function(opc){
		//if(opc != 4){
		busyIndicator.show();
		//}
	    var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	    
	    if((deviceType == "iPad") || (deviceType == "iPhone")){
	        // Ambiente iPhone
	        key = 'uuid';
	        var touchIdMessage = 'TouchID Message'

	        var win = function(value) {
	            console.log("GET SUCCESS - Key: " + key + " Value: " + value);
	            uuid = value;
	            //consultaLogin.consulta(uuid);
	            verificaLogin(opc);

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
	        //consultaLogin.consulta(uuid);
	        verificaLogin(opc);
	    }
	}

	function verificaLogin(opc){
		busyIndicator.hide();
	    switch(opc) {
		    case 1:
		        $scope.actualizar();
		        break;
		    case 2:
		        $scope.recargar();
		        break;
		    case 3:
		        $scope.desvincular();
		        break;
		    case 4:
		    	//busyIndicator.show();
		        $state.go('app.pagocc');
		        break;
		    default:
		        console.log('Opción no disponible');
		}
	}

	$scope.actualizar = function () {
		//busyIndicator.show();
		document.getElementById("btnActualizar").className = "botonToolBar botonOprimido";
		consultaVinculacion();
	};

	$scope.desvincular = function () {
		document.getElementById("btnDesvincular").className = "botonToolBar botonOprimido";
		navigator.globalization.getPreferredLanguage(
        function (language) {
            var title     = 'Desvincular';
            var template  = '¿Está seguro en desvincular?';
            var btn1      = 'Aceptar';
            var btn2      = 'Cancelar';
            if (language.value == 'en-US' || language.value == 'en-MX' 
                || language.value == 'english' || language.value == 'ingles' ){
                    
                title     = 'Unlink';
                template  = 'Are you sure to unlink?';
                btn1      = 'Accept';
                btn2      = 'Cancel';
            }

            
            WL.SimpleDialog.show(title, template, [
                {
                    text : btn1,
                    handler : function() {
                        //busyIndicator.show();
                        desvincula();
                    }
                },
                {
                    text : btn2,
                    handler : function(){                               
                        busyIndicator.hide();
                        console.log("Cancelar");
                }
                }
            ]);
            },
            function () {
            WL.Logger.debug("can't get language");
            }
        );//}finaliza msj
		};


 	function consultaVinculacion () {
		//var prmOrderId = localStorage.getItem('prmOrderId') || '';
		//var prmTrxId = localStorage.getItem('prmTrxId') || '';
		var prmMembershipIPK = datosServicio.ipk;
		var prmCardNumber = datosServicio.membershipNumber;

		consultaVinculacionCC(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
	};

	function desvincula () {
		var prmOrderId = localStorage.getItem('prmOrderId') || '';
		var prmTrxId = localStorage.getItem('prmTrxId') || '';
		var prmMembershipIPK = datosServicio.ipk;
		var prmCardNumber = datosServicio.membershipNumber;
		var prmCashCardNumber = localStorage.getItem('prmCashCardNumber') || '';

		desvinculaCCMembresia (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber);

		// Actualiza saldo
		//consultaVinculacionCC(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
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
//										localStorage.setItem('prmAmountBalance', amount);
								localStorage.setItem('prmAmountBalance', prmAmountBalance);
								localStorage.setItem('prmAmountBalanceFmt', amount);
								busyIndicator.hide();

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

	function desvinculaCCMembresia (prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber) {
			busyIndicator.show();
			console.log('los datos son :: ' + prmTrxId + ' ' +  prmOrderId + ' ' + prmMembershipIPK + ' ' + prmCardNumber + ' ' + prmCashCardNumber)
			var invocationData = getAdapterDesvinculaCCMembresia(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber);
		    WL.Client.invokeProcedure(invocationData,{
		        onSuccess : function(result) {
		            var httpStatusCode = result.status;
		            if (200 == httpStatusCode) {
		                var invocationResult = result.invocationResult;
		                var isSuccessful = invocationResult.isSuccessful;
		                if (true == isSuccessful) {
		                	var prmStatus = invocationResult.prmStatus;
		                	localStorage.setItem('desvincula.prmStatus', prmStatus);
		                	console.log('Estatus ::' + prmStatus);
		        	    	var mensaje = "";
		        	    	if (prmStatus == "Y") {
		        	    		localStorage.removeItem('prmAmountBalanceFmt');
		        	    		localStorage.removeItem('fechaUltimaActualizacion');
		        	    		localStorage.removeItem('consulta.prmStatus');
			                	localStorage.removeItem('prmAmountBalance');
			                	localStorage.removeItem('prmCashCardNumber');
			                	localStorage.removeItem('cards');
		        	    		checkHomeCC.reset();
		        	    		busyIndicator.hide();
		        	    		$state.go('app.registrocc');
		        	    	} else {
		        	    		busyIndicator.hide();
	        					WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
		        	    	}
		                } else {
//			                    busyIndicator.hide();
	        				WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
		                }
		            } else {
		            	busyIndicator.hide();
	        			WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
		            }
		        },
		        onFailure : function() {
	        		busyIndicator.hide();
	        		WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
		        }
		    });
	};

	$scope.recargar = function(){
		//busyIndicator.show();
		var prmOrderId = localStorage.getItem('prmOrderId') || '';
		var prmTrxId = localStorage.getItem('prmTrxId') || '';
		var prmMembershipIPK = datosServicio.ipk;
		var prmCardNumber = datosServicio.membershipNumber;

		var invocationData = consultaTarjetaDigitalMembresia(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber);
	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
        		//checkHomeCC.reset();
	            var httpStatusCode = result.status;
	            if (200 == httpStatusCode) {
	                var invocationResult = result.invocationResult;
	                var isSuccessful = invocationResult.isSuccessful;
	                if (true == isSuccessful) {					                	
						console.log('servicio tarjetas :: ' + JSON.stringify(invocationResult.cards));
						var cards = invocationResult.cards;
						localStorage.setItem('cards', JSON.stringify(cards));
						var temp = localStorage.getItem('cards') || '';
						console.log('local storage de cards :: ' + temp);
						busyIndicator.hide();
						$state.go('app.recargacc');											
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
        		busyIndicator.hide();
	        	WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	        	//$state.go('app.homecc');
	        }
	    });
	}

	$scope.$on('$ionicView.leave', function(){
        console.log('Reset antes de irse ::');
        checkHomeCC.reset();
    });

    $ionicPlatform.registerBackButtonAction(function () {
  		console.log('ButtonBack oprimido en homeCC');
  		$state.go('app.home');
  	}, 100);

});
