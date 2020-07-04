import * as fs from 'fs';
// import * as countryCodes from 'country-codes-list';
import * as _ from 'lodash';
// import { exit } from 'process';

const SVG_DIRECTORY = 'node_modules/svg-country-flags/svg/';
const TS_DIRECTORY = 'libs/shared/feature-country-flags/src/lib/flags/';

function get_all_svgs(callback) {
  fs.readdir(SVG_DIRECTORY, null, (err, items) => {
    if (err) {
      console.log(
        'Could not list *.svg files. You probably ran this command from the wrong working directory.'
      );
      console.log(err);
      process.exit(1);
    }

    items = items.filter((path) => /^[a-z\-]+\.svg$/.test(path));
    callback(items);
  });
}

function convert_svg(path_to_svg, path_to_ts, callback) {
  console.log(path_to_svg, ' ==> ', path_to_ts);

  const svg_data = fs.readFileSync(path_to_svg, { encoding: 'utf-8' });

  const ts_fd = fs.openSync(path_to_ts, 'a');
  fs.writeFileSync(
    path_to_ts,
    `// Copyright (c) 2019-2020 The Authors
// This file is the result of Happy Coding :-)
// https://github.com/abdes/happy-coding
//
// SVG icons from https://github.com/hjnilsson/country-flags
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-disable max-len */
export const SVG_ICON = \`
`,
    { flag: 'w' }
  );
  fs.writeFileSync(path_to_ts, svg_data, { flag: 'as+' });
  fs.writeFileSync(path_to_ts, '`;\n', { flag: 'as+' });
  callback();
}

function convert_all_files(svgs: string[], callback) {
  var i = -1;

  function do_next_file() {
    ++i;
    if (i >= svgs.length) {
      callback();
      return;
    }
    console.log('Converting [' + (i + 1) + '/' + svgs.length + '] ' + svgs[i]);
    convert_svg(
      SVG_DIRECTORY + svgs[i],
      TS_DIRECTORY + svgs[i].replace('.svg', '.ts'),
      do_next_file
    );
  }

  do_next_file();
}

get_all_svgs((svgs: string[]) => {
  // const svgs_codes = svgs.map((value) => value.replace('.svg', ''));
  // const countries = countryCodes.customList('countryCode', 'countryNameEn');
  // const codes = Object.keys(countries);

  // console.log(
  //   _.differenceWith(
  //     svgs_codes,
  //     codes,
  //     (o1: string, o2: string) => o1.toLowerCase() == o2.toLowerCase()
  //   )
  // );
  // exit(0);
  // MISSING from country codes
  // https://www.iso.org/obp/ui/#iso:code:3166:BS
  // https://www.iso.org/obp/ui/#iso:code:3166:CC
  // https://www.iso.org/obp/ui/#iso:code:3166:CD
  // https://www.iso.org/obp/ui/#iso:code:3166:CF
  // https://www.iso.org/obp/ui/#iso:code:3166:CK
  // https://www.iso.org/obp/ui/#iso:code:3166:FK
  // https://www.iso.org/obp/ui/#iso:code:3166:FO
  // https://www.iso.org/obp/ui/#iso:code:3166:HM
  // https://www.iso.org/obp/ui/#iso:code:3166:IO
  // https://www.iso.org/obp/ui/#iso:code:3166:KM
  // https://www.iso.org/obp/ui/#iso:code:3166:KY
  // https://www.iso.org/obp/ui/#iso:code:3166:MH
  // https://www.iso.org/obp/ui/#iso:code:3166:MP
  // https://www.iso.org/obp/ui/#iso:code:3166:TC
  // https://www.iso.org/obp/ui/#iso:code:3166:TF
  // https://www.iso.org/obp/ui/#iso:code:3166:UM
  // https://www.iso.org/obp/ui/#iso:code:3166:VA

  convert_all_files(svgs, () => {
    console.log('All SVGs converted to PNG!');
    process.exit(0);
  });
});
