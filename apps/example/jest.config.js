module.exports = {
  name: 'example',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/example',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
