"use strict"
function drag_n_drop (elem, board_name)
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
					update({"action" : "move", "data" : {"id" : elem.id, "x" : elem.style.left, "y" : elem.style.top}});
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


function update(data)
{
	socket.emit('update', data);
}

function render(action, data)
{
	switch (action)
	{
		case "move":
			const elem = document.getElementById(data["id"]);
			elem.style.left = data["x"];
			elem.style.top = data["y"];
			break;
		case "create":
			const newDiv = document.createElement("div");
			const newInput = document.createElement("input");
			document.body.appendChild(newDiv);
			newDiv.style.position = 'absolute';
			newDiv.style.left = data["x"];
			newDiv.style.top = data["y"];
			newDiv.className = "divasd";
			newDiv.id = data["id"];
			newInput.className = "inputField";
			drag_n_drop(newDiv, board_name);
			newDiv.append(newInput);
	}
};


let socket = new io();
socket.on('connect', function() {
	console.log("Connected server");
	//socket.emit('my_event', {data : '1'});
});
socket.on('update', function(data) {
	render(data["action"], data["data"]);
	console.log(data);
});

document.addEventListener('dblclick', function (e) {
	data = { "action" : "create", "data" : { "x" : e.pageX, "y" : e.pageY }};
	update(data);
});
