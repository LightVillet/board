"use strict"
function drag_n_drop (elem)
{
	elem.onmouseover = function(e)
	{
		console.log(elem.className, "over");
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
				console.log(relatedTarget.className, "out");
				elem.onmousedown = null;
				return;
			}
		
			relatedTarget = relatedTarget.parentNode;
		  }

	}
}
function createElem(e)
{
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", '/board/asd', false);
	let dic = {};
	dic["x"] = e.pageX;
	dic["y"] = e.pageY;
	xmlHttp.send( dic );
	let jsonData = JSON.parse(xmlHttp.responseText);
	let id = jsonData['id'];
	console.log( id );
	const newDiv = document.createElement("div");
	const newInput = document.createElement("input");
	document.body.appendChild(newDiv);
	newDiv.style.position = 'absolute';
	newDiv.style.left = e.pageX;
	newDiv.style.top = e.pageY;
	newDiv.className = "divasd";
	newDiv.id = id;
	newInput.className = "inputField";
	drag_n_drop(newDiv);
	newDiv.append(newInput);
	const empty = document.createElement("h1");
	const text = document.createTextNode("Hello"); 
	empty.append(text);
	//newDiv.append(empty);

}
renderElem(elem)

document.addEventListener('dblclick', function (e) {
	//let id = send_back(e);
	createElem(e);
});
let button_test = document.body.getElementsByClassName("button_test")[0];
let button_test_2 = document.body.getElementsByClassName("button_test")[1];
drag_n_drop(button_test);
drag_n_drop(button_test_2);


function send_back(e)
{
	
	return;
}

function render()
{
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/board/asd', false);
	let jsonData = JSON.parse(xmlHttp.responseText);
	for (let i in jsonData)
	{
		
	}
}