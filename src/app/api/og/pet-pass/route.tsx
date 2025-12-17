import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
    return NextResponse.json(
        { message: "This API route has been deprecated in favor of client-side generation." },
        { status: 410 } // Gone
    );
}
