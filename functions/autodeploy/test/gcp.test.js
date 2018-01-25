/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const test = require(`ava`);

// Imports the Google Cloud Data Loss Prevention library
const DLP = require('@google-cloud/dlp');

// Instantiates a client
const dlp = new DLP.DlpServiceClient();

// The string to inspect
const string = 'Robert Frost';

// The minimum likelihood required before returning a match
const minLikelihood = 'LIKELIHOOD_UNSPECIFIED';

// The maximum number of findings to report (0 = server maximum)
const maxFindings = 0;

// The infoTypes of information to match
const infoTypes = [{name: 'US_MALE_NAME'}, {name: 'US_FEMALE_NAME'}];

// Whether to include the matching string
const includeQuote = true;

// Construct items to inspect
const items = [{type: 'text/plain', value: string}];

test(`can access GCP`, async (t) => {

  // Construct request
  const request = {
    inspectConfig: {
      infoTypes: infoTypes,
      minLikelihood: minLikelihood,
      maxFindings: maxFindings,
      includeQuote: includeQuote,
    },
    items: items,
  };

  // Run request
  await dlp
    .inspectContent(request)
    .then(response => {
      const findings = response[0].results[0].findings;
      console.log(`Findings:`, findings);
      t.is(findings[0].quote, 'Robert')
      t.pass();
    })
    .catch(err => {
      console.error(`Error in inspectString: ${err}`);
      console.error(JSON.stringify(err, null, 4));
      t.fail();
    });
});

const childProcess = require(`child_process`);
test(`can access gcloud`, (t) => {
  console.log(`gcloud auth list:`, childProcess.execSync(`gcloud auth list`).toString());
  t.pass();
})