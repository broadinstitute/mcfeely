const renderedConfig = {
    fireCloudPortalUrl: 'placeholder',

    sendgrid: {
        apiKey: 'fill me in later',
        substitutionChar: 'fill me in later',
        defaultFromAddress: 'fill me in later',
        defaultFromName: 'fill me in later',
    },

    notificationTemplateMap: {
        'ActivationNotification': 'blah1',
        'WorkspaceAddedNotification': 'blah2',
        'WorkspaceRemovedNotification': 'blah3',
        'WorkspaceInvitedNotification': 'blah4',
        'WorkspaceChangedNotification': 'blah5',
        'GroupAccessRequestNotification': 'blah6',
    }
};

class Config {
    // class constructor accepts config overrides, so unit tests can have some control
    constructor(configObj) {
        const argConfig = configObj || {};
        this.fireCloudPortalUrl = argConfig.fireCloudPortalUrl || renderedConfig.fireCloudPortalUrl;
        this.sendgrid = argConfig.sendgrid || renderedConfig.sendgrid;
        this.notificationTemplateMap = argConfig.notificationTemplateMap || renderedConfig.notificationTemplateMap;
    }
}

exports.Config = Config;