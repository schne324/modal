# modal

  Very basic modal used to replace prompt.  No animation, no jQuery...

## Installation

    $ component install schne324/modal

## API
###Options:
@param {string}

 	[id]: Selector for the desired modal ID (default: 'modal')

 	[header]: Desired content for the modal header (default: 'Prompt Box!')

 	[close]: Desired content for the close button (default: 'X')

 	[modalContent]: Desired modal content (default: 'This is just like a prompt only it\'s not from the 70s')

 	[inputPlaceholder]: The desired placeholder in the input (default: 'Enter a value...')

 	[confirm]: Desired content for the submit/confirm button (default: 'Submit')

 	[cancel]: Desired content for the cancel/dismiss button (default: 'Cancel')

## Example Usage
```javascript
var prompter = require('modal');
  //////////////OPTIONS/////////////////
  //note: not all options must be specified, there are fall-back defualts
  var modal = prompter('#modal-trigger', {
    id: 'my-modal',
    header: 'Headache!',
    close: '(X)',
    modalContent: 'I am the egg man, I am the catephant',
    inputPlaceholder: 'Hold my place...',
    confirm: 'Okay',
    cancel: 'Nope'
  });

  modal.on('cancel', function () {
    alert('you have clicked cancel, now all of your files are belong to us!');
  });

  modal.on('confirm', function (res) {
    alert('you hit confirm and said ' + res);
  });

```

## License

  MIT
