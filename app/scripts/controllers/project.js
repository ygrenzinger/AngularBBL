'use strict';

angular.module('crowfundingApp')
  .controller('ProjectCtrl', function ($scope, $http, $routeParams) {
    $http.get('http://localhost:1212/project/'+$routeParams.title).success(function(data) {
    	$scope.project = data;
    });
  });
