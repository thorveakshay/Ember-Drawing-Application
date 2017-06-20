import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

//Routes to the canvas page.
Router.map(function() {
  this.route('canvas');
});

export default Router;
