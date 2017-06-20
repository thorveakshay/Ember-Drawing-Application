import Ember from 'ember';
//Retrieves the script files in order to make user functionality work for the functions. client.js and main.js contain the code for handling UI events.
export default Ember.Controller.extend({
	loadPlugin: function(){
    Ember.$.getScript('assets/js/client.js');
    Ember.$.getScript('assets/js/main.js');
    console.log('Load my client js file');
	}.on('init')
});
