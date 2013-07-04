/**
 * Used in acceptance tests to perform http
 */
angular.scenario.dsl('http', function () {

    var makeHttp = function (window) {
        var injector = window.angular.element(window.document.body).inheritedData('$injector');
        return injector.get('$http');
    };

    var handle = function (promise, done) {
        promise
            .success(function (data, status) {
                done(null, status);
            }).error(function (data, status) {
                done(null, status);
            });
    };

    var chain = {};
    chain.get = function (url) {
        return this.addFutureAction("Http-GET: " + url, function ($window, $document, done) {
            var http = makeHttp($window);
            handle(http.get(url), done);
        });
    };

    return function () {
        return chain;
    }
});
