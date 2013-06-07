'use strict';

var events = require('event'),
	query = require('query'),
	classes = require('classes'),
	extend = require('extend'),
	emitter = require('emitter');


module.exports = function (trigger, options) {

	var deport = module.exports;

	if (typeof trigger === 'string') {
		trigger = query(trigger);
	}

	options = extend({
		// these are the defaults
		id: 'modal',
		header: 'Prompt Box!',
		close: 'X',
		modalContent: 'This is just like a prompt only it\'s not from the 70s',
		inputPlaceholder: 'Enter a value...',
		confirm: 'Submit',
		cancel: 'Cancel',
		insertInto: document.body
	}, options);


	var html = require('./template')
		.replace(/\{\{id\}\}/, options.id)
		.replace(/\{\{header\}\}/, options.header)
		.replace(/\{\{close\}\}/, options.close)
		.replace(/\{\{inputPlaceholder\}\}/, options.inputPlaceholder)
		.replace(/\{\{modalContent\}\}/, options.modalContent)
		.replace(/\{\{confirm\}\}/, options.confirm)
		.replace(/\{\{cancel\}\}/, options.cancel);


	var wrapper = document.createElement('div');
	wrapper.innerHTML = html;
	options.insertInto.appendChild(wrapper);


	var modal = query('#' + options.id),
		cancel = query('.cancel', modal),
		close = query('.close', modal),
		confirm = query('.confirm', modal),
		input = query('input', modal);

	//fire the modal on clicks
	events.bind(trigger, 'click', function (clickEvent) {
		classes(modal).add('opened');
		input.focus();
	});


	//close the modal
	//clicking cancel
	events.bind(cancel, 'click', function () {
		classes(modal).remove('opened');
		trigger.focus();

		deport.emit('cancel');

	});
	//clicking close
	events.bind(close, 'click', function () {
		cancel.click();
	});

	//confirm
	events.bind(confirm, 'click', function () {
		if (input.value === '') {
			input.focus();
			return;
		} else {
			classes(modal).remove('opened');
			deport.emit('confirm', input.value);
			trigger.focus();
		}

	});


	events.bind(modal, 'keydown', function (keyboardEvent) {
		var which = keyboardEvent.which,
			target = keyboardEvent.target;

		//ESCAPE
		if (which === 27) {
			cancel.click();
		}
		//SHIFT + TAB
		if (which === 9 && keyboardEvent.shiftKey) {
			if (target === input) {
				keyboardEvent.preventDefault();
				close.focus();
			} else if (target === close) {
				keyboardEvent.preventDefault();
				cancel.focus();
			}
		//TAB
		} else if (which === 9) {
			if (target === cancel) {
				keyboardEvent.preventDefault();
				close.focus();
			}
		//enter on input
		} else if (which == 13) {
			if (target === input) {
				if (input.value === '') {
					return;
				} else {
					confirm.click();
				}
			}
		}
	});

	return module.exports;

};


emitter(module.exports);
