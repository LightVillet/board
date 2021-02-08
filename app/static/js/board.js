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
		console.log(elem.className, "out");
		elem.onmousedown = null;
	}
}
function createElem(e)
{
	const newDiv = document.createElement("div");
	const newInput = document.createElement("input");
	document.body.appendChild(newDiv);
	newDiv.style.position = 'absolute';
	newDiv.style.left = e.pageX;
	newDiv.style.top = e.pageY;
	newDiv.className = "divasd";
	newInput.className = "inputField";
	drag_n_drop(newDiv);
	newDiv.append(newInput);
	const empty = document.createElement("h1");
	const text = document.createTextNode("Hello"); 
	empty.append(text);
	//newDiv.append(empty);

}
document.addEventListener('dblclick', function (e) {
  createElem(e);
});
let button_test = document.body.getElementsByClassName("button_test")[0];
let button_test_2 = document.body.getElementsByClassName("button_test")[1];
drag_n_drop(button_test);
drag_n_drop(button_test_2);


