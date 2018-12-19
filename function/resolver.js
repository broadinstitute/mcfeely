// normalize a notification by looking up values in the profile service

// input object format:
// * userEmail or userId
// * optional replyTos (set of user subject IDs)
// * notificationId (sendgrid template)
// * substitutions map
// * emailLookupSubstitutions map (by user subject ID)
// * nameLookupSubstitution map (by user subject ID)

// output object format:
// * toAddress
// * replyTos
// * notificationId
// * resolvedSubstitutions

class Resolver {
    constructor(config) {
        this.fireCloudPortalUrl = config.fireCloudPortalUrl;
        this.notificationTemplateMap = config.notificationTemplateMap;
    }

    lookup(notification, profileService = defaultProfileService) {
        return {
            toAddress: this.resolveTo(notification, profileService),
            replyTos: this.resolveReplyTos(notification.replyTos, profileService),
            notificationId: notification.notificationId,
            resolvedSubstitutions: this.resolveSubs(notification, profileService)
        }
    }

    // use userEmail if it exists
    // else use the userId to look up the user's preferred email
    resolveTo(notification, profileService) {
        return notification.userEmail ||
            profileService.preferredEmail(notification.userId);
    }

    // look up the users' preferred emails using their IDs
    resolveReplyTos(replyTos, profileService) {
        if (!replyTos) {
            return []
        }

        return replyTos.map(userId => {
            return profileService.preferredEmail(userId);
        });
    }

    // look up preferred emails in the emailLookupSubstitutions map
    // look up user names in the nameLookupSubstitutions map
    // combine all substitutions with marker characters
    resolveSubs(notification, profileService) {
        // TODO: is there a more functional way to do this?

        const allSubs = notification.substitutions || {};

        Object.keys(notification.emailLookupSubstitutions || {}).forEach(key => {
            allSubs[key] = profileService.preferredEmail(notification.emailLookupSubstitutions[key])
        });

        Object.keys(notification.nameLookupSubstitution || {}).forEach(key => {
            allSubs[key] = profileService.userName(notification.nameLookupSubstitution[key])
        });

        return allSubs;
    }
}

// TODO!  connect to the profile service.  overridable by tests.
const defaultProfileService = {
    preferredEmail: function (userId) {
        return 'not@valid.email'
    },
    userName: function (userId) {
        return 'Not Implementedson'
    }
};

exports.Resolver = Resolver;
