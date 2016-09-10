var net = require('net')
var socket = require('socket.io-client')('http://localhost:1234')

function createArray(length) {
	var arr = new Array(length || 0), i = length

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1)
       	while (i--) arr[length - 1 - i] = createArray.apply(this, args)
    }

   	return arr
}

socket.on('connect', () => {
	console.log('connection')

	socket.emit('message', { move: "asdf" })
})

window.onload = function () {
	// var client = new net.Socket()
	// client.connect(1234, '127.0.0.1', () => {
	// 	console.log('Connected')
	// 	client.write("Jennie's boobs are awesome at go")
	// })

	// client.on('data', (data) => {
	// 	console.log('Received: ' + data)
	// })

	// client.on('close', () => {
	// 	console.log('Connection closed')
	// })

	var file = document.getElementById('board')
	var svg = file.contentDocument
	var display = svg.getElementsByTagName('svg')[0]

	var board = createArray(19, 19)
	var pt = display.createSVGPoint()
	var black = false

	function cursourPoint(evt) {
		pt.x = evt.clientX
		pt.y = evt.clientY
		return pt.matrixTransform(display.getScreenCTM().inverse())
	}

	function placeStone(location, color) {
		x = Math.round((location.x - 50) / 100)
		y = Math.round((location.y - 50) / 100)
		//console.log(x, y)

		if (!(board[y][x] === 'black') && !(board[y][x] === 'white')) {
			board[y][x] = color

			var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
			circle.setAttribute('cx', x * 100 + 50)
			circle.setAttribute('cy', y * 100 + 50)
			circle.setAttribute('r', '40')
			circle.setAttribute('fill', color)
			display.appendChild(circle)

			return true
		}

		else
			return false
	}

	display.addEventListener('click', (evt) => {
		var loc = cursourPoint(evt)

		if (black) {
			if (placeStone(loc, 'black'))
				black = !black
		}

		else {
			if (placeStone(loc, 'white'))
				black = !black
		}
	}, false)
}
