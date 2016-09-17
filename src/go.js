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
})

window.onload = function () {
	var file = document.getElementById('board')
	var svg = file.contentDocument
	var display = svg.getElementsByTagName('svg')[0]

	var board = createArray(19, 19)
	var pt = display.createSVGPoint()
	var black = true

	function cursourPoint(evt) {
		pt.x = evt.clientX
		pt.y = evt.clientY
		return pt.matrixTransform(display.getScreenCTM().inverse())
	}

	function placeStone(location, color) {
		x = Math.round((location.x - 50) / 100)
		y = Math.round((location.y - 50) / 100)
		console.log('x: ' + x + ', y: ' + y)

		if (!(board[y][x] === 'b') && !(board[y][x] === 'white')) {
			socket.emit('attemptMove', { black: black, x: x, y: y })
		}
	}

	function drawStone(x, y, color) {
		var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
		circle.setAttribute('cx', x * 100 + 50)
		circle.setAttribute('cy', y * 100 + 50)
		circle.setAttribute('r', '40')
		
		if (color === 'b') {
			circle.setAttribute('fill', 'black')
		}

		if (color === 'w') {
			circle.setAttribute('fill', 'white')
		}

		display.appendChild(circle)
	}

	function refreshBoard(data) {
		for (var y = 0; y < 19; y++) {
			for (var x = 0; x < 19; x++) {
				if (data[y][x] === 'b' || data[y][x] === 'w') {
					drawStone(x, y, data[y][x])
					board[y][x] = data[y][x]
				}
			}
		}
	}

	socket.on('board', (data, color) => {
		black = color
		refreshBoard(data)
	})

	socket.on('move', (move) => {
			if (move.black) {
                board[move.y][move.x] = 'b'
                black = false
            }

            else {
                board[move.y][move.x] = 'w'
                black = true
            }

			drawStone(move.x, move.y, board[move.y][move.x])
	})

	display.addEventListener('click', (evt) => {
		var loc = cursourPoint(evt)

		if (black) {
			placeStone(loc, 'b')
		}

		else {
			placeStone(loc, 'w')
		}
	}, false)
}
