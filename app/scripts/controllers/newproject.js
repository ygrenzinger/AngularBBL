'use strict';

angular.module('crowfundingApp')
  .controller('NewProjectCtrl', function ($scope, $http) {

  	$scope.project = {};

  	$scope.errorMessage = null;
    $scope.created = false;

    $http.get('http://localhost:1212/types').success(function(data) {
      $scope.types = data;
    });

    $scope.submit = function() {
	    $http.post('http://localhost:1212/project', $scope.project)
	    	.success(function() {
          $scope.errorMessage = null;
	    		$scope.created = true;
	    	})
        .error(function(data, status, headers, config) {
          $scope.errorMessage = data;
          $scope.created = false;
        });
    };

  });
