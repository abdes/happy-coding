module.exports = {
  name: 'published-ngx-scrollable-nav-bar',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/published/ngx-scrollable-nav-bar',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
