'use strict';

var events = require('event'),
	query = require('query'),
	classes = require('classes'),
	extend = require('extend'),
	emitter = require('emitter'),
	rndid = require('rndid'),
	template = require('./template');

function opts(options) {
	var o = extend({}, Modal.defaults, options);

	if (typeof o.insertInto === 'string') {
		o.insertInto = query(o.insertInto);
	}

	// blank?  make it random
	if (!o.inputId) {
		o.inputId = rndid();
	}

	return o;
}

var Modal = module.exports = function (trigger, options) {
	// invocation without `new` for back-compat
	if (!(this instanceof Modal)) {
		return new Modal(trigger, options);
	}

	var self = this;

	emitter(this);

	this.trigger = typeof trigger === 'string'
		? query(trigger)
		: trigger;

	// generate options w/ defaults
	this.options = opts(options);

	// create our parent element
	this.wrapper = document.createElement('div');
	// add markup to the DOM
	this.wrapper.innerHTML = template
		.replace(/\{\{id\}\}/, this.options.id)
		.replace(/\{\{header\}\}/, this.options.header)
		.replace(/\{\{close\}\}/, this.options.close)
		.replace(/\{\{inputPlaceholder\}\}/, this.options.inputPlaceholder)
		.replace(/\{\{modalContent\}\}/, this.options.modalContent)
		.replace(/\{\{confirm\}\}/, this.options.confirm)
		.replace(/\{\{cancel\}\}/, this.options.cancel)
		.replace(/\{\{inputId\}\}/, this.options.inputId);

	this.options.insertInto.appendChild(this.wrapper);

	this.modal = document.getElementById(this.options.id);

	// opening the modal
	events.bind(this.trigger, 'click', function () {
		self._bind().show();
	});

	this._bind();
};

/**
 * Bind all DOM event listeners for the `Modal`
 *
 * @api private
 * @return {Modal}
 */
Modal.prototype._bind = function () {
	var self = this,
		cancel = this._cancel = query('.cancel', this.modal),
		close = this._close = query('.close', this.modal),
		confirm = this._confirm = query('.confirm', this.modal),
		input = this._input = query('input', this.modal);

	// the close button
	this._onclose = events.bind(close, 'click', function () {
		self.emit('closed', self);
		self.hide();
	});

	// the confirm button
	this._onconfirm = events.bind(confirm, 'click', function () {
		var val = input.value;
		if (!val) {
			// if there's no value, just re-focus the input and return
			return input.focus();
		}

		self.emit('confirm', val);
		self.hide();
	});

	// cancel button
	this._oncancel = events.bind(cancel, 'click', function () {
		self.emit('cancel', self);
		self.hide();
	});

	// on key press
	this._onkeydown = events.bind(this.modal, 'keydown', function (keyboardEvent) {
		var which = keyboardEvent.which,
			target = keyboardEvent.target;

		// ESCAPE
		if (which === 27) {
			self._onclose();
		// TAB
		} else if (which === 9) {
			// SHIFT+TAB
			if (keyboardEvent.shiftKey) {
				if (target === input) {
					keyboardEvent.preventDefault();
					close.focus();
				} else if (target === close) {
					keyboardEvent.preventDefault();
					cancel.focus();
				}
			// TAB
			} else {
				if (target === cancel) {
					keyboardEvent.preventDefault();
					close.focus();
				}
			}
		// ENTER
		} else if (which === 13) {
			if (target === input) {
				self._onconfirm();
			}
		}
	});

	return this;
};

/**
 * Show the modal
 *
 * @api public
 * @return {Modal}
 */
Modal.prototype.show = function () {
	classes(this.modal).add('opened');
	query('input', this.modal).focus();
	return this.emit('show', this);
};


/**
 * Hide the modal
 *
 * @api public
 * @return {Modal}
 */
Modal.prototype.hide = function () {
	classes(this.modal).remove('opened');

	this.trigger.focus();

	// remove all previous event registers
	events.unbind(this._close, 'click', this._onclose);
	events.unbind(this._confirm, 'click', this._onconfirm);
	events.unbind(this._cancel, 'click', this._oncancel);
	events.unbind(this.modal, 'keydown', this._onkeydown);

	return this.emit('hide', this);
};

Modal.defaults = {
	// these are the defaults
	id: 'modal',
	header: 'Prompt Box!',
	close: 'X',
	modalContent: 'This is just like a prompt only it\'s not from the 70s',
	inputPlaceholder: 'Enter a value...',
	confirm: 'Submit',
	cancel: 'Cancel',
	insertInto: document.body
};
