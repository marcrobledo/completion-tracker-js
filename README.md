# Completion Tracker JS
*Completion Tracker JS* is a JavaScript library designed to help you easily create interactive checklists.<br/>
It provides a simple, embeddable solution, enabling anyone to quickly build their own progress tracker webapp.

[See my own implementation examples](https://www.marcrobledo.com/completion-tracker-js/) (spanish only)

Initially, I developed it for personal use because I enjoy achieving 100% completion in my favorite games when replaying them and needed a minimalist app to track my progress.
However, after finishing it, I decided to share it since the result turned out to be very user-friendly.

## How to create your own progress tracker with Completion Tracker JS
Import `completion-tracker.js` into your HTML header:
```html
<script type="text/javascript" src="completion-tracker.js"></script>
```

Prepare your HTML code by adding checkbox elements anywhere in your website, providing their **required** `data-tracker` and `data-index` attributes. For example:
```html
<ul>
	<li><input type="checkbox" data-tracker="my-game-id" data-index="0" data-category="equipment-upgrades" /> Wallet upgrade</li>
	<li><input type="checkbox" data-tracker="my-game-id" data-index="1" data-category="equipment-upgrades" /> Bow upgrade</li>
	<li><input type="checkbox" data-tracker="my-game-id" data-index="2" data-category="equipment-upgrades" /> Magic upgrade</li>
	...
</ul>
<ul>
	<li><input type="checkbox" data-tracker="my-game-id" data-index="3" data-category="health-upgrades" /> Health upgrade 1</li>
	<li><input type="checkbox" data-tracker="my-game-id" data-index="4" data-category="health-upgrades" /> Health upgrade 2</li>
	<li><input type="checkbox" data-tracker="my-game-id" data-index="5" data-category="health-upgrades" /> Health upgrade 3</li>
	...
</ul>
...
```

Enable Completion Tracker JS with:
```js
const yourTracker=CompletionTrackerJS.enable('my-game-id');
```

**Advices:**
- `data-tracker` value must match the paramater given to `CompletionTrackerJS.enable`
- `data-index` must be numeric (starting from 0) and can't have duplicates
- `data-category` is optional, it can be used to show progress bars for specific categories
- the `enable` method will warn you of any HTML skeleton error or inconsistencies in the browser console
- if you are adding, removing or reordering checkboxes, always keep their original `data-index` value. If indexes change, users' stored progress will be altered.


Checkboxes status are stored in `localStorage`, and they are automatically loaded and restored when user returns to the page.<br/>
The rest of the UI and UX is up to you.


### Progress elements
Once your progress tracker has been instanced, you can create dynamic HTML elements that show off users' progress:

```js
healthProgressElements=myTracker.buildProgressElements('health-upgrades');
allProgressElements=myTracker.buildProgressElements(); //all categories

document.getElementById('my-container').addEventListener(healthProgressElements.progressBar);
document.getElementById('my-container').addEventListener(allProgressElements.counter);
document.getElementById('my-container').addEventListener(allProgressElements.total);
document.getElementById('my-container').addEventListener(allProgressElements.percentage);
```

All these elements are automatically refreshed as user toggles the checkboxes. Of course, you are able to customize them with CSS.

### Progress transfer between devices
Completion Tracker JS offers a quick solution to transfer progress between user devices by using passwords.<br/>
It provides a method that shows a dialog where the user can both copy their password or paste and import a password from another device:

```js
const myTransferDialog=yourTracker.showTransferDialog();
```

The dialog elements are automatically localized to english or spanish depending on user's browser language.<br/>
You can localize it to any other language, if needed:
```js
const myTransferDialog=yourTracker.showTransferDialog({
	'message': 'This code contains information about your progress.<br/>Use it to transfer your progress to another device:',
	'btnCancel': 'Close',
	'btnExport': 'Copy to clipboard',
	'btnImport': 'Import'
});
```

## API
`CompletionTrackerJS.enable` returns an object with more additional features you can use in your implementation:
- `check(checkboxIndex)`: checks an specific checkbox index
- `uncheck(checkboxIndex)`: unchecks an specific checkbox index
- `getProgress()`: returns an object containing information about the entire progress
- `getProgress(category)`: returns an object containing information about the progress on provided category
- `complete()`: checks all checkboxes
- `complete(category)`: checks all checkboxes within a category
- `reset()`: unchecks all checkboxes
- `reset(category)`: unchecks all checkboxes within a category
