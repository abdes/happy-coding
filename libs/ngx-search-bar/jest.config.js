module.exports = {
  name: 'ngx-search-bar',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ngx-search-bar',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
