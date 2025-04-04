export default {
  _label: 'EN',

  // intro

  'intro': require('./thank-you-bug.md'),

  // all report types

  // 'type-title': 'This is a',

  'title-title': 'Title',
  'title-placeholder-bug': 'Enter a brief and clear title that expresses the problem',
  'title-placeholder-feature': 'Enter a brief and clear title that expresses the enhancement you\'d like to see',

  'additional-info-title': 'Additional Comments',
  'additional-info-placeholder-feature': require('./additional-info-placeholder-feature.txt'),
  'additional-info-placeholder-bug': require('./additional-info-placeholder-bug.txt'),

  // bug report tab

  'bug-description-title': 'Description',
  'bug-description-placeholder': 'Provide a descriptive summary of the problem',

  'version-title': 'Version',

  'context-title': 'Context',
  'context-placeholder':
      'Specify under which circumstances the bug occurred',
  'context-subtitle': require('./context-subtitle.md'),

  'steps-title': '1. Steps to Reproduce',
  'steps-placeholder':
      '1. Detail the exact steps taken to reproduce the problem \n' +
      '2. Number each step',
  'steps-subtitle': "",

  'mmf-ver-title': 'Mac Mouse Fix Version',
  'macos-ver-title': 'macOS Version',
  'macos-ver-placeholder': 'Enter your macOS version',

  'mouse-title': 'Mouse Model',
  'mouse-placeholder': 'Specify which model of mouse you are using',

  'console-logs-title': '2. Console Logs',
  'console-logs-placeholder': 'Attach console logs here',
  'console-logs-subtitle': require('./console-logs-subtitle.md'),

  'crash-logs-title': '2. Crash Reports',
  'crash-logs-placeholder': 'Attach crash reports here',
  'crash-logs-subtitle': require('./crash-logs-subtitle.md'),

  'actionability-note-bug': require('./actionability-note-bug.md'),


  // feature request tab

  'feature-description-title': 'Description',
  'feature-description-placeholder': 'Provide a descriptive summary of the enhancement you\'d like to see',

  'rationale-title': 'Rationale',
  'rationale-placeholder':
      'Describe why you would like to see this enhancement. \n' +
      '\n' +
      'Which problem would it solve? \n' +
      'How would you use the new feature? ',

  // other tab

  'other': 'Free form',

  'title-title-other': 'Title',
  'title-placeholder-other': 'Enter a title',

  'body-title-other': 'Message',
  'body-placeholder-other': 'Enter your message',

  // Thank you

  'thank-you-bug': require('./thank-you-bug.md'),
  'thank-you-feature': require('./thank-you-feature.md'),
  'thank-you-other': require('./thank-you-other.md'),

  // misc

  'submit-btn-gh': 'Create new Issue on GitHub',
  'submit-btn-email': 'Send Email',

  'bug-report': 'Bug report',
  'feature-request': 'Enhancement request',
  'similar-issues': 'Similar issues',
  'drop-warn': require('./drop-warn.md'),
  'alert-url-too-long': require('./alert-url-too-long.txt'),
}
