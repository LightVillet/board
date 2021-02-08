"use strict"
function drag_n_drop (elem)
{
	elem.onmouseover = function(e)
	{
//		console.log(elem.className, "over");
		elem.onmousedown = function(e)
		{
			let shiftX = e.clientX - elem.getBoundingClientRect().left;
			let shiftY = e.clientY - elem.getBoundingClientRect().top;
			//console.log(button_test.style.left + 0, button_test.style.top + 0, button_y, e.pageX, e.pageY);
			elem.style.position = 'absolute';
			moveAt(e);
			document.body.appendChild(elem);
			elem.style.zIndex = 1000; 
			function moveAt(e)
			{
					elem.style.left = e.pageX - shiftX + "px";
					elem.style.top = e.pageY - shiftY + "px";
			}
			document.onmousemove = function(e) 
			{
				moveAt(e);
			}
			elem.onmouseup = function()
			{
				document.onmousemove = null;
				elem.onmouseup = null;
			}
		}
	}
	elem.onmouseout = function(e)
	{
		let relatedTarget = e.relatedTarget;
		while (relatedTarget) {
			if (relatedTarget == elem)
			{
//				console.log(relatedTarget.className, "out");
				elem.onmousedown = null;
				return;
			}
		
			relatedTarget = relatedTarget.parentNode;
		  }

	}
}
function createElem(e, board_name)
{
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", '/board/' + board_name + '/update', false);
	let dic = {};
	dic["x"] = e.pageX;
	dic["y"] = e.pageY;
	xmlHttp.send(JSON.stringify(dic));
}

function render(board_name)
{
//    console.log('asd');
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/board/' + board_name + '/update', false);
	xmlHttp.send( null );
	let text = xmlHttp.responseText;
	// alert(text);
	if (!text)
	{
		return;
	}
	console.log(text);
	let jsonData = JSON.parse(text);

	let elements = document.getElementsByClassName('divasd');
	while (elements.length)
	{
		elements[0].remove();
	}
	elements = document.getElementsByClassName('divasd');
	console.log(jsonData);
	console.log(elements);
	for (let i in jsonData)
	{
		const newDiv = document.createElement("div");
		const newInput = document.createElement("input");
		document.body.appendChild(newDiv);
		newDiv.style.position = 'absolute';
		newDiv.style.left = jsonData[i]['x'];
		newDiv.style.top = jsonData[i]['y'];
		newDiv.className = "divasd";
		newDiv.id = jsonData[i]['id'];
		newInput.className = "inputField";
		drag_n_drop(newDiv);
		newDiv.append(newInput);
		const empty = document.createElement("h1");
		const text = document.createTextNode("Hello");
		empty.append(text);
	}
}

function ferp(board_name)
{

    setInterval(function(){render(board_name)},1000);


    document.addEventListener('dblclick', function (e) {
        createElem(e, board_name);
    });
}