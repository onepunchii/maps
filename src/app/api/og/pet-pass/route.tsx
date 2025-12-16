
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Extract params
        const name = searchParams.get('name') || '반려동물';
        const breed = searchParams.get('breed') || '품종 미상';
        const regNum = searchParams.get('regNum') || '미등록';
        const photo = searchParams.get('photo');
        const bgImage = searchParams.get('bgImage'); // Optional background if passed

        // Font loading (optional - using system font for MVP, can add custom font fetching later)
        // const fontData = await fetch(new URL('../../../assets/fonts/Inter-Bold.ttf', import.meta.url)).then((res) => res.arrayBuffer());

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                    }}
                >
                    {/* Card Container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '380px',
                            height: '600px',
                            backgroundColor: '#1c1c1e',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '1px solid #333',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '20px',
                                backgroundColor: '#2C2C2E',
                                borderBottom: '1px solid #333',
                                width: '100%',
                            }}
                        >
                            <div style={{ color: '#a3df46', fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.1em' }}>PETUDY PASS</div>
                            {/* Simple badge if needed, skipping complex icons for MVP stability */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#e5e7eb',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}>
                                <span>인증 완료</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '40px 20px',
                                gap: '20px',
                                width: '100%',
                            }}
                        >
                            {/* Profile Image */}
                            <div style={{
                                display: 'flex',
                                position: 'relative',
                                width: '140px',
                                height: '140px',
                                borderRadius: '50%',
                                border: '4px solid #2C2C2E',
                                overflow: 'hidden',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            }}>
                                {photo ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={photo}
                                        alt="Profile"
                                        width="140"
                                        height="140"
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#333',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '60px',
                                    }}>
                                        🐶
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{name}</div>
                                <div style={{ fontSize: '14px', color: '#6b7280', letterSpacing: '0.1em', fontFamily: 'monospace' }}>{regNum}</div>
                            </div>

                            {/* Description Box */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                backgroundColor: 'rgba(44, 44, 46, 0.5)',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                marginTop: '10px',
                            }}>
                                <div style={{ fontSize: '16px', color: '#d1d5db', marginBottom: '4px' }}>{breed}</div>
                                <div style={{ fontSize: '12px', color: '#a3df46' }}>Petudy Official Member</div>
                            </div>
                        </div>

                        {/* Bottom Barcode */}
                        <div
                            style={{
                                marginTop: 'auto', // Pushes to bottom
                                padding: '20px 0',
                                backgroundColor: '#2C2C2E',
                                borderTop: '1px solid #333',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <div style={{
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                letterSpacing: '0.5em',
                                fontFamily: 'monospace',
                            }}>
                                ||| || ||| || |||
                            </div>
                        </div>

                        {/* Overlay Glow (Simulated) */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at 50% 0%, rgba(163, 223, 70, 0.1), transparent 70%)',
                            pointerEvents: 'none',
                        }} />
                    </div>
                </div>
            ),
            {
                width: 420,
                height: 640,
                // fonts: ... // skipping custom fonts for now to ensure speed
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
