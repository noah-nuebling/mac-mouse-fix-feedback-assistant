export default {
  _label: 'EN',

  // intro

  'intro': require('./thank-you-bug.md'),

  // all report types

  // 'type-title': 'This is a',

  'title-title': 'Title',
  'title-placeholder-bug': 'Enter a brief and clear title that expresses the problem',
  'title-placeholder-feature': 'Enter a brief and clear title that expresses the enhancement you\'d like to see',

  'additional-info-title': 'Additional comments (optional)',
  'additional-info-placeholder-feature': require('./additional-info-placeholder-feature.txt'),
  'additional-info-placeholder-bug': require('./additional-info-placeholder-bug.txt'),

  // 'attachments-title': 'Attachments (optional)',
  // 'attachments-subtitle-feature': require('./attachments-subtitle-feature.md'),
  // 'attachments-subtitle-bug': require('./attachments-subtitle-bug.md'),

  // bug report tab

  'bug-description-title': 'Description',
  'bug-description-placeholder': 'Provide a descriptive summary of the problem',

  'version-title': 'Version',

  'context-title': 'Context',
  'context-placeholder':
      'Specify under which circumstances the bug occurred',
  'context-subtitle': require('./context-subtitle.md'),

  'steps-title': 'Steps to reproduce',
  'steps-placeholder':
      '1. Detail the exact steps taken to reproduce the problem \n' +
      '2. Number each step \n' +
      '3. Pat yourself on the back! This will be super helpful for fixing the bug. :D',
  'steps-subtitle': require('./steps-subtitle.md'),

  'mmf-ver-title': 'Mac Mouse Fix version',
  'macos-ver-title': 'macOS version',
  'macos-ver-placeholder': 'Enter your macOS version',

  'mouse-title': 'Mouse model (optional)',
  'mouse-placeholder': 'Specify, which model of mouse you are using',

  'console-logs-title': 'Console logs (optional)',
  'console-logs-placeholder': 'Paste console logs here',
  'console-logs-subtitle': require('./console-logs-subtitle.md'),

  'crash-logs-title': 'Crash reports (optional)',
  'crash-logs-placeholder': 'Paste crash reports here',
  'crash-logs-subtitle': require('./crash-logs-subtitle.md'),


  // feature request tab

  'feature-description-title': 'Description',
  'feature-description-placeholder': 'Provide a descriptive summary of the enhancement you\'d like to see',

  'rationale-title': 'Rationale',
  'rationale-placeholder':
      'Describe why you would like to see this enhancement \n' +
      '\n' +
      'Which problem would it solve? \n' +
      'How would you use the new feature? ',

  // other tab

  'other': 'Other',

  'title-title-other': 'Title',
  'title-placeholder-other': 'Enter a title',

  'body-title-other': 'Message (optional)',
  'body-placeholder-other': 'Enter your message',

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
  'drop-warn': require('./drop-warn.md'),
}
