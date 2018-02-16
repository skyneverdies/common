'use strict';

angular.module('starter.anegocios', [])

	.controller('SucursalesANController', function ($scope, $timeout) {
		$scope.$parent.showHeader();
		$scope.$parent.clearFabs();
		$scope.isExpanded = false;
		$scope.$parent.setExpanded(false);
		$scope.$parent.setHeaderFab(false);

		$timeout( function(){
			},0
		);

	})
;