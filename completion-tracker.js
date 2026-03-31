/**
	@file a JS library that allows progress tracking webapps building
	@author Marc Robledo
	@version 1.0
	@copyright 2013-2026 Marc Robledo
	@license
	This file is released under MIT License
	Copyright (c) 2013-2026 Marc Robledo

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
 */


const CompletionTracker = (function () {
	const CHARACTERS_PER_BLOCK = 5;
	const BLOCKS_PER_LINE = 3;
	const IS_MOBILE = (navigator.userAgentData && navigator.userAgentData.mobile) || (function (a) { return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))); })(navigator.userAgent || navigator.vendor || window.opera);

	const _sanitizeId = function (stringId) {
		return (stringId ?? '').toLowerCase().replace(/(^[^\w]+)|([^\w]+$)/g, '').replace(/-+/g, '-').replace(/[^a-z0-9_\-]/g, '');
	}
	const formatDataTransferKey = function (keyCode) {
		const blocks = [];
		for (var i = 0; i < keyCode.length; i += CHARACTERS_PER_BLOCK) {
			blocks.push(keyCode.substr(i, CHARACTERS_PER_BLOCK));
		}

		const lines = [];
		for (var j = 0; j < blocks.length; j += BLOCKS_PER_LINE) {
			lines.push(blocks.slice(j, j + BLOCKS_PER_LINE).join('-'));
		}

		return lines.join('\n');
	};
	const _findMissingIndexes = function (arr) {
		if (!arr.length)
			return [];

		const missingIndexes = [];

		// check for indexes before the first element
		for (var i = 0; i < arr[0]; i++)
			missingIndexes.push(i);

		// find missing indexes between elements
		arr.reduce((prev, curr) => {
			for (var i = prev + 1; i < curr; i++) {
				missingIndexes.push(i);
			}
			return curr;
		});

		return missingIndexes;
	}


	const TEXTS={
		'en':{
			'message': 'This code contains information about your progress.<br/>Use it to transfer your progress to another device:',
			'btnCancel': 'Close',
			'btnExport': 'Copy to clipboard',
			'btnImport': 'Import'
		},
		'es':{
			'message': 'Este código contiene información de tu progreso.<br/>Úsalo para transferir tu progreso a otro dispositivo:',
			'btnCancel': 'Cerrar',
			'btnExport': 'Copiar al portapapeles',
			'btnImport': 'Importar'
		}
	};

	const enabledTrackers = [];

	return {
		enable: function (trackerId) {
			if (typeof trackerId !== 'string')
				throw new TypeError('Completion Tracker JS: tracker id must be a string');

			trackerId = _sanitizeId(trackerId);
			if (!trackerId)
				throw new TypeError('Completion Tracker JS: invalid tracker id', trackerId);
			else if (enabledTrackers.indexOf(trackerId) !== -1)
				throw new Error('Completion Tracker JS: this tracker is already initialized', trackerId);




			/* functions */
			const _getCheckboxes = function (categoryId) {
				return categoryId ? categoriesInfoByCategory[categoryId].checkboxes : allCheckboxes;
			}
			const _getProgress = function (categoryId) {
				const checkboxes = _getCheckboxes(categoryId);
				const count = checkboxes.reduce(function (acc, checkbox) {
					return acc + (bitArray.get(checkbox.itemIndex) ? 1 : 0);
				}, 0);
				return {
					categoryId: categoryId,
					value: count,
					max: checkboxes.length,
					percentage: Math.floor((count / checkboxes.length) * 10000) / 100,
					complete: count === checkboxes.length
				}
			}
			const _refreshCheckboxClassName = function (checkbox) {
				if (checkbox.checked)
					checkbox.parentElement.className = checkbox.parentElement.className.replace(/( checked-within)+$/g, '') + ' checked-within';
				else
					checkbox.parentElement.className = checkbox.parentElement.className.replace(/( checked-within)+$/g, '');
			}
			const _refreshCheckboxes = function (categoryId) {
				const checkboxes = categoryId ? categoriesInfoByCategory[categoryId].checkboxes : allCheckboxes;
				for (var i = 0; i < checkboxes.length; i++) {
					checkboxes[i].checked = bitArray.get(checkboxes[i].itemIndex);
					_refreshCheckboxClassName(checkboxes[i]);
				}
			}
			const _refreshProgressElementClassName = function (progressElement, complete) {
				if (complete)
					progressElement.className += ' completed';
				else
					progressElement.className = progressElement.className.replace(/( completed)+/, '');
			}
			const _refreshProgressElement = function (progressElement) {
				const progressData = _getProgress(progressElement.categoryId);

				progressElement.progressBar.value = progressData.value;
				progressElement.counter.innerHTML = progressData.value;
				progressElement.percentage.innerHTML = progressData.percentage;

				_refreshProgressElementClassName(progressElement.progressBar, progressData.complete);
				_refreshProgressElementClassName(progressElement.counter, progressData.complete);
				_refreshProgressElementClassName(progressElement.percentage, progressData.complete);
			}
			const _refreshProgressElements = function (categoryId) {
				if (categoryId) {
					categoriesInfoByCategory[categoryId].progressElements.forEach(_refreshProgressElement);
				} else {
					categoriesInfo.forEach(function (categoryInfo) {
						_refreshProgressElements(categoryInfo.categoryId);
					});
				}
				progressElementsTotal.forEach(_refreshProgressElement);
			}
			const _onChangeCheckbox = function () {
				if (this.checked) {
					bitArray.set(this.itemIndex);
				} else {
					bitArray.unset(this.itemIndex);
				}

				_refreshCheckboxClassName(this);
				_refreshProgressElements(this.categoryId);

				_saveData();
			}
			const _saveData = function () {
				localStorage.setItem('completion-tracker-' + trackerId, JSON.stringify({
					version: 1,
					//secretId:secretId || Math.floor(Math.random()*100000),
					timestamp: (new Date()).getTime(),
					bitArrayData: bitArray.clump()
				}));
			}









			/* progress bars */
			const progressElementsTotal = [];
			const allCheckboxes = [];
			const categoriesInfo = [];
			const categoriesInfoByCategory = {};

			const usedIndexes = [];
			var maxIndex = 0;

			const checkboxes = document.body.querySelectorAll('input[type=checkbox][data-tracker][data-index]');
			for (var i = 0; i < checkboxes.length; i++) {
				if (_sanitizeId(checkboxes[i].getAttribute('data-tracker')) !== trackerId)
					continue;

				const index = parseInt(checkboxes[i].getAttribute('data-index'));
				if (isNaN(index) || index < 0) {
					console.warn('Completion Tracker JS: invalid checkbox index: ' + checkboxes[i].getAttribute('data-index') + ', ignoring');
				} else if (usedIndexes[index]) {
					throw new Error('Completion Tracker JS: duplicate checkbox index found: ' + index);
				} else {
					usedIndexes[index] = index;
					checkboxes[i].itemIndex = index;
					allCheckboxes.push(checkboxes[i]);

					if (index > maxIndex)
						maxIndex = index;

					checkboxes[i].addEventListener('change', _onChangeCheckbox);

					checkboxes[i].categoryId = _sanitizeId(checkboxes[i].getAttribute('data-category') || 'none');


					if (!categoriesInfoByCategory[checkboxes[i].categoryId]) {
						categoriesInfoByCategory[checkboxes[i].categoryId] = {
							trackerId: trackerId,
							categoryId: checkboxes[i].categoryId,
							checkboxes: [],
							progressElements: [],
							max: 0
						};
						categoriesInfo.push(categoriesInfoByCategory[checkboxes[i].categoryId]);
					}
					categoriesInfoByCategory[checkboxes[i].categoryId].max++;
					categoriesInfoByCategory[checkboxes[i].categoryId].checkboxes.push(checkboxes[i]);
				}
			}
			if (!allCheckboxes.length)
				throw new Error('Completion Tracker JS: no checkboxes found for ' + trackerId);

			usedIndexes.sort(function (a, b) { return a - b });
			const missingIndexes = _findMissingIndexes(usedIndexes);
			if (missingIndexes.length)
				console.warn('Completion Tracker JS: some indexes are unused', missingIndexes);

			categoriesInfo.sort(function (a, b) {
				return a.categoryId - b.categoryId;
			});

			const bitArray = new BitArray(maxIndex + 1, trackerId);





			/* load saved data */
			if (typeof localStorage !== 'undefined' && typeof localStorage['completion-tracker-' + trackerId] === 'string') {
				const loadedData = JSON.parse(localStorage.getItem('completion-tracker-' + trackerId));
				try {
					bitArray.declump(loadedData.bitArrayData);
					_refreshCheckboxes();
				} catch (ex) {
					console.warn('CompletionTracker: skipping loading data, clumped data is not valid', ex.message);
				}
			}

			/* progress transfer */
			const navigatorLang=navigator.language || navigator.userLanguage || navigator.browserLanguage || 'en-US';
			const texts=TEXTS[navigatorLang.toLowerCase().substr(0,2)] || TEXTS.en;
			const progressTransferElements = {
				texts
			};

			enabledTrackers.push(trackerId);
			return {
				getCheckboxes: function (categoryId) {
					//return [..._getCheckboxes(categoryId)]; //ES6 spread syntax
					return _getCheckboxes(categoryId).slice();
				},
				getProgress: function () {
					return {
						trackerId: trackerId,
						all: _getProgress(),
						categories: categoriesInfo.map(function (categoryInfo) { return _getProgress(categoryInfo.categoryId) })
					};
				},
				getGameId: function () {
					return trackerId;
				},

				buildProgressElements: function (categoryId) {
					const progressElements = {
						trackerId: trackerId,
						categoryId: _sanitizeId(categoryId) || null,
						progressBar: document.createElement('progress'),
						counter: document.createElement('span'),
						total: document.createElement('span'),
						percentage: document.createElement('span'),
					};

					if (progressElements.categoryId && !categoriesInfoByCategory[categoryId])
						throw new Error('Completion Tracker JS: invalid category', categoryId);

					const classNameCategory = progressElements.categoryId || 'all';
					progressElements.progressBar.className = 'progress-bar progress-bar-' + classNameCategory;
					progressElements.counter.className = 'progress-counter progress-counter-' + classNameCategory;
					progressElements.total.className = 'progress-total progress-total-' + classNameCategory;
					progressElements.percentage.className = 'progress-percentage progress-percentage-' + classNameCategory;

					if (progressElements.categoryId) {
						const total = categoriesInfoByCategory[progressElements.categoryId].checkboxes.length;
						progressElements.progressBar.max = total;
						progressElements.total.innerHTML = total;
						categoriesInfoByCategory[progressElements.categoryId].progressElements.push(progressElements);
					} else {
						const total = allCheckboxes.length;
						progressElements.progressBar.max = total;
						progressElements.total.innerHTML = total;
						progressElementsTotal.push(progressElements);
					}

					_refreshProgressElements(progressElements.categoryId);
					return progressElements;
				},
				showTransferDialog: function (newTexts) {
					if (typeof newTexts === 'object') {
						for (var textId in progressTransferElements.texts) {
							if (typeof newTexts[textId] === 'string')
								progressTransferElements.texts[textId] = newTexts[textId];
						}
					}
					if (!progressTransferElements.dialog) {
						const dialog = document.createElement('dialog');
						const form = document.createElement('form');
						const divMessage = document.createElement('div');
						const textarea = document.createElement('textarea');
						const btnsContainer = document.createElement('div');
						const btnCancel = document.createElement('button');
						const btnExport = document.createElement('button');
						const btnImport = document.createElement('button');

						form.appendChild(divMessage);
						form.appendChild(textarea);
						form.appendChild(btnsContainer);
						btnsContainer.appendChild(btnCancel);
						btnsContainer.appendChild(btnExport);
						btnsContainer.appendChild(btnImport);
						dialog.appendChild(form);
						document.body.appendChild(dialog);

						const formattedKey = formatDataTransferKey(bitArray.export());


						divMessage.className = 'progress-transfer-message';
						divMessage.innerHTML = progressTransferElements.texts.message;

						btnsContainer.className = 'progress-transfer-buttons';
						btnCancel.className = 'progress-transfer-btn progress-transfer-btn-cancel';
						btnCancel.type = 'button';
						btnCancel.innerHTML = progressTransferElements.texts.btnCancel;
						btnCancel.addEventListener('click', function () {
							dialog.close();
						});
						btnExport.className = 'progress-transfer-btn progress-transfer-btn-export';
						btnExport.name = 'mode';
						btnExport.value = 'export';
						btnExport.type = 'submit';
						btnExport.innerHTML = progressTransferElements.texts.btnExport;
						btnImport.className = 'progress-transfer-btn progress-transfer-btn-import';
						btnImport.name = 'mode';
						btnImport.value = 'import';
						btnImport.type = 'submit';
						btnImport.innerHTML = progressTransferElements.texts.btnImport;
						btnImport.disabled = true;

						textarea.name = 'code';
						textarea.className = 'progress-transfer-textarea';
						textarea.rows = Math.min(formattedKey.split('\n').length, 6);
						if(!IS_MOBILE)
							textarea.autofocus = true;
						else
							btnExport.autofocus = true;

						dialog.id = 'dialog-progress-transfer-' + trackerId;
						dialog.className = 'progress-transfer-dialog';

						form.method = 'dialog';
						form.addEventListener('submit', function (evt) {
							if (evt.submitter === btnExport) {
								textarea.value = formatDataTransferKey(bitArray.export());
								const formattedKey = textarea.value.replace(/[\n\r\- ]+/g, '-');

								if (IS_MOBILE && navigator.canShare && navigator.canShare({ text: formattedKey })) {
									navigator.share({ text: formattedKey }); //promise
								} else if (navigator.clipboard && navigator.clipboard.writeText) {
									alert('copying to clipboard');
									navigator.clipboard.writeText(formattedKey); //promise
								} else {
									alert('Unsupported browser');
								}

							} else if (evt.submitter === btnImport) {
								const str = textarea.value.toUpperCase().replace(/[^0-9ABCXYZ]/g, '');

								if (bitArray.import(str)) {
									_refreshCheckboxes();
									_refreshProgressElements();
									_saveData();
								}
							}
						});






						const _evtTextareaChange = function (evt) {
							const str = this.value.toUpperCase().replace(/[^0-9ABCXYZ]/g, '');
							const initialKey = formatDataTransferKey(bitArray.export());
							const currentKey = formatDataTransferKey(str);

							if (!str.length || initialKey === currentKey) {
								this.setCustomValidity('');
								this.value = initialKey;
								if(!IS_MOBILE) {
									this.focus();
									this.select();
								}
								btnImport.disabled = true;

							} else {
								if (str.length) {
									btnImport.disabled = !bitArray.importCheck(str);
								} else {
									btnImport.disabled = true;
								}
								if (btnImport.disabled)
									this.setCustomValidity('Type a valid code');
								if (this.value !== currentKey)
									this.value = currentKey;
							}
						}
						textarea.addEventListener('change', _evtTextareaChange);
						textarea.addEventListener('paste', _evtTextareaChange);


						//const qrContainer=document.createElement('div');
						//qrContainer.id='qr-container';
						//const qr=new QRCode(qrContainer);

						progressTransferElements.dialog = dialog;
						progressTransferElements.textarea = textarea;
					}


					const formattedKey = formatDataTransferKey(bitArray.export());
					progressTransferElements.textarea.value = formattedKey;
					progressTransferElements.dialog.showModal();
					progressTransferElements.textarea.setCustomValidity('');
					if(!IS_MOBILE)
						progressTransferElements.textarea.select();
					//qr.clear();
					//qr.makeCode(url);

					return progressTransferElements;
				},

				toggle: function (itemIndexes, newStatus) {
					if (typeof itemIndexes === 'number' || typeof itemIndexes === 'string') {
						itemIndexes = [itemIndexes];
					}
					if (typeof itemIndexes !== 'object' || !itemIndexes.length) {
						throw new Error('Completion Tracker JS: invalid index list');
					}

					itemIndexes = itemIndexes.map(function (el) {
						var index;
						if (typeof el === 'number')
							index = Math.floor(el);
						else if (typeof el === 'string')
							index = parseInt(el);

						if (isNaN(index) || index < 0)
							throw new Error('Completion Tracker JS: invalid index',);

						return index;
					});

					const checkboxes = allCheckboxes.filter(function (checkbox) {
						return itemIndexes.indexOf(checkbox.itemIndex) !== -1
					});
					var nChanges = 0;
					const changedCategories = [];
					if (checkboxes.length) {
						checkboxes.forEach(function (checkbox, i) {
							if (typeof newStatus === 'undefined') {
								if (!checkbox.checked) {
									bitArray.set(checkbox.itemIndex);
									checkbox.checked = true;
								} else {
									bitArray.unset(checkbox.itemIndex);
									checkbox.checked = false;
								}
								_refreshCheckboxClassName(checkbox);
								nChanges++;
							} else if (newStatus && !checkbox.checked) {
								bitArray.set(checkbox.itemIndex);
								checkbox.checked = true;
								_refreshCheckboxClassName(checkbox);
								nChanges++;
							} else if (!newStatus && checkbox.checked) {
								bitArray.unset(checkbox.itemIndex);
								checkbox.checked = false;
								_refreshCheckboxClassName(checkbox);
								nChanges++;
							}

							if (changedCategories.indexOf(checkbox.categoryId) === -1)
								changedCategories.push(checkbox.categoryId);
						});
					}

					if (nChanges) {
						changedCategories.forEach(function (categoryId) {
							_refreshCheckboxes(categoryId);
							_refreshProgressElements(categoryId);
						});
						_saveData();
					}
					return nChanges;
				},
				complete: function (categoryId) {
					const itemIndexes = (categoryId ? categoriesInfoByCategory[categoryId].checkboxes : allCheckboxes).map(function (checkbox) {
						return checkbox.itemIndex;
					});
					return this.toggle(itemIndexes, true);
				},
				reset: function (categoryId) {
					const itemIndexes = (categoryId ? categoriesInfoByCategory[categoryId].checkboxes : allCheckboxes).map(function (checkbox) {
						return checkbox.itemIndex;
					});
					return this.toggle(itemIndexes, false);
				},
				check: function (itemIndexes) {
					return this.toggle(itemIndexes, true);
				},
				uncheck: function (itemIndexes) {
					return this.toggle(itemIndexes, false);
				}
			}
		}
	}
}());




/*
BitArray.js (last updated: 20250107)
a lightweight library to work with large bit arrays

This code is released under the MIT License.
http://opensource.org/licenses/MIT

Copyright (c) 2006-2025 Marc Robledo, https://www.marcrobledo.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

class BitArray {
	#array;
	#length;
	#xorKey;

	constructor(size, xorKey) {
		if (typeof size === 'string')
			size = parseInt(size);
		if (typeof size !== 'number' || size <= 0)
			throw new TypeError('size must be a valid number');

		this.#array = new Array(Math.ceil(size / 32));
		this.#length = size;

		if (typeof xorKey === 'string' && xorKey.length) {
			const arr = Array.from(xorKey).map(char => char.charCodeAt(0));
			this.#xorKey = BitArray.crc32(arr);
		} else if (typeof xorKey === 'number' && xorKey) {
			this.#xorKey = Math.floor(xorKey) & 0xffffffff;
		} else {
			this.#xorKey = 0x00000000;
		}

		this.reset();
	}

	reset() {
		for (var i = 0; i < this.#array.length; i++)
			this.#array[i] = 0x00000000 >>> 0;
	}
	getBitLength() {
		return this.#length;
	}

	get(bit) {
		if (bit < this.#length) {
			return !!(this.#array[Math.floor(bit / 32)] & BitArray._BITMASKS[bit % 32])
		}
		throw new RangeError("Wrong number");
	}
	set(bit) {
		if (bit < this.#length)
			this.#array[Math.floor(bit / 32)] |= BitArray._BITMASKS[bit % 32];
	}
	unset(bit) {
		if (bit < this.#length)
			this.#array[Math.floor(bit / 32)] &= ~BitArray._BITMASKS[bit % 32];
	}
	toggle(bit) {
		if (this.get(bit)) {
			this.unset(bit);
			return false;
		} else {
			this.set(bit);
			return true;
		}
	}

	declump(clumpedArray) {
		if (!Array.isArray(clumpedArray) || clumpedArray.some((u32) => typeof u32 !== 'number'))
			throw new TypeError('clumped array can only contain uint32 numbers');


		const minSize = Math.min(this.#array.length, clumpedArray.length);
		for (var i = 0; i < minSize; i++) {
			this.#array[i] = clumpedArray[i];
		}
	}
	clump() {
		return this.#array.slice();
	}
	export() {
		//console.time();
		var encodedData = new Array(this.#array.length + 1);
		for (var i = 0; i < this.#array.length; i++) {
			encodedData[i] = BitArray._encodeU32(this.#array[i] >>> 0);
		}
		encodedData.push(BitArray._encodeU32((BitArray.crc32(this.#array) ^ this.#xorKey) >>> 0));

		return encodedData.reduce(function (acc, u32) {
			return acc + u32;
		}, '');
		//console.timeEnd();
	}
	importCheck(str) {
		if (typeof str !== 'string')
			return new TypeError();

		str = str.replace(/[^0-9abcxyzABCXYZ]/g, '');

		if (str.length % 8 !== 0 || str.length < 16)
			return false;


		var newArr = new Array((str.length / 8) - 1);
		for (var i = 0; i < newArr.length; i++) {
			newArr[i] = BitArray._decodeU32(str.substr(i * 8, 8));
		}
		const crc32 = BitArray._decodeU32(str.substr(i * 8, 8));
		if (((BitArray.crc32(newArr) ^ this.#xorKey) >>> 0) !== crc32)
			return false;

		return newArr;
	}
	import(str) {
		const parsedArray = this.importCheck(str,);
		if (!parsedArray)
			return false;
		this.#array = parsedArray;
		return true;
	}

	count() {
		return this.#array.reduce(function (u32) {
			/* parallel bit count algorithm by Brian Kernighan */
			u32 = u32 - ((u32 >> 1) & 0x55555555);
			u32 = (u32 & 0x33333333) + ((u32 >> 2) & 0x33333333);
			return (((u32 + (u32 >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
		}, 0);
	}
	getPercentage() {
		return (this.count() / this.#length) * 100;
	}











	static _encodeU32(u32) {
		var encoded = u32.toString(16).toUpperCase().replace(/D/g, 'X').replace(/E/g, 'Y').replace(/F/g, 'Z');

		if (typeof encoded.padStart === 'function')
			return encoded.padStart(8, '0');
		while (encoded.length < 8)
			encoded = '0' + encoded;

		return encoded;
	}

	static _decodeU32(encodedU32) {
		return parseInt(encodedU32.toLowerCase().replace(/x/g, 'd').replace(/y/g, 'e').replace(/z/g, 'f').replace(/[^0-9a-f]/g, ''), 16) >>> 0;
	}

	static CRC32TABLE = ((function () {
		var c, crcTable = [];
		for (var n = 0; n < 256; n++) {
			c = n;
			for (var k = 0; k < 8; k++)
				c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
			crcTable[n] = c
		}
		return crcTable
	})());

	static _BITMASKS = (function () {
		var arr = new Array(32);
		for (var i = 0; i < 32; i++)
			arr[i] = (1 << (31 - i)) >>> 0;
		return arr
	}());

	static crc32(arr) {
		arr = arr || this._array;

		var checksum = 0xffffffff;
		for (var i = 0; i < arr.length; i++) {
			checksum = (checksum >>> 8) ^ BitArray.CRC32TABLE[(checksum ^ (arr[i] >> 0)) & 0xff];
			checksum = (checksum >>> 8) ^ BitArray.CRC32TABLE[(checksum ^ (arr[i] >> 8)) & 0xff];
			checksum = (checksum >>> 8) ^ BitArray.CRC32TABLE[(checksum ^ (arr[i] >> 16)) & 0xff];
			checksum = (checksum >>> 8) ^ BitArray.CRC32TABLE[(checksum ^ (arr[i] >> 24)) & 0xff];
		}

		return (0xffffffff ^ checksum) >>> 0;
	}
}
