module.exports = {
  name: 'ngx-highlight',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/ngx-highlight',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
