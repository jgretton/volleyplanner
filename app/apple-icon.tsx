import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0C1520',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '40px',
        }}
      >
        {/* Geometric V — scaled up from the 32x32 SVG (×5.625) */}
        <svg width="124" height="113" viewBox="0 0 32 32">
          <polygon points="5,7 11,7 16,22 21,7 27,7 16,27" fill="#FF5820" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
