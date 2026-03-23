import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const LOGS_FILE = path.join(process.cwd(), 'data', 'logs.json');

export async function GET() {
  try {
    const data = await fs.readFile(LOGS_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json([], { status: 200 }); // Return empty if file doesn't exist yet
  }
}

export async function POST(request: Request) {
  try {
    const newLog = await request.json();
    let logs = [];
    
    try {
      const data = await fs.readFile(LOGS_FILE, 'utf8');
      logs = JSON.parse(data);
    } catch (e) {
      // File may not exist or be empty
    }

    logs.unshift(newLog); // Add to beginning
    
    // Limit to last 50 logs for performance
    const limitedLogs = logs.slice(0, 50);
    
    await fs.writeFile(LOGS_FILE, JSON.stringify(limitedLogs, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to save log' }, { status: 500 });
  }
}
