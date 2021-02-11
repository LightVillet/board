"use strict"
function drag_n_drop (elem)
{
	let childElem = elem.getElementsByClassName("divPanel")[0];
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
	elem.style.zIndex = 1000;
}

function createElement(data)
{
	const newDiv = document.createElement("div");
	const newInput = document.createElement("div");
	const panelDiv = document.createElement("div");
	newDiv.className = "divMain";
	panelDiv.className = "divPanel";
	newInput.contentEditable = true;
	newInput.innerText = data["data"] ? data["data"] : "";
	document.body.appendChild(newDiv);
	const ButtonClose = document.createElement("button");
	ButtonClose.className = "buttonClose";
	ButtonClose.onclick = function() { socket.emit('delete', {"id" : newDiv.id}); };
	panelDiv.appendChild(ButtonClose);
	const ButtonSave = document.createElement("button");
	ButtonSave.className = "buttonClose";
	ButtonSave.onclick = function() { socket.emit('save', {"id" : newDiv.id, "data" : newInput.innerText, "width" : newDiv.style.width, "height" : newDiv.style.height}); };
	panelDiv.appendChild(ButtonSave);
	newDiv.style.position = 'absolute';
	newDiv.style.left = data["x"];
	newDiv.style.top = data["y"];
	newDiv.style.width = data["width"];
	newDiv.style.height = data["height"];
	newDiv.id = data["id"];
	newInput.className = "inputField";
	newDiv.append(panelDiv);
	newDiv.append(newInput);
	drag_n_drop(newDiv);
	//ro.observe(newDiv);
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

// var ro = new ResizeObserver(entries => {
// 	for (let entry of entries) {
// 	  const cr = entry.contentRect;
// 	  const data = {"width" : cr.width, "height" : cr.height, "id" : entry.target.id};
// 	  socket.emit('save', data);
// 	}
//   });
// document.addEventListener("drop", function(e) {
// 	const data = {"type" : "file", "x" : e.pageX, "y" : e.pageY, "height" : "300px", "width" : "300px", "data" : "asd"};
// 	console.log(data);	
// 	socket.emit('create', data);
// });