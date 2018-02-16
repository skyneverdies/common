'use strict';

angular.module('starter.reenvioFacturacion', [])

.controller('ReenvioFacturacionController', function ($scope, $timeout, $state, facturacionService, $ionicModal) {

	$scope.reenvioFactura = {};
	$scope.emailFrecuente = [];

	$scope.checkboxModel = {
       value1 : false,
     };
	var band = true;
	$scope.reenvioFactura.ticketOrden = facturacionService.getNoTicketReenvio();

	$scope.$on('$ionicView.beforeEnter', function(){
		var emailFrecuenteTemp  = localStorage.getItem('emailFrecuente') || '';
		if (emailFrecuenteTemp == '') {
    		console.log("No hya correos");
    	}else{
    		var res = emailFrecuenteTemp.split(",");
			for(var i = 0 ; i < res.length ; i++){
				$scope.emailFrecuente[i] = res[i];
			}
    	}
		/*aqui s eva a verificar que venga del home o recarga de la vista*/
		if (facturacionService.getBanderaReenvio() == 0) {
			facturacionService.resetNumTicketReenvio();
		}
	});

	$scope.openScan = function() {
		if (band) {
			band = false;
			cordova.exec(fileViewSuccess, fileViewFailure, "BarcodeScanner", "scan", []);
		} else{
			console.log('intento abrir la camara de nuevo');
		}
	}

	$scope.valueCheckbox = function(){
		if($scope.checkboxModel.value1 == false){
			$scope.checkboxModel.value1 = true;
		}else{
			$scope.checkboxModel.value1 = false;
		}
	}

	function fileViewSuccess(result) {
		console.log("We got a barcode Result: " + result.text);
		band = true;
		if(result.cancelled == true){
			console.log('cacelado por el usuario');
			WL.SimpleDialog.show('Advertencia', 'Escáner cancelado.', [ { text: "Aceptar", handler: function(){} } ]);
		}else{
			facturacionService.putNoTicketReenvio(result.text);
			facturacionService.putBanderaReenvio();
			$state.go($state.current, {}, {reload: true});
		}
	}

	function fileViewFailure(error) {
    	alert("Scanning failed: " + error);
    	band = true;
    	$state.go('app.reenvio');
    }

    $scope.getDatosReenvioFactura = function () {
    	console.log("corres iguales manda servicio");
		var ticket 		= 	$scope.reenvioFactura.ticketOrden;
		var membresia 	= 	$scope.reenvioFactura.membresia;
		var correo 		= 	$scope.reenvioFactura.correo;
    	if ($scope.checkboxModel.value1 == false && $scope.emailFrecuente.length == 0) {
    		if ($scope.reenvioFactura.correo.toLowerCase() != $scope.reenvioFactura.concorreo.toLowerCase()) {
				$scope.correoInvalido = 1;
			}else{
				$scope.correoInvalido = 0;
				if (band) {
					if ($scope.emailFrecuente.length == 0) {
			    			navigator.globalization.getPreferredLanguage(
					        function (language) {
					            var title     = 'Agregar Correo';
					            var template  = '¿Desea agregar el correo a frecuentes?';
					            var btn1      = 'SÍ';
					            var btn2      = 'NO';
					            if (language.value == 'en-US' || language.value == 'en-MX' 
					                || language.value == 'english' || language.value == 'ingles' ){
					                    
					                title     = 'Add Email';
					                template  = 'Do you want to add the email to frequent?';
					                btn1      = 'YES';
					                btn2      = 'NO';
					            }
					            
					            WL.SimpleDialog.show(title, template, [
					                {
					                    text : btn1,
					                    handler : function() {
					                    	$scope.checkboxModel.value1 = false;
					                        var removed = $scope.emailFrecuente.splice(0, 0, $scope.reenvioFactura.correo);
					                        localStorage.setItem("emailFrecuente", $scope.emailFrecuente);
					                        enviarServicioReenvioFactura(ticket, membresia, correo);
					                    }
					                },
					                {
					                    text : btn2,
					                    handler : function(){                               
					                        //dataServices = localStorage.getItem('dataService') || '<empty>';
					                        console.log('Cancelar');
					                        enviarServicioReenvioFactura(ticket, membresia, correo); 
					                }
					                }
					            ]);
					            },
					            function () {
					            WL.Logger.debug("can't get language");
					            }
					        );
			    	}else{
			    		enviarServicioReenvioFactura(ticket, membresia, correo);
			    	}
			    }
			}
    	}else{
    		enviarServicioReenvioFactura(ticket, membresia, correo);
    	}
    }

    function enviarServicioReenvioFactura(ticket, membresia, correo) {

    	console.log('datos de la factura :: ' + ticket + ' ' + membresia + ' ' + correo);
    	busyIndicator.show();
    	var invocationData = getAdapterEnviaDatosReenvioFactura(ticket, membresia, correo);

	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
	        	var band = true;
	        	//console.log(JSON.stringify(result));
	            var httpStatusCode = result.status;
	            busyIndicator.hide();
	            if (200 == httpStatusCode) {
	            	//console.log("checo getAdapterEnviaDatosFactura :: " + JSON.stringify(resul t.invocationResult));
	                var invocationResult = result.invocationResult;
	                var isSuccessful = invocationResult.isSuccessful;
	                if (true == isSuccessful) {
	        	    	console.log('Resultado del servicio reenvio facturacion ' + invocationResult.text);
	        	    	var n = invocationResult.text.indexOf("Repuesta==");
    					var resultadoServicio = invocationResult.text.substring(n+10, n+12);
    					//var resultadoServicio = '00';
    					console.log('codigo de error ::' + resultadoServicio);
    					band = true;
    					switch (resultadoServicio) {
    						case '00' :
    							console.log('Mandando Factura');
    							WL.SimpleDialog.show("Confirmación", "Su factura se ha reenviado con exito a su correo.", [ { text: "Aceptar", handler: function(){} } ]);
	        	    			$state.go('app.facturacion');
    							break;
    						case '01' :
    							console.log('01 No existe ticket ::');
    							WL.SimpleDialog.show('Advertencia', 'El número de ticket/orden no es válido.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '02' :
    							console.log('02 Ticket ya facturado ::');
    							WL.SimpleDialog.show('Advertencia', 'Ticket/orden No ha sido Facturado.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '03' :
    							console.log('03 El ticket no se puede facturar (fecha no válida) ::');
    							WL.SimpleDialog.show('Advertencia', 'Membresía Diferente, Verifique los datos.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '04' :
    							console.log('04 El ticket no se puede facturar (Días para facturar)::');
    							WL.SimpleDialog.show('Advertencia', 'El plazo máximo para facturar es de 15 días después de su compra.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '05' :
    							console.log('05 Mercancía no válida::');
    							WL.SimpleDialog.show('Advertencia', 'Falla en el envío de correo, Intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						default:
    							WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    					}
	                } 
	                else {
	                	console.log('isSuccessful != true::');
	                	WL.SimpleDialog.show('Advertencia', 'No se puede realizar la factura en estos momentos, intente más tarde', [ { text: "Aceptar", handler: function(){} } ]);
	                } 
	            } 
	            else {
	            	console.log('httpStatusCode != 200');
	            	WL.SimpleDialog.show('Advertencia', 'No se puede realizar la factura en estos momentos, intente más tarde', [ { text: "Aceptar", handler: function(){} } ]);
	            }
	        },
	        onFailure : function(result) {
	        	busyIndicator.hide();
	        	var band = true;
	        	console.log('onFailure ::' + JSON.stringify(result));
		        WL.SimpleDialog.show('Advertencia', 'No se puede realizar la factura en estos momentos, intente más tarde', [ { text: "Aceptar", handler: function(){} } ]);
	        }
	    });
    }

    /*
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
		console.log('Modal close');
	});
	*/

	$scope.mensajeLimite = function(){
    	WL.SimpleDialog.show("Correo", "Usted puede almacenar hasta 5 correos, esta información se borrará cuando se desinstale la aplicación o se elimine el caché.", [ { text: "Aceptar", handler: function(){} } ]);
    }

    $scope.borrarFrecuente = function(index){
    	console.log("borrado" + index);
    	var removed = $scope.emailFrecuente.splice(index, 1);
    }

    $scope.addEmail = function(){
    	//console.log('correos guardados ::' + $scope.emailFrecuente);
    	//	console.log('correos enviado ::' + $scope.reenvioFactura.correo);

	    if ($scope.emailFrecuente.indexOf($scope.reenvioFactura.correo) === -1) {	
	    	navigator.globalization.getPreferredLanguage(
		        function (language) {
		            var title     = 'Agregar Correo';
		            var template  = '¿Desea agregar el correo a frecuentes?';
		            var btn1      = 'SÍ';
		            var btn2      = 'NO';
		            if (language.value == 'en-US' || language.value == 'en-MX' 
		                || language.value == 'english' || language.value == 'ingles' ){
		                    
		                title     = 'Add Email';
		                template  = 'Do you want to add the email to frequent?';
		                btn1      = 'YES';
		                btn2      = 'NO';
		            }
		            
		            WL.SimpleDialog.show(title, template, [
		                {
		                    text : btn1,
		                    handler : function() {
		                    	$scope.checkboxModel.value1 = false;
		                        var removed = $scope.emailFrecuente.splice(0, 0, $scope.reenvioFactura.correo);
		                        localStorage.setItem("emailFrecuente", $scope.emailFrecuente);
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
	    }else{
	    	console.log("element found");
	    }
    	$scope.modal2.hide();
    }

    $scope.closeModalFrecuente = function(){
    	$scope.reenvioFactura.concorreo = $scope.reenvioFactura.correo;
    	$scope.closeModal(2);
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
    	id: '1',
		scope: $scope,
		animation: 'slide-in-up',
		//backdropClickToClose: true,
		hardwareBackButtonClose: true
	}).then(function(modal) {
		$scope.modal1 = modal;
	});

	$ionicModal.fromTemplateUrl('my-modal-correo.html', {
		id: '2',
		scope: $scope,
		animation: 'slide-in-up',
		//backdropClickToClose: true,
		hardwareBackButtonClose: true
	}).then(function(modal) {
		$scope.modal2 = modal;
	});

	$scope.openModal = function(index) {
		if(index == 1){
			$scope.modal1.show();
		}else{
			$scope.modal2.show();
		}
	};
	$scope.closeModal = function(index) {
		switch(index){
			case 1 :
				$scope.modal1.hide();
				break;
			case 2 :
				if ($scope.checkboxModel.value1 == true) {
					if ($scope.reenvioFactura.correo.toLowerCase() != $scope.reenvioFactura.concorreo.toLowerCase()) {
					$scope.correoInvalido = 1;
					}else{
						$scope.correoInvalido = 0;
						console.log("corres iguales");
						if ($scope.checkboxModel.value1 == true && $scope.emailFrecuente.length < 5) {
							$scope.checkboxModel.value1 = false;
							$scope.addEmail();
					    }else{
					    	console.log('Ya son 5');
					    	$scope.modal2.hide();
					    }
						//$scope.modal2.hide();
					}	
				}else{
					$scope.correoInvalido = 0;
					$scope.reenvioFactura.concorreo = "";
					$scope.modal2.hide();
				}
				break;

			case 3 :
				$scope.reenvioFactura.correo = '';
				$scope.reenvioFactura.concorreo = '';
				$scope.modal2.hide();
				break;
			default :
				$scope.reenvioFactura.correo = '';
				$scope.reenvioFactura.concorreo = '';
				$scope.modal2.hide();
				break;
		}

		/*
		if(index == 1){
			$scope.modal1.hide();
		}else{
			//$scope.modal2.hide();
			if ($scope.checkboxModel.value1 == true) {
				if ($scope.reenvioFactura.correo.toLowerCase() != $scope.reenvioFactura.concorreo.toLowerCase()) {
				$scope.correoInvalido = 1;
				}else{
					$scope.correoInvalido = 0;
					console.log("corres iguales");
					$scope.modal2.hide();
				}	
			}else{
				$scope.correoInvalido = 0;
				$scope.reenvioFactura.concorreo = "";
				$scope.modal2.hide();
			}
		}
		*/
	};
	$scope.$on('modal.hidden', function(event, modal) {
		// Execute action
		console.log('Modal ' + modal.id + ' is hidden!');
		$scope.checkboxModel.value1 = false;
		

		if (modal.id == 1) {
			console.log('Modal close');
		}else {
			if ($scope.checkboxModel.value1 == true && $scope.emailFrecuente.length < 5) {
				$scope.checkboxModel.value1 = false;
				$scope.addEmail();
		    }
			console.log('Modal Correo close' + $scope.reenvioFactura.correo + " " + $scope.checkboxModel.value1);
		}
	});

	$scope.$on('$ionicView.leave', function(){
        console.log('Reset antes de irse ::');
    });

});