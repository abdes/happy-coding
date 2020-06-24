module.exports = {
  name: 'playground-shared',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/playground-shared',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
