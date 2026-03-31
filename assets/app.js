/*
	Completion Tracker JS custom UI implementation by Marc Robledo 2013-2026
*/

const CompletionTrackerUI = (function () {
	var myTracker = null;
	let filters = [];
	let currentFilters = {};

	var topbarMenuSvg, topbarMenuIcon = new Image();

	const _viewTransition = function (fn) {
		if (document.startViewTransition && !document.activeViewTransition)
			document.startViewTransition(fn);
		else
			fn.call();
	};
	const _showNav = function () {
		document.body.classList.add('scroll-locked');
		document.querySelector('nav').classList.add('show');
		document.getElementById('nav-backdrop').classList.add('show');
	}
	const _hideNav = function () {
		document.body.classList.remove('scroll-locked');
		document.querySelector('nav').classList.remove('show');
		document.getElementById('nav-backdrop').classList.remove('show');
	}



	const _rebuildFilteredWrappper = function (evt) {
		//const gameId = myTracker.getGameId();
		const sectionId = currentSectionId;
		const filterId = filtersSelect.value;
		const hideChecked = filterHideChecked.checked;
		currentFilters[sectionId] = filtersSelect.selectedIndex;

		const tab = document.getElementById('tab-' + sectionId);
		if (!tab.wrapperOriginal) {
			tab.wrapperOriginal = Array.from(tab.children);
			tab.wrapperOriginal.forEach(function (child) {
				if (child.tagName === 'UL')
					child.originalLisOrder = Array.from(child.children);
			});
		}

		tab.innerHTML = '';
		if (filterId) {
			if (tab.wrapperOriginal[0].tagName === 'H2') {
				const h2 = document.createElement('h2');
				h2.innerHTML = tab.wrapperOriginal[0].innerHTML;
				h2.className = 'hide-for-mobile';
				tab.appendChild(h2);
			}
			const filter = filters.find((filter) => filter.category === sectionId && filter.group === filterId);

			const checkboxes = myTracker.getCheckboxes(sectionId);

			filter.groupNames.forEach(function (groupName, i) {
				const h3 = document.createElement('h3');
				h3.innerHTML = groupName;



				let filteredCheckboxes = checkboxes.filter((checkbox) => parseInt(checkbox.getAttribute('data-group-' + filter.group) || '0') === i);
				filteredCheckboxes.sort((a, b) =>
					parseInt(a.getAttribute('data-order-' + filter.group) || (a.getAttribute('data-index') + 9000)) -
					parseInt(b.getAttribute('data-order-' + filter.group) || (b.getAttribute('data-index') + 9000))
				);
				if (hideChecked)
					filteredCheckboxes = filteredCheckboxes.filter((checkbox) => !checkbox.checked);


				const ul = document.createElement('ul');
				filteredCheckboxes.forEach(function (checkbox) {
					const li = checkbox.parentElement.parentElement;
					if (li.tagName !== 'LI')
						throw new Error('Invalid checkbox list structure for grouping/sorting');
					ul.appendChild(li);
				});
				if (filteredCheckboxes.length) {
					tab.appendChild(h3);
					if (filter.description) {
						const pDescription = document.createElement('p');
						pDescription.innerHTML = filter.description;
						tab.appendChild(pDescription);
					}
					tab.appendChild(ul);
				}
			});
		} else {
			tab.wrapperOriginal.forEach(function (child) {
				tab.appendChild(child);
				if (child.tagName === 'UL') {
					child.innerHTML = '';

					let lis = child.originalLisOrder;
					if (hideChecked)
						lis = lis.filter((li) => li.querySelector('input[type=checkbox][data-index]') && !li.querySelector('input[type=checkbox][data-index]').checked);

					lis.forEach(function (li) {
						child.appendChild(li);
					});
				}
			});
		}
		_viewTransition(_hidePopoverFilters);
	};
	const filtersSelect = document.createElement('select');
	filtersSelect.addEventListener('change', _rebuildFilteredWrappper);
	const filterHideChecked = document.createElement('input');
	filterHideChecked.type = 'checkbox';
	filterHideChecked.addEventListener('change', _rebuildFilteredWrappper);



	const _showPopoverFilters = function () {
		document.getElementById('filters').classList.add('show');
	}
	const _hidePopoverFilters = function () {
		document.getElementById('filters').classList.remove('show');
	}





	const _checkSection = function (sectionId) {
		if (typeof sectionId === 'string' && document.getElementById('tab-' + sectionId))
			return sectionId;
		return 'home';
	}
	const _showSpoiler = function (evt) {
		this.parentElement.querySelector('div.spoiler').className = 'spoiler show';
		this.parentElement.removeChild(this);
	}
	const _showSection = function (sectionId) {
		sectionId = _checkSection(sectionId);
		currentSectionId = sectionId;

		document.querySelectorAll('nav ul li').forEach(function (el) {
			el.classList.remove('selected');
		});
		document.getElementById('nav-' + sectionId).classList.add('selected');

		document.querySelectorAll('.tab').forEach(function (el) {
			if (el.id === 'tab-' + sectionId)
				el.style.display = 'block';
			else
				el.style.display = 'none';
		});

		document.getElementById('topbar-title').innerHTML = document.getElementById('nav-' + sectionId).innerText;

		const sectionIcon = document.body.querySelector('#nav-' + sectionId + ' img');
		if (sectionId === 'home' || !sectionIcon) {
			document.getElementById('btn-menu-toggle').replaceChild(topbarMenuSvg, document.getElementById('btn-menu-toggle').firstChild);
		} else {
			document.getElementById('btn-menu-toggle').replaceChild(topbarMenuIcon, document.getElementById('btn-menu-toggle').firstChild);
			topbarMenuIcon.src = sectionIcon.src;
		}

		/* hide spoilers */
		document.getElementById('tab-' + sectionId).querySelectorAll('div.spoiler').forEach(function (div) {
			div.className = 'spoiler';

			if (!div.buttonSpoiler) {
				div.buttonSpoiler = document.createElement('button');
				div.buttonSpoiler.className = 'btn-spoiler';
				div.buttonSpoiler.innerHTML = 'Más información';
				div.buttonSpoiler.addEventListener('click', _showSpoiler);
			}
			div.parentElement.appendChild(div.buttonSpoiler);
		});

		/* prepare filters menu */
		const isHome = sectionId === 'home';
		document.getElementById('btn-filters-toggle').style.display = isHome ? 'none' : 'inline-block';
		document.getElementById('filters').style.display = isHome ? 'none' : '';
		filtersSelect.innerHTML = '';
		if (!isHome) {
			const categoryFilters = filters.filter((filter) => filter.category === sectionId);
			if (categoryFilters.length) {
				filtersSelect.style.display = 'inline-block';
				filtersSelect.innerHTML = '';

				const option2 = document.createElement('option');
				option2.value = '';
				option2.innerHTML = 'Todos';
				filtersSelect.appendChild(option2);

				categoryFilters.forEach(function (filterInfo, i) {
					const option = document.createElement('option');
					option.value = filterInfo.group;
					option.innerHTML = filterInfo.label;
					filtersSelect.appendChild(option);
					if(currentFilters[sectionId] === i)
						filtersSelect.selectedIndex = i;
				});
			} else {
				filtersSelect.style.display = 'none';
			}
		}

		//window.scrollTop(0);
	}


	const _evtClickHash = function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		const hash = _checkSection(this.href.replace(/^.*?#/, ''));
		history.pushState({ section: hash }, null, '#' + hash);
		_viewTransition(function () {
			_showSection(hash);
			_hideNav();
			_hidePopoverFilters();
		});
	}


	const _putMapMarker = function (mapInfo, positionId) {
		const ctx = mapInfo.canvas.getContext('2d');
		ctx.clearRect(0, 0, mapInfo.canvas.width, mapInfo.canvas.height);

		if (!mapInfo.positions)
			return false;

		const position = mapInfo.positions.find(function (position) {
			return position.id === positionId;
		});
		if (!position)
			return false;


		if (typeof mapInfo.imageMarker === 'string') {
			const marker = new Image();
			marker.onload = function (evt) {
				mapInfo.imageMarker = this;
				_putMapMarker(mapInfo, positionId);
			}
			marker.src = mapInfo.imageMarker;
		} else if (mapInfo.canvas) {
			ctx.drawImage(mapInfo.imageMarker, position.x, position.y);
		}
	}

	return {
		initialize: function (gameId, categoryFilters) {
			/* avoid multiple open tabs */
			localStorage.setItem(gameId + '-tab-open', (new Date()).getTime());
			window.addEventListener('storage', function (evt) {
				if (evt.key === gameId + '-tab-open') {
					if (!document.getElementById('dialog-multiple-tabs')) {
						const dialog = document.createElement('dialog');
						dialog.id = 'dialog-multiple-tabs';
						dialog.innerHTML = 'La app se ha abierto en otra pestaña.<br/>Continúa tu progreso allí.';
						dialog.addEventListener('cancel', function (evt) {
							evt.preventDefault();
						});
						document.body.appendChild(dialog);
					}
					document.getElementById('dialog-multiple-tabs').showModal();
				}
			});

			/* nav */
			topbarMenuSvg = document.getElementById('topbar-icon');
			topbarMenuIcon.id = topbarMenuSvg.id;
			document.querySelectorAll('nav>ul>li').forEach(function (li) {
				const a = li.querySelector('a');
				if (!a || !/#[\w\-]+/.test(a.href))
					throw new Error('Invalid nav link');

				const sectionId = a.href.substr(a.href.indexOf('#') + 1);
				li.id = 'nav-' + sectionId;
				li.addEventListener('click', function (evt) {
					a.click();
				});
				a.addEventListener('click', _evtClickHash);

			});
			document.getElementById('btn-menu-toggle').addEventListener('click', function (evt) {
				if (document.querySelector('nav').classList.contains('show'))
					_viewTransition(_hideNav);
				else
					_viewTransition(_showNav);
			});

			const navBackdrop = document.createElement('div');
			navBackdrop.id = 'nav-backdrop';
			navBackdrop.addEventListener('click', function(evt){
				_viewTransition(_hideNav);
			});
			document.body.appendChild(navBackdrop);
			document.body.addEventListener('click', function(evt){
				if(document.getElementById('filters') && document.getElementById('filters').className==='show')
					_viewTransition(_hidePopoverFilters);
			});



			document.getElementById('topbar-icon').setAttribute('data-src', document.getElementById('topbar-icon').src);


			/* filters toggle button */
			if (document.getElementById('btn-filters-toggle')) {
				document.getElementById('btn-filters-toggle').addEventListener('click', function (evt) {
					evt.stopPropagation();
					_viewTransition(function () {
						_hideNav();
						if (document.getElementById('filters') && document.getElementById('filters').classList.contains('show'))
							_viewTransition(_hidePopoverFilters);
						else
							_viewTransition(_showPopoverFilters);
					});
				});
			}
			const divFilters = document.createElement('div');
			divFilters.id = 'filters';
			divFilters.addEventListener('click', function (evt) {
				evt.stopPropagation();
			});
			document.getElementById('content').insertBefore(divFilters, document.getElementById('content').firstChild);

			divFilters.appendChild(filtersSelect);
			const label2 = document.createElement('label');
			label2.appendChild(filterHideChecked);
			label2.appendChild(document.createTextNode('Ocultar completados'));
			divFilters.appendChild(label2);



			/* filters */
			if (Array.isArray(categoryFilters)) {
				filters = categoryFilters.filter((categoryFilter) => typeof categoryFilter.category === 'string' && typeof categoryFilter.group === 'string');
			}


			/* const links=document.querySelectorAll('.tab a[href^="#"]');
			links.forEach(function(link){
				link.addEventListener('click', _evtClickHash);
			}); */

			const initialSection = _checkSection(location.hash && location.hash.replace('#', ''));
			history.replaceState({ section: initialSection }, '');
			_showSection(initialSection);
			window.addEventListener('popstate', function (evt) {
				const section = _checkSection(evt.state && evt.state.section);
				_viewTransition(function () {
					_showSection(section);
					_hideNav();
					_hidePopoverFilters();
				});
			});






			myTracker = CompletionTracker.enable(gameId);


			/* progress bars */
			myTracker.getProgress().categories.forEach(function (categoryInfo) {
				const categoryId = categoryInfo.categoryId;
				const navLi = document.getElementById('nav-' + categoryId);
				if (navLi)
					navLi.appendChild(myTracker.buildProgressElements(categoryId).progressBar);
			});

			const containerTotalProgressBar = document.getElementById('container-total-progress-bar');
			const containerTotalProgressCounter = document.getElementById('container-total-counter');
			const containerTotalProgressTotal = document.getElementById('container-total-total');
			const containerTotalProgressPercentage = document.getElementById('container-total-percentage');
			if (containerTotalProgressBar && containerTotalProgressCounter && containerTotalProgressTotal && containerTotalProgressPercentage) {
				const totalProgressElements = myTracker.buildProgressElements();
				containerTotalProgressBar.appendChild(totalProgressElements.progressBar);
				containerTotalProgressCounter.appendChild(totalProgressElements.counter);
				containerTotalProgressTotal.appendChild(totalProgressElements.total);
				containerTotalProgressPercentage.appendChild(totalProgressElements.percentage);
			}
			if (document.getElementById('btn-transfer-progress')) {
				document.getElementById('btn-transfer-progress').addEventListener('click', function (evt) {
					myTracker.showTransferDialog();
				});
			}

			return myTracker;
		},



		showMap: function (mapInfo, positionId) {
			if (!mapInfo.id)
				throw new Error('invalid map id');

			const dialogExists = mapInfo.dialog;
			const dialog = dialogExists || document.createElement('dialog');
			if (!dialogExists) {
				dialog.addEventListener('click', function (evt) {
					this.close();
				});
				dialog.className = 'dialog-map';
				mapInfo.dialog = dialog;
				const bg = new Image();
				bg.onload = function (evt) {
					const canvas = document.createElement('canvas');
					canvas.width = this.width;
					canvas.height = this.height;
					canvas.style.backgroundImage = 'url(' + mapInfo.imageBackground + ')';
					canvas.style.backgroundSize = 'contain';

					mapInfo.canvas = canvas;
					mapInfo.dialog.appendChild(canvas);

					_putMapMarker(mapInfo, positionId);
				}
				bg.src = mapInfo.imageBackground;
				document.body.appendChild(dialog);
			} else {
				_putMapMarker(mapInfo, positionId);
			}

			dialog.showModal();
		}
	}
}());
