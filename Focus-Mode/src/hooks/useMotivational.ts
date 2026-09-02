import { useState } from 'react'
import donutImg from '../assets/donut-stop-trying.png'
import butterflyImg from '../assets/butterfly.png'
import keepGrowingImg from '../assets/keep-growing.png'
import youCanDoItImg from '../assets/you-can-do-it.png'

const MOTIVATIONAL_IMAGES = [donutImg, butterflyImg, keepGrowingImg, youCanDoItImg]

export function useMotivational() {
  const [showDonut, setShowDonut] = useState(false)
  const [motivationalImg, setMotivationalImg] = useState(donutImg)
  const [donutFading, setDonutFading] = useState(false)

  function showMotivational() {
    // Pick random image excluding the last one
    const choices = MOTIVATIONAL_IMAGES.filter(img => img !== motivationalImg)
    const picked = choices[Math.floor(Math.random() * choices.length)]
    setMotivationalImg(picked)
    setShowDonut(true)
    setTimeout(() => setDonutFading(true), 3300)
    setTimeout(() => { setShowDonut(false); setDonutFading(false) }, 4000)
  }

  return {
    showDonut,
    setShowDonut,
    motivationalImg,
    setMotivationalImg,
    donutFading,
    setDonutFading,
    showMotivational,
    MOTIVATIONAL_IMAGES,
  }
}
