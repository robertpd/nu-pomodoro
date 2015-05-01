import Rx from 'rx';
import $ from 'jquery';
import _ from 'lodash';

const MIN_CHARS = 2;
const $input = $('#input');
const $results = $('#results');
const $start = $('#start');
const $stop = $('#stop');

const searchWikipedia = term => (
  $.ajax({
    url: 'http://en.wikipedia.org/w/api.php',
    dataType: 'jsonp',
    data: {
      action: 'opensearch',
      format: 'json',
      search: term
    }
  }).promise()
);

// Source
const inputs = Rx.Observable.fromEvent($input, 'keyup')
  .map(e  => e.target.value)
  .debounce(50)
  .distinctUntilChanged();

// Empty and search term observables
const searchEmpty = inputs.filter(text => text.length <= MIN_CHARS);
const searchTerms = inputs.filter(text => text.length > MIN_CHARS);

const suggestions = searchTerms
  .flatMapLatest(searchWikipedia)
  .map(data => _.zip(data[1], data[3]));

// Subscriptions
let emptySub;
let pendingSub;
let resultsSub;

const start = () => {
  emptySub = searchEmpty.subscribe(() => { $results.empty() });

  pendingSub = searchTerms.subscribe(term => { $results.html(`Searching "${term}"`) });

  resultsSub = suggestions
    .subscribe(
      data => {
      $results
        .empty()
        .append(data.map(d => `
          <li>
            <a target="_blank" href="${d[1]}">${d[0]}</a>
          </li>
        `));
    },
      error => {
      $results.html(`<li>An error occured: ${error}</li>`);
    }
  );
};

const stop = () => {
  emptySub.dispose();
  pendingSub.dispose();
  resultsSub.dispose();
};

$start.on('click', start);
$stop.on('click', stop);
start();