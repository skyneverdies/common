'use strict';

angular.module('starter.pagocc', [])

.controller('PagoccController', function ($ionicPlatform, $scope, $state, $stateParams, $timeout, 
											$ionicScrollDelegate, busyIndicator, $interval,
											$ionicBackdrop, $ionicModal, $window , 
											$ionicSlideBoxDelegate, $mdBottomSheet, $mdToast, checkTokenCC) {
	// Set Header
	$scope.$parent.showHeader();
	var prmTimer = 0;

	var dataServicesTemp;
    var datosServicio;
	
    dataServicesTemp = localStorage.getItem('dataService') || '<empty>';
    datosServicio = JSON.parse(dataServicesTemp);
    var ckeck = checkTokenCC.getTotal()
    console.log('ckeckTokenCC :: ' + ckeck);
    var tempCashCard = localStorage.getItem('prmCashCardNumber') || '';
    $scope.cashCard = tempCashCard.substr(tempCashCard.length - 4);


	if (checkTokenCC.getTotal() == 0) {
		checkTokenCC.addone();
		
		var prmTrxId = localStorage.getItem('prmTrxId', prmTrxId);
        var prmOrderId = localStorage.getItem('prmOrderId', prmOrderId);
        var prmMembershipIPK = datosServicio.ipk;
        var prmCardNumber = datosServicio.membershipNumber;
        var prmCashCardNumber = localStorage.getItem('prmCashCardNumber') || '';

        generaToken(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber);
		
	    var fechaUltimaActualizacion = localStorage.getItem('fechaUltimaActualizacion') || '';
	    var prmAmountBalance = localStorage.getItem('prmAmountBalance') || '';
        /*
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
        */

        var amount = localStorage.getItem('prmAmountBalanceFmt') || '';
        //var amount = localStorage.getItem('prmAmountBalance') || '';
        console.log('este es el formato ' + amount);

        $scope.amount = amount;

	    $scope.saldo = { monto: prmAmountBalance,
	    fecha: fechaUltimaActualizacion
	    };
			
	}  else {
		checkTokenCC.reset();
	}

        
		function generaToken(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber) {
			//WL.Toast.show ("Generando token");
			var invocationData = getAdapterGeneraToken(prmTrxId, prmOrderId, prmMembershipIPK, prmCardNumber, prmCashCardNumber);

		    WL.Client.invokeProcedure(invocationData,{
		        onSuccess : generaTokenSuccess,
		        onFailure : generaTokenFailure
		    });
		}

		function generaTokenSuccess(result) {
		    var httpStatusCode = result.status;
		    if (200 == httpStatusCode) {
		        var invocationResult = result.invocationResult;
		        var isSuccessful = invocationResult.isSuccessful;
		        if (true == isSuccessful) {
                    busyIndicator.hide();
		            var prmTokenNumber = invocationResult.prmTokenNumber;
		            prmTimer = invocationResult.prmTimer;
//		        	localStorage.setItem('prmTokenNumber', prmTokenNumber);
//		        	localStorage.setItem('prmTimer', prmTimer);
		        	
    	            var TokenOriginal = prmTokenNumber.toString();
    	            $scope.token = TokenOriginal;
    	            
    	            var COLOR_ROJO = "#E43224";
    	    		var COLOR_AZUL = "#2A6081";
    	    		var COLOR_VERDE = "#229606";
    	            var mytimeout = null; // the current timeoutID
    	            // actual timer method, counts down every second, stops on zero

    	            $scope.init = function () {
    	                $scope.selectTimer();
    	                $scope.startTimer();
    	            };

    	            $scope.onTimeout = function() {
    	                if ($scope.timer === 0) {
    	                    $scope.$broadcast('timer-stopped', 0);
    	                    $timeout.cancel(mytimeout);
    	                    return;
    	                }
    	                $scope.timer--;
    	                mytimeout = $timeout($scope.onTimeout, 1000);
    	            };
    	            // functions to control the timer
    	            // starts the timer
    	            $scope.startTimer = function() {
    	                mytimeout = $timeout($scope.onTimeout, 1000);
    	                $scope.started = true;
    	            };

    	            // stops and resets the current timer
    	            $scope.stopTimer = function(closingModal) {
    	                if (closingModal != true) {
    	                    $scope.$broadcast('timer-stopped', $scope.timer);
    	                }
    	                $scope.timer = $scope.timeForTimer;
    	                $scope.started = false;
    	                $scope.paused = false;
    	                $timeout.cancel(mytimeout);
    	            };
    	            // pauses the timer
    	            $scope.pauseTimer = function() {
    	                $scope.$broadcast('timer-stopped', $scope.timer);
    	                $scope.started = false;
    	                $scope.paused = true;
    	                $timeout.cancel(mytimeout);
    	            };

    	            // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
    	            $scope.$on('timer-stopped', function(event, remaining) {
    	                if (remaining === 0) {
    	                    $scope.done = true;
    	                }
    	            });
    	            
    	            // UI
    	            // When you press a timer button this function is called
    	            $scope.selectTimer = function() {
    	                $scope.timeForTimer = prmTimer;
    	                $scope.timer = prmTimer;
    	                $scope.started = false;
    	                $scope.paused = false;
    	                $scope.done = false;
    	            };

    	            // This function helps to display the time in a correct way in the center of the timer
    	            $scope.humanizeDurationTimer = function(input, units) {
    	                // units is a string with possible values of y, M, w, d, h, m, s, ms
    	                if (input == 0) {
    	                	$state.go('app.homecc');
    	                } else {
    	                    var duration = moment().startOf('day').add(input, units);
    	                    var format = "";
    	                    if (duration.hour() > 0) {
    	                        format += "H[h] ";
    	                    }
    	                    if (duration.minute() > 0) {
    	                        format += "m[m] ";
    	                    }
    	                    if (duration.second() > 0) {
    	                        format += "s[s] ";
    	                    }
    	                    return duration.format(format);
    	                }
    	                
    	            };
    	            
    	            $scope.getColor = function(input){
    	            	var color = COLOR_ROJO;
    	            	if(input < 11){
    	            		color = COLOR_ROJO;
    	            		return color;
    	            	}else{
    	            		color = COLOR_AZUL;
    	            		return color;
    	            	}
    	            };
    	            
    	            $scope.getColorT = function(input){
    	            
    	            	if(input < 11){
    	            		
    	            		return {color: "#E43224"}
    	            	}else{
    	            		
        	            	return {color: "#229606"}
    	            	}
    	            };

    	            $scope.init();
		        	
		        } 
		        else {
		           busyIndicator.hide();
                   WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
		           $state.go('app.homecc');
                }                    
		    } 
		    else {
		        busyIndicator.hide();
                WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
		        $state.go('app.homecc');
            }
		}

		function generaTokenFailure(result){
		    busyIndicator.hide();
            WL.SimpleDialog.show(msgTitulo, msg, [ { text: "Aceptar", handler: function(){} } ]);
		    $state.go('app.homecc');
        }

        $scope.cancelar = function () {
            checkTokenCC.reset();
            $state.go('app.homecc');
        };

        $scope.$on('$ionicView.leave', function(){
            console.log('Reset antes de irse ::');
            checkTokenCC.reset();
        });

        $ionicPlatform.registerBackButtonAction(function () {
            console.log('ButtonBack oprimido en pagoCC');
            navigator.app.backHistory();
        }, 100);
        
});

