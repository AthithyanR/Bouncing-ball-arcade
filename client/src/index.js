import { useEffect, useRef } from 'preact-compat'
import './style'

const height = 400
const width = 800
const radius = 20
const blockWidth = 20
const blockHeight = 100

export default function App() {

	const canvasRef = useRef(null)
	let x = Math.floor(width / 2)
	// 5 is the buffer padding
	let y = radius + 5
	let vx = 2
	let vy = 2
	let animationFrameId
	let ctx
	let leftPos
	let rightPos

	const drawCircle = () => {
		// draw the circle
		ctx.beginPath()
		ctx.strokeStyle = 'black'
		ctx.arc(x, y, radius, 0, Math.PI * 2)
		ctx.stroke()

		// conditions to move
		// if circle hits right or left reverse the direction its going
		if (radius + x > width || x - radius < 0) vx *= -1
		// if circle hits top or bottom reverse the direction its going
		if (radius + y > height || y - radius < 0) vy *= -1

		x += vx
		y += vy
	}
	
	const drawBlock = (x, y) => {
		ctx.beginPath()
		ctx.rect(x, y, blockWidth, blockHeight)
		ctx.fill()
	}
	
	const drawPlayerBlocks = () => {
		drawBlock(0, height / 2 - blockHeight / 2);
		drawBlock(width - blockWidth, height / 2 - blockHeight / 2);
	}

	const startBouncing = () => {
		// console.log(Date.now());
		animationFrameId = requestAnimationFrame(startBouncing)

		// clear prev draw
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		drawCircle()
		drawPlayerBlocks()
	}

	useEffect(() => {
		const canvasElement = canvasRef.current
		canvasElement.width = width
		canvasElement.height = height

		ctx = canvasElement.getContext('2d')
		startBouncing()
		

		return () => {
			cancelAnimationFrame(animationFrameId)
		}
	}, []);

	return (
		<canvas ref={canvasRef}></canvas>
	)
}
