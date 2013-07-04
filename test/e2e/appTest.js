'use strict';

angular.module('crowfundingAppTest', ['crowfundingApp', 'ngMockE2E'])
	.run(function($httpBackend) {
	var project = {
		title: 'AngularJSScenario',
		money: 100,
		date: '2053-01-01',
		description: 'Testing create project'
	}
	var projects = [project];
	var types = ["Javascript"];
	console.log('crowfundingAppTest running');

	$httpBackend.whenGET('http://localhost:1212/projects').respond(projects);

	$httpBackend.whenPOST('http://localhost:1212/project').respond(function(method, url, data, headers) {
	  console.log('Received these data:', method, url, data, headers);
	  projects.push(angular.fromJson(data));
	  return [200, {}, {}];
	});
	$httpBackend.whenGET('http://localhost:1212/project/AngularJSScenario').respond(project);

	$httpBackend.whenGET('http://localhost:1212/projects/titles').respond(project.title);
	$httpBackend.whenGET('http://localhost:1212/types').respond(types);
	$httpBackend.whenGET().passThrough();
});