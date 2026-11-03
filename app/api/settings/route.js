import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settingsStore';
import { validateSettings } from '@/lib/settingsRules';

export async function GET() {
  try {
    const data = await getSettings();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/settings:', error);
    return NextResponse.json(
      { error: 'Failed in retrieving settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  let newSettings;

  try {
    newSettings = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON in request' },
      { status: 400 }
    );
  }

  const errors = validateSettings(newSettings);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: 'Validation failed', details: errors },
      { status: 400 }
    );
  }

  try {
    const saved = await saveSettings(newSettings);
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}