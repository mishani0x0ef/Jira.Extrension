import "~/css/content.scss";

import { AutoIssueSummaryExtender, CloseIssueExtender, LogTemplatesExtender, LogTimeExtender } from "./extenders";

import StorageService from "~/js/services/storageService";
import { checkIsInsideJira } from "~/js/util/jira";

class ContentController {
    constructor(browser) {
        this.browser = browser;
        this.storage = new StorageService(browser);
    }

    start() {
        this.extenders = [];

        return Promise.all([this.storage.getGeneralSettings(), checkIsInsideJira()])
            .then(([settings, insideJira]) => {
                if (insideJira) {
                    this._addJiraExtenders(this.extenders, settings);
                }
                this.extenders.forEach((extender) => extender.start());
            });
    }

    _addJiraExtenders(extenders, settings) {
        extenders.push(
            new CloseIssueExtender(),
            new LogTimeExtender(),
            new LogTemplatesExtender(this.storage, this.browser)
        );

        if (settings.autoIssueSummary.enabled) {
            extenders.push(new AutoIssueSummaryExtender());
        }
    }
}

var content = new ContentController(chrome);
content.start();