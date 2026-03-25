'use client'

import { useState } from 'react'
import { X, Maximize2 } from 'lucide-react'
import { getDiagramSvg } from '@/lib/diagrams'
import { cn } from '@/lib/utils'
import type { DiagramType, DiagramConfig } from '@/types/plan'

interface DrillDiagramProps {
  type: DiagramType
  config: DiagramConfig
  className?: string
  expandable?: boolean
}

export function DrillDiagram({ type, config, className, expandable = false }: DrillDiagramProps) {
  const [expanded, setExpanded] = useState(false)

  if (type === 'none') return null

  const svg = getDiagramSvg(type, config)

  return (
    <>
      <div
        className={cn(className, expandable && 'cursor-zoom-in relative group')}
        onClick={expandable ? () => setExpanded(true) : undefined}
        dangerouslySetInnerHTML={{ __html: svg }}
        aria-label={`Court diagram: ${config.formation}`}
        role="img"
      />

      {expandable && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/40 rounded p-1">
            <Maximize2 size={11} className="text-white" />
          </div>
        </div>
      )}

      {expanded && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
          onClick={() => setExpanded(false)}
        >
          <div
            className="bg-white rounded-2xl p-4 w-full max-w-sm relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Close diagram"
            >
              <X size={18} />
            </button>
            <div dangerouslySetInnerHTML={{ __html: svg }} />
            {config.formation && (
              <p className="text-xs text-gray-500 text-center mt-2">{config.formation}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
