
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Extract params
        const name = searchParams.get('name') || '이름';
        const breed = searchParams.get('breed') || '품종 미상';
        const regNum = searchParams.get('regNum') || '미등록';
        const photo = searchParams.get('photo');

        // New params
        const birth = searchParams.get('birth');
        const gender = searchParams.get('gender') || 'unknown';
        const neuter = searchParams.get('neuter');
        const color = searchParams.get('color') || '모색 미상';
        // const species = searchParams.get('species');

        // Font loading - Noto Sans KR for Korean support (Bold only for efficiency)
        let fontData: ArrayBuffer | null = null;
        try {
            const fontResponse = await fetch(new URL('https://github.com/google/fonts/raw/main/ofl/notosanskr/NotoSansKR-Bold.ttf'));
            if (fontResponse.ok) {
                fontData = await fontResponse.arrayBuffer();
            } else {
                console.error("Font fetch failed:", fontResponse.statusText);
            }
        } catch (fontError) {
            console.error("Font load error:", fontError);
        }

        // Process Data
        const genderText = gender === 'male' ? '수컷 (Male)' : gender === 'female' ? '암컷 (Female)' : '성별 미상';
        const neuterText = neuter === 'true' ? '완료 (Yes)' : neuter === 'false' ? '미완료 (No)' : '해당 없음';

        // Date formatting
        let birthText = '날짜 미상';
        if (birth) {
            const date = new Date(birth);
            if (!isNaN(date.getTime())) {
                birthText = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
            }
        }

        const imageOptions: any = {
            width: 420,
            height: 640,
        };

        if (fontData) {
            imageOptions.fonts = [
                {
                    name: 'NotoSansKR',
                    data: fontData,
                    style: 'normal',
                    weight: 700,
                }
            ];
        }

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
                        fontFamily: fontData ? '"NotoSansKR"' : 'sans-serif',
                    }}
                >
                    {/* Card Container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '380px',
                            height: '600px',
                            backgroundColor: '#1E1E20',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '1px solid #333',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Background Watermark Pattern */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            flexWrap: 'wrap',
                            opacity: 0.03,
                            transform: 'rotate(-15deg) scale(1.5)',
                            zIndex: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '40px',
                        }}>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} style={{ fontSize: '40px', fontWeight: '900', color: 'white' }}>PETUDY</div>
                            ))}
                        </div>

                        {/* Content Layer */}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '24px', zIndex: 10, position: 'relative' }}>

                            {/* Header: Badge & QR */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{
                                    padding: '4px 12px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(163, 223, 70, 0.1)',
                                    border: '1px solid rgba(163, 223, 70, 0.3)',
                                    color: '#A3DF46',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                }}>
                                    소유자
                                </div>
                                {/* Dummy QR Code */}
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'white',
                                    borderRadius: '4px',
                                    padding: '2px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignContent: 'flex-start',
                                }}>
                                    {/* Simple pixel pattern simulation */}
                                    <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(black 30%, transparent 31%)', backgroundSize: '8px 8px' }}></div>
                                </div>
                            </div>

                            {/* Identity Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <div style={{ fontSize: '32px', fontWeight: '900', color: 'white' }}>{name}</div>
                                    {/* Icon/Sticker */}
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #ccc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {photo ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={photo} width="32" height="32" alt="icon" style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ fontSize: '16px' }}>🐶</div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                    등록번호 ({regNum === '미등록' ? '종합 미등록' : regNum})
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ width: '100%', height: '1px', backgroundColor: '#333', marginBottom: '20px' }}></div>

                            {/* Description Box */}
                            <div style={{
                                backgroundColor: '#252527',
                                borderRadius: '12px',
                                padding: '16px',
                                border: '1px solid #333',
                                marginBottom: '20px',
                            }}>
                                <div style={{ fontSize: '12px', color: '#d1d5db', lineHeight: '1.5' }}>
                                    &quot;{breed} 믹스일 수도 있고 순종일 수도 있습니다. 사랑스러운 {name}는(은) 세상에서 가장 특별한 반려동물입니다!&quot;
                                </div>
                            </div>

                            {/* Info List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                                {[
                                    { label: '생일', value: birthText },
                                    { label: '품종', value: breed },
                                    { label: '색상', value: color },
                                    { label: '성별', value: genderText },
                                    { label: '중성화', value: neuterText },
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderBottom: '1px solid #333', paddingBottom: '4px' }}>
                                        <div style={{ color: '#6b7280' }}>{item.label}</div>
                                        <div style={{ color: 'white', fontWeight: 'bold' }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats Section */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                backgroundColor: '#18181a',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '1px solid #2a2a2c'
                            }}>
                                {[
                                    { label: '크기', val: 3 },
                                    { label: '털빠짐', val: 4 },
                                    { label: '친화력', val: 5 },
                                    { label: '학습력', val: 3 },
                                    { label: '실내/외', val: 5 },
                                ].map((stat, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                        <div style={{ color: '#888', fontSize: '10px', width: '40px' }}>{stat.label}</div>
                                        <div style={{ flex: 1, height: '6px', backgroundColor: '#333', borderRadius: '3px', position: 'relative', overflow: 'hidden', display: 'flex' }}>
                                            {/* Track Segments */}
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} style={{
                                                    flex: 1,
                                                    height: '100%',
                                                    borderRight: '1px solid #18181a',
                                                    backgroundColor: i <= stat.val ? '#A3DF46' : 'transparent'
                                                }}></div>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#555' }}>
                                            {/* Icon Placeholder */}
                                            ✦
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            ),
            imageOptions,
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
