'use strict';

var crowfundingApp = angular.module('crowfundingApp', ['ui'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/new', {
        templateUrl: 'views/newproject.html',
        controller: 'NewProjectCtrl'
      })
      .when('/projects', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl'
      })
      .when('/project/:title', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      })
      .otherwise({
        redirectTo: '/home'
      });
});

crowfundingApp.filter('typeClass', function() {
  return function(input) {
    if (input === 'Scala') return 'info';
    if (input === 'Javascript') return 'warning';
    if (input === 'HTML5') return 'error';
    if (input === 'NoSql') return 'success';
  };
});

crowfundingApp.directive('autoComplete', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs)
        {
            scope.$watch(attrs.titles, function (titles) {
                element.autocomplete({
                    source: titles,
                    select: function() {
                        $timeout(function() {
                            element.trigger('input');
                        }, 0);
                    }
                });
            }, true );
        }
    };
});
