import { useEffect, useRef } from 'preact-compat'
import './style'

const height = 400
const width = 800
const radius = 20
const blockWidth = 20
const blockHeight = 150

export default function App() {

	const canvasRef = useRef(null)
	const leftCountRef = useRef(null)
	const rightCountRef = useRef(null)

	let x = Math.floor(width / 2)
	// 5 is the buffer padding
	let y = radius + 5
	let vx = 2
	let vy = 2
	let animationFrameId
	let ctx
	let leftPos = (height / 2) - (blockHeight / 2)
	let rightPos = (height / 2) - (blockHeight / 2)
	let leftCount = 0
	let rightCount = 0

	const printScore = () => {
		leftCountRef.current.textContent = leftCount
		rightCountRef.current.textContent = rightCount

		if (leftCount === 3) {
			cancelAnimationFrame(animationFrameId)
			setTimeout(() => alert('Match over player right wins!!!'), 0)
		}
		if (rightCount === 3) {
			cancelAnimationFrame(animationFrameId)
			setTimeout(() => alert('Match over player left wins!!!'), 0)
		}
	}

	const drawCircle = () => {
		// draw the circle
		ctx.beginPath()
		ctx.strokeStyle = 'black'
		ctx.arc(x, y, radius, 0, Math.PI * 2)
		ctx.stroke()

		const touchLeft = x - radius < 0
		const touchRight = radius + x > width
		const touchLeftBlock = (x <= (radius + blockWidth) && (leftPos <= y && y <= leftPos + blockHeight))
		const touchRightBlock = (x >= (width - radius - blockWidth) && (rightPos <= y && y <= rightPos + blockHeight))

		if (
			touchRight ||
			touchLeft ||
			touchLeftBlock ||
			touchRightBlock
		)
		{
			if (touchLeft) {
				rightCount++
			}
			if (touchRight) {
				leftCount++
			}
			vx *= -1
		}

		const touchTop = y - radius < 0
		const touchBottom = radius + y > height
		if (touchBottom || touchTop) {
			vy *= -1
		}


		x += vx
		y += vy
	}

	const drawBlock = (x, y) => {
		ctx.beginPath()
		ctx.rect(x, y, blockWidth, blockHeight)
		ctx.fill()
	}

	const drawPlayerBlocks = () => {
		drawBlock(0, leftPos);
		drawBlock(width - blockWidth, rightPos);
	}

	const startBouncing = () => {
		animationFrameId = requestAnimationFrame(startBouncing)

		// clear prev draw
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		drawCircle()
		drawPlayerBlocks()
		printScore()
	}

	const keyStorkeListener = (e) => {
		e.stopPropagation()
		const { key: pressedKey } = e

		switch (pressedKey) {
			case ('w'): {
				if (leftPos > 0) leftPos -= 20
				break;
			}
			case ('s'): {
				if (leftPos < (height - blockHeight)) leftPos += 20
				break;
			}
			case ('ArrowUp'): {
				if (rightPos > 0) rightPos -= 20
				break;
			}
			case ('ArrowDown'): {
				if (rightPos < (height - blockHeight)) rightPos += 20
				break;
			}
		}
	}

	const attachListeners = () => {
		window.addEventListener('keydown', keyStorkeListener)
	}

	const startMatch = () => {
		const canvasElement = canvasRef.current
		canvasElement.width = width
		canvasElement.height = height
		ctx = canvasElement.getContext('2d')

		startBouncing()
		attachListeners()
	}

	useEffect(() => {
		startMatch()

		return () => {
			cancelAnimationFrame(animationFrameId)
		}
	}, []);

	return (
		<div>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			<p style={{ fontSize: 24 }}>Left: <p ref={leftCountRef}></p></p>
			<p style={{ fontSize: 24 }}>Right: <p ref={rightCountRef}></p></p>
			</div>
		<canvas ref={canvasRef}></canvas>
		</div>

	)
}
