'use strict';

angular.module('starter.enviarFactura', [])

.controller('EnviarFacturaController', function ($scope, $timeout, $state, facturacionService, $ionicModal) {

	var band = true;	
	var datosServicio;
	$scope.correoInvalido = 0;
	$scope.emailFrecuente = [];

	$scope.checkboxModel = {
       value1 : false,
     };

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

		datosServicio = facturacionService.getDatosFactura();
		$scope.datosFactura = datosServicio[0];
	});
	
	$scope.valueCheckbox = function(){
		if ($scope.checkboxModel.value1 == false) {
			$scope.checkboxModel.value1 = true;	
		} else {
			$scope.checkboxModel.value1 = false;	
		}
	}

	$scope.enviarDatosFactura = function(){

		var ticket 			=	$scope.datosFactura.ticketOrden;
		var rfc 			= 	$scope.datosFactura.RFC;
		var nombre 			= 	$scope.datosFactura.nombre;
		var correo 			= 	$scope.datosFactura.correo;
		console.log("datos de factura :: " + ticket + rfc + nombre + correo);
		
		var calle 			= 	"";
		var numeroExt 		= 	"";
		var numeroInt		= 	"";
		var colonia 		= 	"";
		var localidad 		= 	"";
		var codigoPostal 	= 	"";
		var estado 			= 	"";
		var pais 			= 	"";
		
		var tittles = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÇçÑñ";
        var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuccNn";
        
        for (var i = 0; i < tittles.length; i++) {
            nombre = nombre.replace(tittles.charAt(i), original.charAt(i));
        };
        console.log('nombreeeeee ::' + nombre);

		if ($scope.checkboxModel.value1 == false && $scope.emailFrecuente.length == 0) {		
			if ($scope.datosFactura.correo.toLowerCase() != $scope.datosFactura.concorreo.toLowerCase()) {
				$scope.correoInvalido = 1;
			}else{
				$scope.correoInvalido = 0;
				console.log("corres iguales manda servicio");
				$scope.correoInvalido = 0;
				if (band) {
					if ($scope.emailFrecuente.length == 0) {
						try {
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
					                        var removed = $scope.emailFrecuente.splice(0, 0, $scope.datosFactura.correo);
					                        enviarServicioFactura(rfc, nombre, calle, numeroExt, numeroInt, colonia, localidad, estado, pais, codigoPostal, ticket, correo);
					                    }
					                },
					                {
					                    text : btn2,
					                    handler : function(){                               
					                        //dataServices = localStorage.getItem('dataService') || '<empty>';
					                        console.log('Cancelar');
					                        enviarServicioFactura(rfc, nombre, calle, numeroExt, numeroInt, colonia, localidad, estado, pais, codigoPostal, ticket, correo);
					                }
					                }
					            ]);
					            },
					            function () {
					            WL.Logger.debug("can't get language");
					            }
					        );
						} catch(e) {
							console.log('entro al catch ' + e);
						}
			    	}else{
			    		enviarServicioFactura(rfc, nombre, calle, numeroExt, numeroInt, colonia, localidad, estado, pais, codigoPostal, ticket, correo);
			    	}
			    }else{
			    	console.log('intento enviar dos veces ::');
			    }
			}
		}else{
			enviarServicioFactura(rfc, nombre, calle, numeroExt, numeroInt, colonia, localidad, estado, pais, codigoPostal, ticket, correo);
		}
	}

	function enviarServicioFactura(rfc, nombre, calle, numeroExt, numeroInt, colonia, localidad, estado, pais, codigoPostal, ticket, correo) {

		console.log('datos de la factura :: ' + rfc + ' ' + nombre + ' ' + calle + ' ' + numeroExt + ' ' + numeroInt + ' ' + colonia + ' ' + localidad + ' ' + estado + ' ' + pais + ' ' + codigoPostal + ' ' + ticket + ' ' + correo);
    	busyIndicator.show();
    	var invocationData = getAdapterEnviaDatosGeneraFactura(rfc, nombre, calle, numeroExt, numeroInt, colonia, localidad, estado, pais, codigoPostal, ticket, correo);

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
	        	    	console.log('Resultado del servicio facturacion ' + invocationResult.text);
	        	    	var n = invocationResult.text.indexOf("Respuesta==");
    					var resultadoServicio = invocationResult.text.substring(n+11, n+13);
    					//var resultadoServicio = '00';
    					console.log('codigo de error ::' + resultadoServicio);
    					switch (resultadoServicio) {
    						case '00' :
    							console.log('Mandando Factura');
    							WL.SimpleDialog.show("Confirmación", "Su factura se ha generado con exito y será enviada a su correo.", [ { text: "Aceptar", handler: function(){} } ]);
	        	    			facturacionService.resetNumTicket();
	        	    			$state.go('app.facturacion');
    							break;
    						case '01' :
    							console.log('01 No existe ticket ::');
    							WL.SimpleDialog.show('Advertencia', 'El número de ticket/orden no es válido.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '02' :
    							console.log('02 Ticket ya facturado ::');
    							WL.SimpleDialog.show('Advertencia', 'El número de ticket/orden ya fue generado previamente.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '03' :
    							console.log('03 El ticket no se puede facturar (fecha no válida) ::');
    							WL.SimpleDialog.show('Advertencia', 'Sólo se puede facturar ticket/orden del año en curso.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '04' :
    							console.log('04 El ticket no se puede facturar (Días para facturar)::');
    							WL.SimpleDialog.show('Advertencia', 'El plazo máximo para facturar es de 15 días después de su compra.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '05' :
    							console.log('05 Mercancía no válida::');
    							WL.SimpleDialog.show('Advertencia', 'Producto no válido para facturar.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '06' :
    							console.log('06 Error al generar::');
    							WL.SimpleDialog.show('Advertencia', 'Error al procesar los datos, intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '07' :
    							console.log('07 Facturación en proceso::');
    							WL.SimpleDialog.show('Advertencia', 'Su solicitud fue procesada y en un período no mayor a 72hrs deberá recibir su factura.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '08' :
    							console.log('08 ::Ticket Ceros');
    							WL.SimpleDialog.show('Advertencia', 'Ticket/orden no válido para facturar.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '09' :
    							console.log('09 ::Datos de facturación incorrectos');
    							WL.SimpleDialog.show('Advertencia', 'Datos fiscales inválidos para facturar.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '99' :
    							console.log('99 Desconocido::');
    							WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
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
	        onFailure : function() {
	        	busyIndicator.hide();
	        	var band = true;
	        	console.log('onFailure');
		        WL.SimpleDialog.show('Advertencia', 'No se puede realizar la factura en estos momentos, intente más tarde', [ { text: "Aceptar", handler: function(){} } ]);
	        }
	    });
	}

	$scope.mensajeLimite = function(){
    	WL.SimpleDialog.show("Correo", "Usted puede almacenar hasta 5 correos, esta información se borrará cuando se desinstale la aplicación o se elimine el caché.", [ { text: "Aceptar", handler: function(){} } ]);
    }

    $scope.borrarFrecuente = function(index){
    	console.log("borrado" + index);
    	var removed = $scope.emailFrecuente.splice(index, 1);
    }

    $scope.addEmail = function(){
    	if ($scope.emailFrecuente.indexOf($scope.datosFactura.correo) === -1) {
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
		                        var removed = $scope.emailFrecuente.splice(0, 0, $scope.datosFactura.correo);
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
    	$scope.datosFactura.concorreo = $scope.datosFactura.correo;
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
					if ($scope.datosFactura.correo.toLowerCase() != $scope.datosFactura.concorreo.toLowerCase()) {
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
					}	
				}else{
					$scope.correoInvalido = 0;
					$scope.datosFactura.concorreo = "";
					$scope.modal2.hide();
				}
				break;
			case 3 :
				$scope.datosFactura.correo = "";
				$scope.datosFactura.concorreo = "";
				$scope.modal2.hide();
				break;
			default :
				$scope.datosFactura.correo = "";
				$scope.datosFactura.concorreo = "";
				$scope.modal2.hide();
				break;
		}
	};
	$scope.$on('modal.hidden', function(event, modal) {
		// Execute action
		console.log('Modal ' + modal.id + ' is hidden!');
		$scope.checkboxModel.value1 = false;
		
		/*
		if (modal.id == 1) {
			console.log('Modal close');
		}else {
			if ($scope.checkboxModel.value1 == true && $scope.emailFrecuente.length < 5) {
				$scope.checkboxModel.value1 = false;
				$scope.addEmail();
		    }
			console.log('Modal Correo close' + $scope.datosFactura.correo + " " + $scope.checkboxModel.value1);
		}
		*/
	});

	$scope.$on('$ionicView.leave', function(){
        console.log('Reset antes de irse ::');
        localStorage.setItem("emailFrecuente", $scope.emailFrecuente);
    });


});