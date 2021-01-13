'use strict';

const { prop } = require('lodash/fp');
const { contentTypes: contentTypesUtils } = require('strapi-utils');
const { getService } = require('../utils');

module.exports = {
  canConfigureContentType({ userAbility, contentType }) {
    const action = contentTypesUtils.isSingleType(contentType)
      ? 'plugins::content-manager.single-types.configure-view'
      : 'plugins::content-manager.collection-types.configure-view';

    return userAbility.can(action);
  },

  registerPermissions() {
    const displayedContentTypes = getService('content-types').findDisplayedContentTypes();

    const contentTypesUids = displayedContentTypes.map(prop('uid'));

    const draftAndPublishContentTypesUids = displayedContentTypes
      .filter(contentTypesUtils.hasDraftAndPublish)
      .map(prop('uid'));

    const actions = [
      {
        section: 'contentTypes',
        displayName: 'Create',
        uid: 'explorer.create',
        pluginName: 'content-manager',
        subjects: contentTypesUids,
      },
      {
        section: 'contentTypes',
        displayName: 'Read',
        uid: 'explorer.read',
        pluginName: 'content-manager',
        subjects: contentTypesUids,
      },
      {
        section: 'contentTypes',
        displayName: 'Update',
        uid: 'explorer.update',
        pluginName: 'content-manager',
        subjects: contentTypesUids,
      },
      {
        section: 'contentTypes',
        displayName: 'Delete',
        uid: 'explorer.delete',
        pluginName: 'content-manager',
        subjects: contentTypesUids,
        options: {
          fieldsRestriction: false,
        },
      },
      {
        section: 'contentTypes',
        displayName: 'Publish',
        uid: 'explorer.publish',
        pluginName: 'content-manager',
        subjects: draftAndPublishContentTypesUids,
        options: {
          fieldsRestriction: false,
        },
      },
      {
        section: 'plugins',
        displayName: 'Configure view',
        uid: 'single-types.configure-view',
        subCategory: 'single types',
        pluginName: 'content-manager',
      },
      {
        section: 'plugins',
        displayName: 'Configure view',
        uid: 'collection-types.configure-view',
        subCategory: 'collection types',
        pluginName: 'content-manager',
      },
      {
        section: 'plugins',
        displayName: 'Configure Layout',
        uid: 'components.configure-layout',
        subCategory: 'components',
        pluginName: 'content-manager',
      },
    ];

    strapi.admin.services.permission.actionProvider.register(actions);
  },
};