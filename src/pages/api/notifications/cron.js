import { NextResponse } from 'next/server';
import api from '../../../services/api';

export async function GET() {
  try {
    // Fetch notifications from backend
    const response = await api.get('/notifications/');
    const notifications = response.data;
    
    // Process notifications (if needed)
    // For example, you can update read status or perform other operations
    
    return NextResponse.json({
      success: true,
      message: 'Notifications processed successfully',
      notifications
    });
  } catch (error) {
    console.error('Error processing notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process notifications' },
      { status: 500 }
    );
  }
}

// Configure Vercel cron job
export const runtime = 'edge';
export const config = {
  runtime: 'edge',
  regions: ['ind1'], // Use Indian region
};
