export default {
  _label: 'EN',

  // intro

  'intro': require('./thank-you-bug.md'),
  'intro-modal-title': 'The reason behind our strict issue policy',
  'intro-modal': require('./intro-modal.md'),

  // all report types

  // 'type-title': 'This is a',

  'title-title': 'Title',
  'title-placeholder-bug': 'Enter a brief and clear title that expresses the problem.',
  'title-placeholder-feature': 'Enter a brief and clear title that expresses the enhancement you\'d like to see.',

  'additional-info-title': 'Additional comments (optional)',
  'additional-info-placeholder-feature': require('./additional-info-placeholder-feature.txt'),
  'additional-info-placeholder-bug': require('./additional-info-placeholder-bug.txt'),

  'attachments-title': 'Attachments (optional)',
  'attachments-subtitle-feature': require('./attachments-subtitle-feature.md'),
  'attachments-subtitle-bug': require('./attachments-subtitle-bug.md'),

  // bug report tab

  'bug-description-title': 'Description',
  'bug-description-placeholder': 'Provide a descriptive summary of the problem.',

  'repo-title': 'I am opening an issue for',
  'repo-subtitle': 'Please make sure to file the issue at appropriate repo.',

  'version-title': 'Version',
  'version-subtitle': 'Check if the issue is reproducible with the latest stable version of Vue.',

  'context-title': 'Context',
  'context-placeholder':
      'Specify under which circumstances the bug occurs.',
  'context-subtitle': require('./context-subtitle.md'),

  'repro-title': 'Link to minimal reproduction',
  'repro-subtitle': require('./repro-subtitle.md'),
  'repro-modal-title': 'About Reproductions',
  'repro-modal': require('./repro-modal.md'),
  'cli-repro-subtitle': require('./cli-repro-subtitle.md'),
  'cli-no-repro': 'If your issue cannot be reproduced with code, check here.',
  'router-next-repro-subtitle': require('./router-next-repro-subtitle.md'),

  'node-and-os-title': 'Node, npm/yarn and OS info',
  'node-and-os-subtitle': 'Please specify node.js version, npm or yarn version, OS name & version. Example: Node 10.7.0 / yarn 1.7.0 / Windows 10',

  'cli-envinfo-title': 'Environment Info',
  'cli-envinfo-subtitle': require('./cli-envinfo-subtitle.md'),

  'browser-and-os-title': 'Browser and OS info',
  'browser-and-os-subtitle': 'Please specify browser name & version, OS name & version. Example: Chrome 62 / Windows 10',

  'steps-title': 'Steps to reproduce',
  'steps-placeholder':
      '1. Detail the exact steps taken to reproduce the problem \n' +
      '2. Number each step \n' +
      '3. Pat yourself on the back! This is very helpful :D',
  'steps-subtitle': require('./steps-subtitle.md'),

  'expected-title': 'What is expected?',
  'actual-title': 'What is actually happening?',

  // feature request tab

  'feature-description-title': 'Description',
  'feature-description-placeholder': 'Provide a descriptive summary of the enhancement you\'d like to see.',

  'rationale-title': 'Rationale',
  'rationale-placeholder': require('./rationale-placeholder.txt'),
  // 'rationale-subtitle': require('./rationale-subtitle.md'),

  'proposal-title': 'What does the proposed API look like?',
  'proposal-subtitle': require('./proposal-subtitle.md'),

  // other tab

  'other': 'Other',

  'title-title-other': 'Title',
  'title-placeholder-other': 'Enter any title.',

  'body-title-other': 'Body (optional)',
  'body-placeholder-other': 'Type in anything.',

  // Thank you

  'thank-you-bug': require('./thank-you-bug.md'),
  'thank-you-feature': require('./thank-you-feature.md'),
  'thank-you-other': require('./thank-you-other.md'),

  // misc

  'submit-btn-gh': 'Create new Issue on GitHub',
  'submit-btn-email': 'Send via Email',

  'bug-report': 'Bug Report',
  'feature-request': 'Feature Request',
  'similar-issues': 'Similar issues',
  'show-more': 'Show more',
  'show-less': 'Show less',
  'drop-warn':
    `Unfortunately, image drop/uploading is not supported due to GitHub API ` +
    `limitations. However, you can create the issue first (which will take you ` +
    `to GitHub) and then drop the images needed.`
}
