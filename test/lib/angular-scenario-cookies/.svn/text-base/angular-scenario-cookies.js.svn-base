/**
 * Used in acceptance tests to manage http cookies
 */
angular.scenario.dsl('cookies', function () {
    var chain = {};
    chain.set = function (name, value) {
        return this.addFutureAction('set cookie', function ($window, $document, done) {
            var injector = $window.angular.element($window.document.body).inheritedData('$injector');
            var cookies = injector.get('$cookies');
            var root = injector.get('$rootScope');
            cookies[name] = value;
            root.$apply();
            done(null, value);
        });
    };

    return function () {
        return chain;
    }
});
