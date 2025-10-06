import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Galaxy.ai <onboarding@galaxy.ai>',
      to: [email],
      subject: 'Welcome to Galaxy.ai!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10a37f;">Welcome to Galaxy.ai!</h1>
          <p>Hi ${name},</p>
          <p>Welcome to your new ChatGPT clone! You can now start chatting with AI and explore all the features.</p>
          <p>Happy chatting!</p>
          <p>Best regards,<br>The Galaxy.ai Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Resend error:', error);
    throw error;
  }
}

export async function sendUsageReport(email: string, usage: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Galaxy.ai <reports@galaxy.ai>',
      to: [email],
      subject: 'Your Galaxy.ai Usage Report',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10a37f;">Your Usage Report</h1>
          <p>Here's your weekly usage summary:</p>
          <ul>
            <li>Messages sent: ${usage.messages || 0}</li>
            <li>Tokens used: ${usage.tokens || 0}</li>
            <li>Conversations: ${usage.conversations || 0}</li>
          </ul>
          <p>Keep exploring with Galaxy.ai!</p>
        </div>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Resend error:', error);
    throw error;
  }
}

export { resend };
