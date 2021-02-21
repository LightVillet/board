"use strict"

function drag_n_drop (elem) {
	const childNameField = elem.getElementsByClassName("nameField")[0];
	console.log(childNameField);
	const childElem = elem.lastChild;
	childNameField.onmousedown = function(e)
	{
		e = e || window.event;
		pauseEvent(e);

		if (e.target == childNameField)
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
			childNameField.onmouseup = function(e)
			{
				document.onmousemove = null;
				childNameField.onmouseup = null;
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
		if (e.target == childElem)
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

function pauseEvent(e) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
};


function moveElement(data) {
	const elem = document.getElementById(data["id"]);
	elem.style.left = data["x"];
	elem.style.top = data["y"];
	elem.style.zIndex = data["z"];
};

function createElement(data) {
	const divMain = document.createElement("div");
	const divPanel = document.createElement("div");
	const buttonClose = document.createElement("button");
	const nameField = document.createElement("div");

	nameField.className = "nameField";
	divMain.className = "divMain";
	divPanel.className = "divPanel";
	buttonClose.className = "button buttonClose";

	divMain.style.position = 'absolute';
	divMain.style.left = data["x"];
	divMain.style.top = data["y"];
	divMain.style.zIndex = data["z"];
	divMain.style.width = data["width"];
	divMain.style.height = data["height"];
	divMain.id = data["id"];
	nameField.innerText = data["name"] ? data["name"] : "";

	buttonClose.onclick = function(e) {
		if (e.target == buttonClose)
		{
			e.stopPropagation();
			divMain.remove();
			socket.emit('delete', {
				"id" : divMain.id}); 
		}
	};

	document.body.appendChild(divMain);
	divMain.appendChild(divPanel);
	divPanel.appendChild(buttonClose);
	divPanel.appendChild(nameField);

	return data["id"];
};

function createFileElement(data) {
	const id = createElement(data);
	const divMain = document.getElementById(id);
	const divPanel = divMain.firstChild;
	const nameField = divPanel.getElementsByClassName("nameField")[0];

	const buttonLoad = document.createElement("button");
	buttonLoad.className = "button buttonLoad";
	buttonLoad.onclick = function(e) {
		const downloadLink = document.createElement("a");
		downloadLink.href = "/download/" + divMain.id;
		downloadLink.download = data["name"];
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};


	const img = document.createElement("img");
	img.src = "/static/img/file.png";

	divPanel.insertBefore(buttonLoad, nameField);
	divMain.appendChild(img);
	drag_n_drop(divMain);
};



function createTextElement(data) {
	const id = createElement(data);
	const divMain = document.getElementById(id);
	const divPanel = divMain.firstChild;
	const nameField = divPanel.getElementsByClassName("nameField")[0];
	const divInput = document.createElement("div");
	const buttonSave = document.createElement("button");

	divMain.classList.add("divMainText");
	divInput.className = "inputField";
	buttonSave.className = "button buttonSave";


	divInput.contentEditable = true;
	divInput.innerText = data["data"] ? data["data"] : "";
	
	buttonSave.onclick = function(e) { 
		if (e.target == buttonSave) {
			nameField.contentEditable = false;
			e.stopPropagation();
			socket.emit('save', {
				"id" : divMain.id,
				"data" : divInput.innerText,
				"width" : divMain.style.width,
				"height" : divMain.style.height});
		}
	};

	// nameField.addEventListener('dblclick', function (e) {
	// 	if (e.target == nameField)
	// 	{
	// 		nameField.contentEditable = true;
	// 	}
	// });

	divPanel.insertBefore(buttonSave, nameField);
	divMain.append(divInput);
	drag_n_drop(divMain);
};

function editElement(data)
{
	const elem = document.getElementById(data["id"]);
	elem.style.width = data["width"];
	elem.style.height = data["height"];
	elem.getElementsByClassName("inputField")[0].innerText = data["data"] ? data["data"] : "";
	//elem.getElementsByClassName("nameFiled")[0].innerText = data["name"] ? data["name"] : "";
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
	while (elems.length != 0)
		deleteElement({
			"id" : elems[0].id});
	for (let i = 0; i < data.length; i++) {
		console.log(data);
		if (data[i]["type"] == "text")
			createTextElement(data[i]);
		else
			createFileElement(data[i]);
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
	if (data["type"] == "file")
			createFileElement(data);
		else
			createTextElement(data);
});

document.addEventListener('dblclick', function (e) {
	if (e.target == document.documentElement)
	{
	const data = {
		"type" : "text",
		"x" : e.pageX,
		"y" : e.pageY,
		"height" : "330px",
		"width" : "300px",
		"name" : "asd"
	};	
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
		fetch('/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			  },
			body: JSON.stringify({
				"x" : e.pageX, 
				"y" : e.pageY, 
				"type" : "file", 
				"height" : "180px", 
				"width" : "150px", 
				"data" : reader.result,
				"name" : file.name
			})
		  });
	}
});

document.addEventListener('dragover', function (e) {
	e.preventDefault();
});
