"use strict"

function drag_n_drop (elem)
{
	let childButtonClose = elem.getElementsByClassName("buttonClose")[0];
	let childButtonSave = elem.getElementsByClassName("buttonSave")[0];
	let childInputField = elem.getElementsByClassName("InputField")[0];
	let childDivPanel = elem.getElementsByClassName("divPanel")[0];
	childDivPanel.onmousedown = function(e)
	{
		e = e || window.event;
		pauseEvent(e);

		if (e.target == childDivPanel)
		{
			let shiftX = e.clientX - elem.getBoundingClientRect().left;
			let shiftY = e.clientY - elem.getBoundingClientRect().top;
			elem.style.position = "absolute";
			elem.style.zIndex = 10000;

			document.onmousemove = function(e) 
			{
				elem.style.left = e.pageX - shiftX + "px";
				elem.style.top = e.pageY - shiftY + "px";	
			}
			childDivPanel.onmouseup = function(e)
			{
				document.onmousemove = null;
				childDivPanel.onmouseup = null;
				socket.emit('move' , {
					"id" : elem.id,
					"x" : elem.style.left, 
					"y" : elem.style.top
				});
			}
		}
	}
	elem.onclick = function(e)
	{
		if (e.target == childInputField)
		{
			elem.style.zIndex = 10000;
			socket.emit('move' , {
				"id" : elem.id,
				"x" : elem.style.left, 
				"y" : elem.style.top
			});
		}
	}
}

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}


function moveElement(data)
{
	const elem = document.getElementById(data["id"]);
	elem.style.left = data["x"];
	elem.style.top = data["y"];
	elem.style.zIndex = data["z"];
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
	buttonClose.className = "button buttonClose";
	buttonSave.className = "button buttonSave";

	divMain.style.position = 'absolute';
	divMain.style.left = data["x"];
	divMain.style.top = data["y"];
	divMain.style.zIndex = data["z"];
	divMain.style.width = data["width"];
	divMain.style.height = data["height"];
	divMain.id = data["id"];

	divInput.contentEditable = true;
	divInput.innerText = data["data"] ? data["data"] : "";

	buttonClose.onclick = function(e) {
		if (e.target == buttonClose)
		{
			e.stopPropagation();
			divMain.remove();
			socket.emit('delete', {
				"id" : divMain.id}); 
		}
	};
	buttonSave.onclick = function(e) { 
		if (e.target == buttonSave)
		{
			e.stopPropagation();
			socket.emit('save', {
				"id" : divMain.id,
				"data" : divInput.innerText,
				"width" : divMain.style.width,
				"height" : divMain.style.height});
		}
	};

	
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
	if (elem)
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
	let elems = document.getElementsByClassName("divMain");
	for (let i = 0; i < elems.length; i++)
		deleteElement(elems[i].id);
	for (let i = 0; i < data.length; i++)
		createElement(data[i]);
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
	if (e.target == document.documentElement)
	{
	const data = {"type" : "text", "x" : e.pageX, "y" : e.pageY, "height" : "300px", "width" : "300px"};	
	socket.emit('create', data);
	}
});

document.addEventListener('drop', function (e) {
	console.log('File dropped');
	e.preventDefault();
	let file = e.dataTransfer.items[0].getAsFile();
	let reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function() {
		let response = fetch('/upload', {
			method: 'POST',
			body: new FormData(reader.result)
		  });
		console.log(responce.json());
	}
});

document.addEventListener('dragover', function (e) {
	e.preventDefault();
});
