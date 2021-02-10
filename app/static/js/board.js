"use strict"
function drag_n_drop (elem)
{
	let childElem = elem.getElementsByClassName("divPanel")[0];
	console.log(elem);
	childElem.onmouseover = function(e)
	{
//		console.log(elem.className, "over");
		childElem.onmousedown = function(e)
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
			childElem.onmouseup = function()
			{
				document.onmousemove = null;
				elem.onmouseup = null;
				socket.emit('move' , {"id" : elem.id, "x" : elem.style.left, "y" : elem.style.top});
			}
		}
	}
	childElem.onmouseout = function(e)
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


function update(data)
{
	socket.emit('update', data);
}

function moveElement(data)
{
	const elem = document.getElementById(data["id"]);
	elem.style.left = data["x"];
	elem.style.top = data["y"];
}

function createElement(data)
{
	const newDiv = document.createElement("div");
	const newInput = document.createElement("div");
	const panelDiv = document.createElement("div");
	newDiv.className = "divMain";
	panelDiv.className = "divPanel";
	newInput.contentEditable = true;
	newInput.innerText = data["text"] ? data["text"] : "";
	document.body.appendChild(newDiv);
	const ButtonClose = document.createElement("button");
	ButtonClose.className = "buttonClose";
	ButtonClose.onclick = function() { socket.emit('delete', {"id" : newDiv.id}); };
	panelDiv.appendChild(ButtonClose);
	const ButtonSave = document.createElement("button");
	ButtonSave.className = "buttonClose";
	ButtonSave.onclick = function() { socket.emit('edit', {"id" : newDiv.id, "text" : newInput.innerText}); };
	panelDiv.appendChild(ButtonSave);
	newDiv.style.position = 'absolute';
	newDiv.style.left = data["x"];
	newDiv.style.top = data["y"];
	newDiv.id = data["id"];
	newInput.className = "inputField";
	newDiv.append(panelDiv);
	newDiv.append(newInput);
	drag_n_drop(newDiv);
};



function editElement(data)
{
	const elem = document.getElementById(data["id"]).getElementsByClassName("inputField")[0];
	elem.innerText = data["text"];
}

function deleteElement(data)
{
	const elem = document.getElementById(data["id"]);
	elem.remove();
};

let socket = new io();
socket.on('connect', function() {
	console.log("Connected server");
});

socket.on('move', function(data) {
	console.log("move  " + data["id"]);
	moveElement(data);
});
socket.on('init', function(data) {

	for (let elem in data)
	{
		createElement(data[elem]);
	}
});

socket.on('edit', function(data) {
	console.log("edit " + data["id"]);
	editElement(data);
});

socket.on('delete', function(data) {
	console.log("delete " + data["id"]);
	deleteElement(data);
});

socket.on('create', function(data) {
	console.log("create " + data["id"]);
	createElement(data);
});

document.addEventListener('dblclick', function (e) {
	const data = { "x" : e.pageX, "y" : e.pageY };
	socket.emit('create', data);
	
});
