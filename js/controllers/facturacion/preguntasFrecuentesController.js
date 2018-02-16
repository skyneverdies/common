'use strict';

angular.module('starter.preguntasFrecuentes', [])

.controller('PreguntasFrecuentes', function ($scope, $timeout, $state, facturacionService, $ionicModal) {
	console.log('preguntaspreguntaspreguntas');

	$scope.arrayPreguntasFrecuentes = JSON.parse(facturacionService.getpreguntasFrecuentes());

	$scope.$on('$ionicView.leave', function(){
        console.log('Reset antes de irse ::');
        facturacionService.resetpreguntasFrecuentes();
    });
});