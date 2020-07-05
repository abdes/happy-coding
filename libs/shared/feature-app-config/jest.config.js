module.exports = {
  name: 'shared-feature-app-config',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/feature-app-config',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
