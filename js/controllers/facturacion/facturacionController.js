'use strict';

angular.module('starter.facturacion', [])

.controller('FacturacionController', function ($scope, $timeout, $state, facturacionService, $ionicModal) {

	$scope.factura = {};
	$scope.rfcFrecuente = [];

	$scope.checkboxModel = {
       value1 : false,
     };
	//var noTicket;
	//var rfc;
	var band = true;
	$scope.rfcInavilo;
	$scope.factura.ticketOrden = facturacionService.getNoTicket();
	$scope.estado = 1;
	

	$scope.$on('$ionicView.beforeEnter', function(){
		if (facturacionService.getEstadoFacturacion() == 0) {
			$scope.estado = 0;
		}        

		var rfcFrecuenteTemp  = localStorage.getItem('rfcFrecuente') || '';
    	
    	if (rfcFrecuenteTemp == '') {
    		console.log("No hya RFC");
    	}else{
    		var res = rfcFrecuenteTemp.split(",");
			for(var i = 0 ; i < res.length ; i++){
				$scope.rfcFrecuente[i] = res[i];
			}
    	}
    	
		facturacionService.resetDatosFactura();
		/*Aqui se va a verificar que venga del home o recarga de la vista*/
		var banderrrra = facturacionService.getBandera();
		console.log("Bandera en facturacion ::" +  banderrrra);
		if (facturacionService.getBandera() == 0) {
			facturacionService.resetNumTicket();
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

	function fileViewSuccess(result) {
		band = true;
		if(result.cancelled == true){
			console.log('cacelado por el usuario');
			WL.SimpleDialog.show('Advertencia', 'Escáner cancelado.', [ { text: "Aceptar", handler: function(){} } ]);

		}else{
			console.log("We got a barcode Result: " + result.text);
			facturacionService.putNoTicket(result.text);
			facturacionService.putBandera();
			$state.go($state.current, {}, {reload: true});
		}
	}

	function fileViewFailure(error) {
    	alert("Scanning failed: " + error);
    	band = true;
    	$state.go('app.facturacion');
    }

    $scope.valueCheckbox = function(){
    	if($scope.checkboxModel.value1 == false){
    		$scope.checkboxModel.value1 = true;
    	}else{
    		$scope.checkboxModel.value1 = false;
    	}
    }

    $scope.getDatosFacturacion = function(){
    	var noTicket = $scope.factura.ticketOrden;
    	var rfc = $scope.factura.RFC.toUpperCase();
    	var re = /^[a-zA-Z]{3,4}(\d{6})((\D|\d){3})$/;
    	if (re.test(rfc)){
    		if (band) {
	    		if ($scope.rfcFrecuente.length == 0) {
		    			navigator.globalization.getPreferredLanguage(
				        function (language) {
				            var title     = 'Agregar RFC';
				            var template  = '¿Desea agregar el RFC a frecuentes?';
				            var btn1      = 'SÍ';
				            var btn2      = 'NO';
				            if (language.value == 'en-US' || language.value == 'en-MX' 
				                || language.value == 'english' || language.value == 'ingles' ){
				                    
				                title     = 'Add RFC';
				                template  = 'Do you want to add the RFC to frequent?';
				                btn1      = 'YES';
				                btn2      = 'NO';
				            }
				            
				            WL.SimpleDialog.show(title, template, [
				                {
				                    text : btn1,
				                    handler : function() {
				                    	$scope.checkboxModel.value1 = false;
				                        var removed = $scope.rfcFrecuente.splice(0, 0, $scope.factura.RFC.toUpperCase());
				                        enviaDatosFacturacion(noTicket, rfc);
				                    }
				                },
				                {
				                    text : btn2,
				                    handler : function(){                               
				                        //dataServices = localStorage.getItem('dataService') || '<empty>';
				                        console.log('Cancelar');
				                        enviaDatosFacturacion(noTicket, rfc);                                
				                }
				                }
				            ]);
				            },
				            function () {
				            WL.Logger.debug("can't get language");
				            }
				        );
		    	}else{
		    		enviaDatosFacturacion(noTicket, rfc);
		    	}
	    	}
			$scope.rfcInvalido = 0;
	 	} else {
	   		console.log("RFC invalido");
	   		$scope.rfcInvalido = 1;
	  	}
    }

    function enviaDatosFacturacion(noTicket, rfc) {
    	busyIndicator.show();
    	console.log('datos de facturacion :: ' + noTicket + ' ' + rfc);
    	facturacionService.resetBandera();
    	var invocationData = getAdapterEnviaDatosFactura(noTicket);

	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
	        	//console.log(JSON.stringify(result));
	            var httpStatusCode = result.status;
	            if (200 == httpStatusCode) {
	            	//console.log("checo getAdapterEnviaDatosFactura :: " + JSON.stringify(result.invocationResult));
	                var invocationResult = result.invocationResult;
	                var isSuccessful = invocationResult.isSuccessful;
	                if (true == isSuccessful) {
	        	    	console.log('Resultado del servicio facturacion ' + invocationResult.text);
	        	    	var n = invocationResult.text.indexOf("Respuesta==");
    					var resultadoServicio = invocationResult.text.substring(n+11, n+13);
    					//var resultadoServicio = '00';
    					console.log('codigo de error ::' + resultadoServicio);
    					band = true;
    					switch (resultadoServicio) {
    						case '00' :
    							console.log('Ticket por facturar');
    							enviaDatosRFC(rfc);
    							break;
    						case '01' :
    							busyIndicator.hide();
    							console.log('01 No existe ticket ::');
    							WL.SimpleDialog.show('Advertencia', 'El número de ticket/orden no es válido.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '02' :
    							busyIndicator.hide();
    							console.log('02 Ticket ya facturado ::');
    							WL.SimpleDialog.show('Advertencia', 'El número de ticket/orden ya fue generado previamente.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '03' :
    							busyIndicator.hide();
    							console.log('03 El ticket no se puede facturar (fecha no válida) ::');
    							WL.SimpleDialog.show('Advertencia', 'Sólo se puede facturar ticket/orden del año en curso.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '04' :
    							busyIndicator.hide();
    							console.log('04 El ticket no se puede facturar (Días para facturar)::');
    							WL.SimpleDialog.show('Advertencia', 'El plazo máximo para facturar es de 15 días después de su compra.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '05' :
    							busyIndicator.hide();
    							console.log('05 Mercancía no válida::');
    							WL.SimpleDialog.show('Advertencia', 'Producto no válido para facturar.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '06' :
    							busyIndicator.hide();
    							console.log('06 Error al generar::');
    							WL.SimpleDialog.show('Advertencia', 'Error al procesar los datos, intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '07' :
    							busyIndicator.hide();
    							console.log('07 Facturación en proceso::');
    							WL.SimpleDialog.show('Advertencia', 'Su solicitud fue procesada y en un período no mayor a 72hrs deberá recibir su factura.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '08' :
    							busyIndicator.hide();
    							console.log('08 ::Ticket Ceros');
    							WL.SimpleDialog.show('Advertencia', 'Ticket/orden no válido para facturar.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '09' :
    							busyIndicator.hide();
    							console.log('09 ::Datos de facturación incorrectos');
    							WL.SimpleDialog.show('Advertencia', 'Datos fiscales inválidos para facturar.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						case '99' :
    							busyIndicator.hide();
    							console.log('99 Desconocido::');
    							WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    						default:
    							busyIndicator.hide();
    							WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
    							break;
    					}
	                } 
	                else {
	                	busyIndicator.hide();
	                	console.log('isSuccessful != true::');
	                	WL.SimpleDialog.show('Advertencia', 'No se pudo completar el servicio, intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
	                } 
	            } 
	            else {
	            	busyIndicator.hide();
	            	console.log('httpStatusCode != 200');
	            	WL.SimpleDialog.show('Advertencia', 'No se pudo completar el servicio, intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
	            }
	        },
	        onFailure : function() {
	        	busyIndicator.hide();
	        	band = true;
	        	console.log('onFailure');
		        WL.SimpleDialog.show('Advertencia', 'No se pudo completar el servicio, intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
	        }
	    });
	    
    }

    function enviaDatosRFC(rfc) {
    	console.log('se esta llamando al enviaDatosRFC ::' + rfc);

    	var invocationData = getAdapterEnviaDatosRFC(rfc);

	    WL.Client.invokeProcedure(invocationData,{
	        onSuccess : function(result) {
	        	//console.log(JSON.stringify(result));
	            var httpStatusCode = result.status;
	            if (200 == httpStatusCode) {
	            	//console.log("checo getAdapterEnviaDatosFactura :: " + JSON.stringify(result.invocationResult));
	                var invocationResult = result.invocationResult;
	                var isSuccessful = invocationResult.isSuccessful;
	                if (true == isSuccessful) {
	        	    	//console.log('Resultado del servicio rfc ' + JSON.stringify(invocationResult.text));
	        	    	var n = invocationResult.text.indexOf("Respuesta==");
    					var resultadoServicio = invocationResult.text.substring(n+11, n+13);
    					console.log('codigo de servicio ::' + resultadoServicio);
    					if (resultadoServicio == '00') {
							console.log('existe RFC');
							/*--------
							Obtener nombre
							----------*/
							var nomTemp = invocationResult.text.indexOf("Nombre==");
							var nomTemp2 = invocationResult.text.indexOf(";;", nomTemp);
	    					var nombre = invocationResult.text.substring(nomTemp+8, nomTemp2);
	    					
	    					/*
							var calleTemp = invocationResult.text.indexOf("Calle==");
							var calleTemp2 = invocationResult.text.indexOf(";;", calleTemp);
	    					var calle = invocationResult.text.substring(calleTemp+7, calleTemp2);
	    					
							var nExtTemp = invocationResult.text.indexOf("NumeroExt==");
							var nExtTemp2 = invocationResult.text.indexOf(";;", nExtTemp);
	    					var numeroExt = invocationResult.text.substring(nExtTemp+11, nExtTemp2);
	    					
							var nIntTemp = invocationResult.text.indexOf("NumeroInt==");
							var nIntTemp2 = invocationResult.text.indexOf(";;", nIntTemp);
	    					var numeroInt = invocationResult.text.substring(nIntTemp+11, nIntTemp2);
	    					
							var colTemp = invocationResult.text.indexOf("Colonia==");
							var colTemp2 = invocationResult.text.indexOf(";;", colTemp);
	    					var colonia = invocationResult.text.substring(colTemp+9, colTemp2);
	    					
							var locTemp = invocationResult.text.indexOf("Localidad==");
							var locTemp2 = invocationResult.text.indexOf(";;", locTemp);
	    					var localidad = invocationResult.text.substring(locTemp+11, locTemp2);
	    					
							var estTemp = invocationResult.text.indexOf("Estado==");
							var estTemp2 = invocationResult.text.indexOf(";;", estTemp);
	    					var estado = invocationResult.text.substring(estTemp+8, estTemp2);
	    					
							var paisTemp = invocationResult.text.indexOf("Pais==");
							var paisTemp2 = invocationResult.text.indexOf(";;", paisTemp);
	    					var pais = invocationResult.text.substring(paisTemp+6, paisTemp2);
	    					
							var cpTemp = invocationResult.text.indexOf("CodigoPostal==");
							var cpTemp2 = invocationResult.text.indexOf("STEOL", cpTemp);
	    					var codigoPostal = invocationResult.text.substring(cpTemp+14, cpTemp2);
							*/
							console.log('codigo de servicio ::' + resultadoServicio + ' nombresss ' + nombre.trim());
							$scope.factura.nombre 		= 	nombre.trim();	
							$scope.factura.RFC 			=	rfc.trim();
							/*
							$scope.factura.calle 		=	calle.trim();
							$scope.factura.numeroExt 	= 	numeroExt.trim();
							$scope.factura.numeroInt 	= 	numeroInt.trim();
							$scope.factura.colonia 		= 	colonia.trim();
							$scope.factura.localidad 	= 	localidad.trim();
							$scope.factura.estado 		= 	estado.trim();
							$scope.factura.pais 		= 	pais.trim();
							$scope.factura.codigoPostal = 	codigoPostal.trim();
							*/
							console.log("estos son los datos de la factura :: " + JSON.stringify($scope.factura));
							facturacionService.addDatosFactura($scope.factura);
							facturacionService.resetBandera();
							facturacionService.resetNumTicket();
							busyIndicator.hide();
							$state.go('app.enviaFactura');

    					}else{
    						console.log('no existe RFC');
    						console.log("estos son los datos de la factura :: " + JSON.stringify($scope.factura));
							/*
							$scope.factura.RFC 			=	rfc.trim();
							$scope.factura.pais 		=	"México";
							*/
							facturacionService.addDatosFactura($scope.factura);
							facturacionService.resetBandera();
							facturacionService.resetNumTicket();
							busyIndicator.hide();
							$state.go('app.enviaFactura');
    					}
	                } 
	                else {
	                	busyIndicator.hide();
	                	console.log('isSuccessful != true::');
	                	WL.SimpleDialog.show('Advertencia', 'No se pudo completar el servicio, intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
	                } 
	            } 
	            else {
	            	busyIndicator.hide();
	            	console.log('httpStatusCode != 200');
	            	WL.SimpleDialog.show('Advertencia', 'No se pudo completar el servicio, intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
	            }
	        },
	        onFailure : function() {
	        	busyIndicator.hide();
	        	console.log('onFailure');
		        WL.SimpleDialog.show('Advertencia', 'No se pudo completar el servicio, intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
	        }
	    });

    }

    $scope.mensajeLimite = function(){
    	WL.SimpleDialog.show("RFC", "Usted puede almacenar hasta 5 RFC, esta información se borrará cuando se desinstale la aplicación o se elimine el caché.", [ { text: "Aceptar", handler: function(){} } ]);
    }

    $scope.borrarFrecuente = function(index){
    	console.log("borrado" + index);
    	var removed = $scope.rfcFrecuente.splice(index, 1);
    }

    $scope.addRFC = function(){
    	if ($scope.rfcFrecuente.indexOf($scope.factura.RFC.toUpperCase()) === -1) {
			console.log("element doesn't exist");
		  	navigator.globalization.getPreferredLanguage(
	        function (language) {
	            var title     = 'Agregar RFC';
	            var template  = '¿Desea agregar el RFC a frecuentes?';
	            var btn1      = 'SÍ';
	            var btn2      = 'NO';
	            if (language.value == 'en-US' || language.value == 'en-MX' 
	                || language.value == 'english' || language.value == 'ingles' ){
	                    
	                title     = 'Add RFC';
	                template  = 'Do you want to add the RFC to frequent?';
	                btn1      = 'YES';
	                btn2      = 'NO';
	            }
	            
	            WL.SimpleDialog.show(title, template, [
	                {
	                    text : btn1,
	                    handler : function() {
	                    	var removed = $scope.rfcFrecuente.splice(0, 0, $scope.factura.RFC.toUpperCase());
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
		}else {
			console.log("element found");
		 	//WL.SimpleDialog.show("RFC", "El RFC ingresado ya existe", [ { text: "Aceptar", handler: function(){} } ]);
		}
    	$scope.modal2.hide();
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

	$ionicModal.fromTemplateUrl('my-modal-rfc.html', {
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
			//console.log('estos son los RFC ::' + $scope.rfcFrecuente[0]);
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
					var res = /^[a-zA-Z]{3,4}(\d{6})((\D|\d){3})$/;
			    	if (res.test($scope.factura.RFC)){
						console.log("RFC valido");
						$scope.factura.RFC = $scope.factura.RFC.toUpperCase();
						$scope.rfcInvalido = 0;
						if ($scope.checkboxModel.value1 == true && $scope.rfcFrecuente.length < 5) {
							$scope.addRFC();
					    }else{
					    	console.log('Ya son 5');
					    	$scope.modal2.hide();
					    }
				 	} else {
				   		console.log("RFC invalido");
				   		$scope.rfcInvalido = 1;
				  	}
				}else{
					$scope.rfcInvalido = 0;
					$scope.modal2.hide();
				}
			break;
			case 3 :
				$scope.factura.RFC = '';
				$scope.modal2.hide();
			break;
			default : 
				$scope.factura.RFC = '';
				$scope.modal2.hide();
			break;
		}
	};

	$scope.preguntasFrecuentes = function(){
		busyIndicator.show();
		console.log('band' + band);
		if(band == true){
			band = false;
			var invocationData = getpreguntasFrecuentes();

	        WL.Client.invokeProcedure(invocationData,{
	            onSuccess : function(result) {
	            	busyIndicator.hide();                
	                var httpStatusCode = result.invocationResult.statusCode;
	                if (200 == httpStatusCode) {
	                    var invocationResult = result.invocationResult;
	                    var isSuccessful = invocationResult.isSuccessful;
	                    if (true == isSuccessful) {
	                    	var subCadena = JSON.stringify(invocationResult.array);
	                    	facturacionService.putpreguntasFrecuentes(subCadena);
	                        $state.go('app.preguntasFrecuentes');
	                    } 
	                    else {          
	                    	WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);              
	                    	console.log('Error de servidor != isSuccessful');    
	                    }                    
	                } 
	                else {
	                	WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
	                    console.log('Error de servidor != 200');
	                }
	                busyIndicator.hide();
	                band = true;
	            },
	            onFailure : function() {
	            	busyIndicator.hide();
	                console.log('sin respuesta del servidor');
	                WL.SimpleDialog.show('Advertencia', 'Su solicitud no pudo ser procesada, por favor intente más tarde.', [ { text: "Aceptar", handler: function(){} } ]);
	                band = true;
	                //WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
	            }
	        });
	    	
		}else{
			console.log('segundo intento');
		}

	}


	$scope.$on('modal.hidden', function(event, modal) {
		// Execute action
		console.log('Modal ' + modal.id + ' is hidden!');
		$scope.checkboxModel.value1 = false;
		
	});

	$scope.$on('$ionicView.leave', function(){
        console.log('Reset antes de irse ::');
        facturacionService.putNoTicket($scope.factura.ticketOrden);
        localStorage.setItem("rfcFrecuente", $scope.rfcFrecuente);
    });

});