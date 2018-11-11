import JiraWrapper from "~/js/services/jira";
import UrlService from "~/js/services/urlService";
import { alert } from "~/js/util/dialog";
import angular from "angular";

// todo: decouple this class on components and use ES6 syntax. Currently it's require too many afforts. MR
export default function PopupController($scope, $timeout, browser, storageService, repositoryService) {
    $scope.insideJiraPage = false;

    var jira = {};

    var initJira = function () {
        const urlService = new UrlService(browser);
        urlService.getCurrentBaseUrl()
            .then((url) => {
                jira = new JiraWrapper(url);
                return jira.checkIsInsideJira(url);
            })
            .then((inJira) => {
                $scope.insideJiraPage = inJira;
                $scope.$apply($scope.insideJiraPage);
            });
    }
    initJira();

    var resetLoadingDeferred = function () {
        $timeout(() => { $scope.loading = false; }, 200);
    }

    $scope.repoApiAvailable = false;
    $scope.svnCommits = [];
    $scope.templates = [];

    $scope.refreshCommits = function () {
        $scope.svnCommits = [];
        $scope.loading = true;
        $scope.loadingDescription = "Loading commits";
        storageService.getRepositories().then((repositories) => {
            if (typeof repositories === "undefined" || repositories.length === 0) {
                resetLoadingDeferred();
            }
            angular.forEach(repositories, (repo) => {
                repositoryService.getLastCommits(repo, $scope.addCommits)
                    .then((commits) => angular.copy(commits, $scope.svnCommits))
                    .catch(() => {
                        const msg = `Oops! Something went wrong while getting your commits for '${repo.name}' repository.`;
                        alert(msg, "Warning!");
                    })
                    .finally(() => { $scope.loading = false; });
            });
        });
    };

    $scope.refreshTemplates = function () {
        $scope.templates = [];
        $scope.loading = true;
        $scope.loadingDescription = "Loading templates";
        storageService.getTemplates().then((templates) => {
            if (typeof templates !== "undefined" && templates.length !== 0) {
                angular.forEach(templates, (template) => {
                    $scope.templates.push(template);
                });
            }
            resetLoadingDeferred();
        });
    };

    $scope.openOptions = function () {
        browser.tabs.create({
            url: "options.html"
        });
    };

    $scope.addIssueSummary = function () {
        browser.tabs.getSelected(null, (tab) => {
            jira.getIssueInfo(tab.url)
                .then((summary) => {
                    const issueSummary = JSON.stringify(summary);
                    const code = `document.activeElement.value = ${issueSummary} + document.activeElement.value`;
                    browser.tabs.executeScript({ code });
                });
        });
    };

    $scope.addMessageToReport = function (subject, message) {
        subject.justAdded = true;
        setTimeout(() => {
            subject.justAdded = false;
            $scope.$apply(subject);
        }, 1000);

        const code = `document.activeElement.value = document.activeElement.value + ${JSON.stringify(message)} + '\\n';true`;
        browser.tabs.executeScript({ code });
    };

    this.initialize = function () {
        $scope.refreshTemplates();

        repositoryService.checkConnection()
            .then((established) => {
                $scope.repoApiAvailable = established;
                if (!established) {
                    throw new Error("Repo API unavailable");
                }
            })
            .then(() => $scope.refreshCommits())
            .catch(() => { $scope.repoApiAvailable = false; });
    }

    this.initialize();
}

PopupController.$inject = ["$scope", "$timeout", "browser", "storageService", "repositoryService"];