'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Crowfunding app', function() {

  describe('When going to the Home page', function() {

    beforeEach(function() {
      browser().navigateTo('../../app/index-e2e.html#/');
    });

    it('should render home', function() {
      expect(element('a.brand').text()).toMatch(/Project crowfunding/);
    });

  });

  describe('When going to the New project page', function() {

    beforeEach(function() {
      browser().navigateTo('../../app/index-e2e.html#/new');
    });

    it('should display a form to create a project', function() {
      expect(element('#projectTitle').count()).toBe(1);
      expect(element('#fundingNeeds').count()).toBe(1);
      expect(element('#limitDate').count()).toBe(1);
      expect(element('#description').count()).toBe(1);
    });

    it('should not possible to create the project if the input are incorrect', function() {
      input('project.title').enter('');
      input('project.money').enter(0);
      input('project.date').enter("2053-01-01");
      select('project.type').option('Javascript');
      expect(element("#createProject").attr("disabled")).toBe("disabled");
    });

    it('should display success if create a correct project', function() {
      input('project.title').enter('AngularJSScenario');
      input('project.money').enter(100);
      input('project.date').enter("2053-01-01");
      input('project.description').enter('Testing create project');
      select('project.type').option('Javascript');
      element('#createProject').click();
      //expect(element(".alert-error").attr("style")).toMatch(/display: none;/);
      //expect(element(".alert-success").attr("style")).not().toMatch(/display: none;/);
    });

  });

  describe('When going to the Projects page', function() {

    beforeEach(function() {
      browser().navigateTo('../../app/index-e2e.html#/projects');
    });

    it('should display a list of projects', function() {
      expect(element('tbody tr').count()).toBeGreaterThan(0);
    });

    it('entering AngularScalaScenario should filter the list of projects to no result', function() {
      input('titleFilter').enter('AngularScalaScenario');
      expect(element('tbody tr').count()).toBe(0);
    });

    it('entering AngularJSScenario should filter the list of projects to one project', function() {
      input('titleFilter').enter('AngularJSScenario');
      expect(element('tbody tr').count()).toBe(1);
    });

    it('should go to project page after clicking on the row result', function() {
      input('titleFilter').enter('AngularJSScenario');
      element('tbody tr').click();
      expect(browser().location().url()).toBe('/project/AngularJSScenario');
    });

  });

  describe('when going the AngularJSScenario project page', function() {

    beforeEach(function() {
      browser().navigateTo('../../app/index-e2e.html#/project/AngularJSScenario');
    });

    it('should display informations about AngularJSScenario project', function() {
      var content = element('.container').text();
      expect(content).toMatch(/AngularJSScenario/);
      expect(content).toMatch(/100/);
      expect(content).toMatch(/January 1, 2053/);
      expect(content).toMatch(/Testing create project/);
    });

  });


});