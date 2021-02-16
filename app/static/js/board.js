"use strict"

let maxZIndex = 0;

function drag_n_drop (elem)
{
	let childElem = elem.getElementsByClassName("divPanel")[0];
	childElem.onmousedown = function(e)
	{
		let shiftX = e.clientX - elem.getBoundingClientRect().left;
		let shiftY = e.clientY - elem.getBoundingClientRect().top;
		elem.style.position = "absolute";
		elem.style.zIndex = ++maxZIndex;
		document.onmousemove = function(e) 
		{
			elem.style.left = e.pageX - shiftX + "px";
			elem.style.top = e.pageY - shiftY + "px";	
		}
		childElem.onmouseup = function()
		{
			document.onmousemove = null;
			elem.onmouseup = null;
			socket.emit('move' , {
				"id" : elem.id, 
				"x" : elem.style.left, 
				"y" : elem.style.top});
		}
	}
	elem.onclick = function(e)
	{
		elem.style.zIndex = ++maxZIndex;
	}
}


function moveElement(data)
{
	const elem = document.getElementById(data["id"]);
	elem.style.left = data["x"];
	elem.style.top = data["y"];
	//elem.style.zIndex = 1000;
}

function createElement(data)
{
	const divMain = document.createElement("div");
	const divInput = document.createElement("div");
	const divPanel = document.createElement("div");
	const buttonClose = document.createElement("button");
	const buttonSave = document.createElement("button");

	divMain.className = "divMain";
	divInput.className = "inputField";
	divPanel.className = "divPanel";
	buttonClose.className = "buttonClose";
	buttonSave.className = "buttonSave";

	divMain.style.position = 'absolute';
	divMain.style.left = data["x"];
	divMain.style.top = data["y"];
	divMain.style.width = data["width"];
	divMain.style.height = data["height"];
	divMain.id = data["id"];

	divInput.contentEditable = true;
	divInput.innerText = data["data"] ? data["data"] : "";

	buttonClose.onclick = function() { 
		socket.emit('delete', {
			"id" : divMain.id}); };
	buttonSave.onclick = function() { 
		socket.emit('save', {
			"id" : divMain.id,
			"data" : divInput.innerText,
			"width" : divMain.style.width,
			"height" : divMain.style.height}); };

	
	document.body.appendChild(divMain);
	divMain.append(divPanel);
	divPanel.appendChild(buttonClose);
	divPanel.appendChild(buttonSave);
	divMain.append(divInput);
	drag_n_drop(divMain);
};

function editElement(data)
{
	const elem = document.getElementById(data["id"]);
	elem.style.width = data["width"];
	elem.style.height = data["height"];
	elem.getElementsByClassName("inputField")[0].innerText = data["data"];
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

socket.on('save', function(data) {
	console.log("save " + data["id"]);
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
	const data = {"type" : "text", "x" : e.pageX, "y" : e.pageY, "height" : "300px", "width" : "300px"};	
	socket.emit('create', data);
	
});
