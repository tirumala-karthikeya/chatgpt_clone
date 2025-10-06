'use client'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  label?: string
  description?: string
  unit?: string
}

export default function Slider({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  label, 
  description, 
  unit = '' 
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {label && (
            <label className="text-white font-medium text-sm">
              {label}
            </label>
          )}
          {description && (
            <p className="text-gray-400 text-xs mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="text-white text-sm font-medium">
          {value}{unit}
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #10a37f 0%, #10a37f ${percentage}%, #374151 ${percentage}%, #374151 100%)`
          }}
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #10a37f;
            cursor: pointer;
            border: 2px solid #171717;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #10a37f;
            cursor: pointer;
            border: 2px solid #171717;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>
    </div>
  )
}
