import React from 'react'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 90,
  height = 24,
  color = '#2C3E50', // Ardósia #2C3E50
}) => {
  if (!data || data.length === 0) {
    return <span className="text-[10px] text-[#707980] italic">Sem dados</span>
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min === 0 ? 1 : max - min

  // Gerar coordenadas SVG
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 4) + 2
    // Invertido no eixo Y do SVG
    const y = height - 4 - ((val - min) / range) * (height - 8)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const pathD = `M ${points.join(' L ')}`

  // Ponto final para dar destaque
  const lastX = width - 2
  const lastY = height - 4 - ((data[data.length - 1] - min) / range) * (height - 8)

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible inline-block align-middle"
      aria-hidden="true"
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ponto sutil no último valor */}
      <circle cx={lastX} cy={lastY} r={2.5} fill={color} className="opacity-90" />
    </svg>
  )
}
