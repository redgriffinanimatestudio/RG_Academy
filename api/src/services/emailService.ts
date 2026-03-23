import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"Red Griffin Academy" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  // Predefined email templates
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <h1>Welcome to Red Griffin Academy!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for joining our platform. We're excited to have you here!</p>
      <p>Start exploring courses and connecting with professionals.</p>
      <br>
      <p>Best regards,<br>The Red Griffin Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to Red Griffin Academy',
      html,
    });
  }

  async sendEnrollmentConfirmation(email: string, courseTitle: string): Promise<void> {
    const html = `
      <h1>Enrollment Confirmed!</h1>
      <p>You have successfully enrolled in: <strong>${courseTitle}</strong></p>
      <p>Start learning at your own pace.</p>
      <br>
      <p>Happy learning!<br>The Red Griffin Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: `Enrolled in ${courseTitle}`,
      html,
    });
  }

  async sendContractNotification(email: string, projectTitle: string, type: 'created' | 'updated' | 'completed'): Promise<void> {
    const messages = {
      created: `A new contract has been created for project: ${projectTitle}`,
      updated: `Contract updated for project: ${projectTitle}`,
      completed: `Contract completed for project: ${projectTitle}`
    };

    const html = `
      <h1>Contract Update</h1>
      <p>${messages[type]}</p>
      <p>Please check your dashboard for details.</p>
      <br>
      <p>Best regards,<br>The Red Griffin Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Contract Notification',
      html,
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <h1>Password Reset</h1>
      <p>You requested a password reset for your Red Griffin Academy account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The Red Griffin Team</p>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html,
    });
  }
}

export const emailService = new EmailService();
export default emailService;