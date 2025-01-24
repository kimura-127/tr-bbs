import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'チョコットランド取引掲示板';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(to bottom right, #4F46E5, #7C3AED)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '8px solid white',
          borderRadius: '24px',
          padding: '40px 80px',
        }}
      >
        <h1
          style={{
            fontSize: '80px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          チョコットランド
          <br />
          取引掲示板
        </h1>
        <p
          style={{
            fontSize: '32px',
            color: 'white',
            textAlign: 'center',
            opacity: 0.8,
          }}
        >
          装備品取引・雑談・アバター取引
        </p>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
