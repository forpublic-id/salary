import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Salary ForPublic.id - Transparansi Gaji PNS Indonesia'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'white',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              fontWeight: 'bold',
              color: '#dc2626',
              marginRight: 24,
            }}
          >
            $
          </div>
          <div
            style={{
              color: 'white',
              fontSize: 64,
              fontWeight: 'bold',
            }}
          >
            Salary ForPublic.id
          </div>
        </div>
        
        <div
          style={{
            color: 'white',
            fontSize: 32,
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.2,
            opacity: 0.9,
          }}
        >
          Transparansi Gaji PNS & Pejabat Publik Indonesia
        </div>
        
        <div
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 24,
            marginTop: 30,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          💰 Calculator • 🔍 Browse • 📊 Analytics • 👨‍💼 Officials
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}