function slug(string) {
    return string
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/-+/g, ' ')
        .replace(/\s+/g, ' ');
}


function refreshResults(){
	const filterValue=document.getElementById('select-filter').value;
	const query=slug(document.getElementById('input-search').value);

	let results;
	if(filterValue==='none'){
		if(query){
			results=allItems.filter((item) => item.slug.indexOf(query)!==-1);
			if(results.length>100)
				results=results.slice(0,100);
		}else{
			results=[];
		}
	}else if(/^category:/.test(filterValue)){
		const category=filterValue.split(':')[1];
		results=CATEGORIES.find((categoryInfo) => categoryInfo.id===category).items;
	}else if(/^method:/.test(filterValue)){
		const method=filterValue.split(':')[1];
		const regex=new RegExp(method);
		results=allItems.filter((item) => item.method && regex.test(item.method));
	}

	document.getElementById('span-count').innerHTML=results.filter((item) => item.checkbox.checked).length;
	document.getElementById('span-total').innerHTML=results.length;
	const list=document.getElementById('list');
	list.innerHTML='';

	if(results.length){
		document.getElementById('current-totals').style.display='block';
		results.forEach(function(item){
			list.appendChild(item.li);
		});
	}else{
		document.getElementById('current-totals').style.display='none';
		const li=document.createElement('li');
		if(filterValue!=='none' || query){
			li.innerHTML='No se han encontrado resultados';
		}else{
			li.innerHTML='Escoge un filtro arriba para mostrar el catálogo de Animal Crossing: New Leaf.';
		}
		list.appendChild(li);
	}
}


let allItems=[];
let cachedSearch='';
let searchCooldown;
let myTracker;


function showItemInfo(evt){
	const categoryId=this.mappedItem.category;
	const category=CATEGORIES.find((cat) => cat.id === categoryId);
	document.getElementById('item-info-name').innerHTML=this.mappedItem.es;
	document.getElementById('item-info-name-en').innerHTML='(EN: ' + this.mappedItem.en + ')';
	document.getElementById('item-info-category').innerHTML='Tipo: '+(category? category.label : categoryId);
	document.getElementById('item-info-method').innerHTML=this.mappedItem.methodLabel? 'Método: ' + this.mappedItem.methodLabel : '';
	document.getElementById('item-info-orderable').innerHTML=this.mappedItem.orderable? '' : 'No se puede pedir';

	document.getElementById('popover-item-info').anchor=this.id;
	this.style.anchorName='--anchor'+this.mappedItem.id;
	document.getElementById('popover-item-info').style.positionAnchor=this.style.anchorName;
	document.getElementById('popover-item-info').showPopover();
}
window.addEventListener('load', function(){
	let itemsAllIndex=0;
	CATEGORIES.forEach(function(category){
		let itemIndex=0;

		category.items=category.items.map(function(item, i){
			const li=document.createElement('li');
			const checkbox=document.createElement('input');
			const mappedItem={id:itemIndex++, category:category.id, slug:slug(item[0]), es:item[0], en:item[1], method:item[2]? item[2][0] : null, methodLabel:item[2]? item[2][1] : null, orderable:!!item[3], checkbox:checkbox, li:li};

			checkbox.type='checkbox';
			checkbox.setAttribute('data-tracker', 'animal-crossing-new-leaf');
			checkbox.setAttribute('data-category', mappedItem.category);
			checkbox.setAttribute('data-index', itemsAllIndex++);
			checkbox.addEventListener('change', function(evt){
				const difference=this.checked? +1 : -1;
				document.getElementById('span-count').innerHTML=parseInt(document.getElementById('span-count').innerHTML) + difference;
			});
			const title=item[2]? item[2][1] : '';

			const spanMethod=mappedItem.method? `<span class="item-method method_${mappedItem.method}" title="${title}"></span>` : ``;
			li.innerHTML=`<div><label></label></div><div>${spanMethod}<span class="item-category ${mappedItem.category}" title="${title}"></span></div>`;
			li.children[0].children[0].appendChild(checkbox);
			li.children[0].children[0].appendChild(document.createElement('span'));
			li.children[0].children[0].children[1].innerHTML=mappedItem.es;
			
			li.children[1].mappedItem=mappedItem;
			li.children[1].addEventListener('click', showItemInfo);
			li.children[1].id='anchor'+mappedItem.id;

			document.getElementById('list').appendChild(li);

			allItems.push(mappedItem);

			return mappedItem;
		});
	});
	

	document.getElementById('input-search').addEventListener('input', function(evt){
		if(searchCooldown)
			window.clearTimeout(searchCooldown);

		searchCooldown=window.setTimeout(function(){
			const query=slug(document.getElementById('input-search').value);
			if(query && query.length>1){
				document.getElementById('select-filter').value='none';
				cachedSearch=query;
				refreshResults();
			}
		}, 200);
	});

	document.getElementById('select-filter').addEventListener('change', function(evt){
		if(this.value !== 'none'){
			document.getElementById('input-search').value='';
		}else{
			if(typeof cachedSearch==='string')
				document.getElementById('input-search').value=cachedSearch;
		}
		refreshResults();
	});

	document.getElementById('btn-transfer').addEventListener('click', function(evt){
		myTracker.showTransferDialog();
	});

	myTracker=CompletionTracker.enable('animal-crossing-new-leaf');
	refreshResults();
	document.getElementById('content').style.display='block';
	document.getElementById('container-filter').className='show';
	document.getElementById('loading').remove();
});
