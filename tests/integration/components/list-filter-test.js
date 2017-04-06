import {
  moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import RSVP from 'rsvp';

moduleForComponent('list-filter', 'Integration | Component | list filter', {
  integration: true
});

const ITEMS = [{
  city: 'San Francisco'
}, {
  city: 'Portland'
}, {
  city: 'Seattle'
}];
const FILTERED_ITEMS = [{
  city: 'San Francisco'
}];

/* test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs `{{list-filter}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs `
    {{#list-filter}}
      template block text
    {{/list-filter}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
}); */

test('should initially load all listings', function(assert) {
  // action should return promises since they are potentially fetching data asynchronously
  this.on('filterByCity', (val) => {
    if (val === '') {
      return RSVP.resolve(ITEMS);
    } else {
      return RSVP.resolve(FILTERED_ITEMS);
    }
  });
  this.render(hbs `
  {{#list-filter filter=(action 'filterByCity') as |results|}}
    <ul>
    {{#each results as |item|}}
      <li class="city">
      {{item.city}}
      </li>
    {{/each}}
    </ul>
  {{/list-filter}}
`);
  // the wait function will return a promise that will wait for all promises and xhr requests to resolve before running the contents of the then block
  return wait().then(() => {
    assert.equal(this.$('.city').length, 3);
    assert.equal(this.$('.city').first().text().trim(), 'San Francisco');
  });
});

test('should update with matching listings', function(assert) {
  this.on('filterByCity', (val) => {
    if (val === '') {
      return RSVP.resolve(ITEMS);
    } else {
      return RSVP.resolve(FILTERED_ITEMS);
    }
  });
  this.render(hbs `
    {{#list-filter filter=(action 'filterByCity') as |results|}}
      <ul>
      {{#each results as |item|}}
        <li class="city">
          {{item.city}}
        </li>
      {{/each}}
      </ul>
    {{/list-filter}}
  `);
  // the keyup event here invokes an action that will cause the list to be filtered.
  this.$('.list-filter input').val('San').keyup();

  return wait().then(() => {
    assert.equal(this.$('.city').length, 1);
    assert.equal(this.$('.city').text().trim(), 'San Francisco');
  });
});
