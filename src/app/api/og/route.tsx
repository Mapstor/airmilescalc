import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Tell Next.js this route is dynamic — it reads the URL and the filesystem.
export const dynamic = 'force-dynamic';

// Lazily-resolved, then-cached promises for the bundled font files in public/.
// Self-hosting these (rather than letting Satori fetch its default Inter weight
// from a Vercel CDN) makes /api/og work in any network environment, including
// egress-restricted dev containers and air-gapped deploys.
let fontRegularPromise: Promise<Buffer> | null = null;
let fontBoldPromise: Promise<Buffer> | null = null;

function loadFont(file: string): Promise<Buffer> {
  return readFile(path.join(process.cwd(), 'public', 'fonts', file));
}

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

export async function GET(request: Request) {
  if (!fontRegularPromise) fontRegularPromise = loadFont('Geist-Regular.ttf');
  if (!fontBoldPromise) fontBoldPromise = loadFont('Geist-Bold.ttf');
  const [fontRegular, fontBold] = await Promise.all([fontRegularPromise, fontBoldPromise]);

  const { searchParams } = new URL(request.url);
  const titleRaw = searchParams.get('title') || '';
  const subtitleRaw = searchParams.get('subtitle') || '';
  const categoryRaw = searchParams.get('category') || '';

  const title = titleRaw ? clip(titleRaw, 80) : '';
  const subtitle = subtitleRaw ? clip(subtitleRaw, 140) : '';
  const category = categoryRaw ? clip(categoryRaw, 24).toUpperCase() : '';

  const hasCustom = title.length > 0;

  // Per-category gradient so social timelines visually distinguish content
  // clusters at a glance. All gradients land at the same visual weight so
  // the brand stays recognisable.
  const gradients: Record<string, string> = {
    METHODOLOGY: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1e40af 100%)', // deep navy → royal blue
    LEARN: 'linear-gradient(135deg, #0c4a6e 0%, #0891b2 50%, #0e7490 100%)',       // ocean teal
    AIRPORT: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #c2410c 100%)',    // amber sunset
    ROUTE: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #15803d 100%)',      // forest jet-stream
    COUNTRY: 'linear-gradient(135deg, #581c87 0%, #9333ea 50%, #7e22ce 100%)',    // royal purple
    POLICY: 'linear-gradient(135deg, #44403c 0%, #57534e 50%, #44403c 100%)',     // graphite (privacy / terms)
    CONTACT: 'linear-gradient(135deg, #134e4a 0%, #14b8a6 50%, #0f766e 100%)',    // soft teal
    ABOUT: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #334155 100%)',      // slate
    AIRPORTS: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #c2410c 100%)',   // amber (matches single Airport)
  };
  const background = gradients[category] ?? 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1e40af 100%)';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background,
          fontFamily: 'Geist',
          padding: '64px',
          color: 'white',
        }}
      >
        {/* Header — brand mark + category */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: hasCustom ? '40px' : '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'white',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#0B2447" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                letterSpacing: '-0.5px',
              }}
            >
              AirMilesCalc
            </div>
          </div>
          {category ? (
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '2px',
                background: 'rgba(255,255,255,0.18)',
                padding: '8px 16px',
                borderRadius: '999px',
              }}
            >
              {category}
            </div>
          ) : null}
        </div>

        {/* Body */}
        {hasCustom ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: title.length > 50 ? '56px' : '72px',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-1.5px',
                marginBottom: subtitle ? '28px' : '0',
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  fontSize: '24px',
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.35,
                  maxWidth: '900px',
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 700,
                letterSpacing: '-1px',
                marginBottom: '20px',
              }}
            >
              Flight Distance Calculator
            </div>
            <div
              style={{
                fontSize: '24px',
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '40px',
              }}
            >
              Geodesic distance · Vincenty + WGS-84 · DEFRA 2024
            </div>
            <div
              style={{
                display: 'flex',
                gap: '48px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '18px',
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
                <div style={{ fontSize: '36px', fontWeight: 700, color: 'white' }}>0.5 mm</div>
                <div>Precision</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer brand strip — only when custom title (the default layout already has its own branding) */}
        {hasCustom ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '20px',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <div>airmilescalc.com</div>
            <div>Vincenty · WGS-84 · DEFRA 2024</div>
          </div>
        ) : null}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Geist', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Geist', data: fontBold, weight: 700, style: 'normal' },
      ],
      // Cache the image aggressively — title / subtitle / category fully
      // determine the output, so any social-bot or human request for the same
      // URL can safely reuse the same PNG. One year max-age + immutable hints
      // CDN / browser caches; s-maxage targets the Vercel edge cache.
      headers: {
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    }
  );
}
