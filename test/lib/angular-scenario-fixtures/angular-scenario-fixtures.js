/**
 * Used in acceptance tests to perform http requests to inject data
 */
angular.scenario.dsl('fixtures', function () {

    var FIXTURE_URL = '/fixtures';
    var USER_URL = FIXTURE_URL + '/user';

    var RELEASE_TYPE = 'releaseit.Release';
    var PHASE_TYPE = 'releaseit.Phase';
    var TEAM_TYPE = 'releaseit.Team';
    var TASK_TYPE = 'releaseit.Task';
    var COMMENT_TYPE = 'releaseit.Comment';
    var DEFAULT_TASK_OWNER = "John";

    var formatResponse = function (data, status) {
        return "Received HTTP code: " + status + " Response: " + data;
    };

    var makeHttp = function (window) {
        var injector = window.angular.element(window.document.body).inheritedData('$injector');
        return injector.get('$http');
    };

    var handle = function (promise, done) {
        promise
            .success(function (data, status) {
                done(null, formatResponse(data, status));
            }).error(function (data, status) {
                done(formatResponse(data, status), null);
            });
    };

    var completeRelease = function (release) {
        var completedRelease = _.omit(release, "phases", "teams");
        completedRelease.type = RELEASE_TYPE;
        completedRelease.id = "Applications/" + completedRelease.id;
        if (release.owner === undefined) {
            completedRelease.owner = "John"; // the release manager
        }
        return completedRelease;
    };

    var completePhase = function (phase, release, index) {
        var completedPhase = _.omit(phase, "tasks");
        completedPhase.type = PHASE_TYPE;
        completedPhase.id = release.id + "/Phase" + index;
        return completedPhase;
    };

    var completeTask = function (task, phase, index) {
        var completedTask = _.omit(task, "comments");
        completedTask.type = TASK_TYPE;
        completedTask.id = phase.id + "/Task" + index;
        if (task.owner === undefined) {
            completedTask.owner = DEFAULT_TASK_OWNER;
        }
        return completedTask;
    };

    var completeComment = function (comment, task, index) {
        comment.type = COMMENT_TYPE;
        comment.id = task.id + "/Comment" + index;
        return comment;
    };

    var completeTeam = function (team, release, index) {
        team.type = TEAM_TYPE;
        team.id = release.id + "/Team" + index;

        return team;
    };

    var completeUserProfiles = function (usernames) {
        var userProfilesDirectory = "Infrastructure/UserProfile";
        var userProfiles = [
            {type: "core.Directory", id: userProfilesDirectory}
        ];
        for (var i = 0; i < usernames.length; i++) {
            var userProfile = {
                id: userProfilesDirectory + '/' + usernames[i],
                type: "releaseit.UserProfile",
                email: usernames[i] + "@foobar.com"
            };
            userProfiles.push(userProfile);
        }
        return userProfiles;
    };

    var getReleaseEntities = function (release) {
        var completedRelease = completeRelease(release);
        var phases = [];
        var tasks = [];
        var comments = [];
        var teams = [];

        if (release.phases !== undefined) {
            for (var i = 0; i < release.phases.length; i++) {
                var phase = release.phases[i];
                var completedPhase = completePhase(phase, completedRelease, i);
                phases.push(completedPhase);
                if (phase.tasks === undefined) {
                    continue;
                }
                for (var j = 0; j < phase.tasks.length; j++) {
                    var task = phase.tasks[j];
                    var completedTask = completeTask(task, completedPhase, j);
                    tasks.push(completedTask);
                    if (task.comments === undefined) {
                        continue;
                    }
                    for (var k = 0; k < task.comments.length; k++) {
                        var completedComment = completeComment(task.comments[k], completedTask, k);
                        comments.push(completedComment);
                    }
                }
            }
        }
        if (release.teams !== undefined) {
            for (var i = 0; i < release.teams.length; i++) {
                var team = release.teams[i];
                var completedTeam = completeTeam(team, completedRelease, i);

                teams.push(completedTeam);
            }
        }
        return _.union([completedRelease], teams, phases, tasks, comments);
    };

    var chain = {};

    var config = {
        headers: {
            Authorization: 'Basic YWRtaW46YWRtaW4=' // admin:admin
        }
    };
    chain.delete = function (releaseId) {
        return this.addFutureAction("Http-Delete: " + releaseId, function ($window, $document, done) {
            var http = makeHttp($window);
            handle(http.delete(FIXTURE_URL + "/" + releaseId, config), done);
        });
    };

    chain.release = function (data) {
        return this.addFutureAction("Http-Post: " + FIXTURE_URL, function ($window, $document, done) {
            var http = makeHttp($window);
            handle(http.post(FIXTURE_URL, getReleaseEntities(data), config), done);
        });
    };

    chain.addDefaultUser = function () {
        var url = USER_URL + '/John';
        return this.addFutureAction("Http-Post: " + url, function ($window, $document, done) {
            var http = makeHttp($window);
            handle(http.post(url, 'John', config), done);
        });
    };

    chain.deleteDefaultUser = function () {
        var url = USER_URL + '/John';
        return this.addFutureAction(url, function ($window, $document, done) {
            var http = makeHttp($window);
            handle(http.delete(url, config), done);
        });
    };

    chain.addDefaultSmtpServer = function () {
        var defaultSmtpServer = [
            { type: "core.Directory", id: "Configuration/mail" },
            { type: "releaseit.SmtpServer", id: "Configuration/mail/SmtpServer", host: "localhost", port: "25", fromAddress: "foo@bar.com" }
        ];
        return this.addFutureAction("Http-Post: " + FIXTURE_URL, function ($window, $document, done) {
            var http = makeHttp($window);
            handle(http.post(FIXTURE_URL, defaultSmtpServer, config), done);
        });
    };

    chain.deleteDefaultSmtpServer = function () {
        var url = FIXTURE_URL + '/configuration/mail';
        return this.addFutureAction(url, function ($window, $document, done) {
            var http = makeHttp($window);
            handle(http.delete(url, config), done);
        });
    };

    chain.userProfiles = function (userProfiles) {
        userProfiles = completeUserProfiles(userProfiles);
        return this.addFutureAction("Http-Post: " + FIXTURE_URL, function ($window, $document, done) {
            var http = makeHttp($window);
            handle(http.post(FIXTURE_URL, userProfiles, config), done);
        });
    };

    chain.deleteUserProfiles = function () {
        var url = FIXTURE_URL + '/infrastructure/UserProfile';
        return this.addFutureAction(url, function ($window, $document, done) {
            var http = makeHttp($window);
            handle(http.delete(url, config), done);
        });
    };

    return function () {
        return chain;
    }
});
