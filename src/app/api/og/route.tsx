import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1e40af 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'white',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
            }}
          >
            ✈
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            AirMilesCalc
          </div>
        </div>
        <div
          style={{
            fontSize: '28px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '40px',
          }}
        >
          Flight Distance Calculator
        </div>
        <div
          style={{
            display: 'flex',
            gap: '48px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, color: 'white' }}>3,000+</div>
            <div>Airports</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, color: 'white' }}>66,000+</div>
            <div>Routes</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, color: 'white' }}>Vincenty</div>
            <div>Precision</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
