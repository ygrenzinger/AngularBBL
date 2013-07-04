'use strict';

angular.module('crowfundingApp')
  .controller('ListCtrl', function ($scope, $http, $location) {
    $http.get('http://localhost:1212/projects/titles').success(function(data) {
    	$scope.titles = data;
    });

    $http.get('http://localhost:1212/projects').success(function(data) {
    	$scope.projects = data;
    });

    $scope.goTo = function(title) {
    	$location.path('/project/'+title)
    };

  });
