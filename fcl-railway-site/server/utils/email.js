const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send order confirmation email
async function sendOrderConfirmationEmail(order) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: order.user?.email || 'customer@example.com',
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Confirmation</h2>
          <p>Thank you for your order!</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Total:</strong> $${(order.total / 100).toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            ${order.uniqueCode ? `<p><strong>Unique Code:</strong> ${order.uniqueCode}</p>` : ''}
          </div>
          
          <p>We'll send you another email when your order ships.</p>
          
          <p>Best regards,<br>Frtl Creative Labs Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent for order ${order.orderNumber}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

// Send contact form email
async function sendContactFormEmail(contactData) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 3px;">${contactData.message}</p>
          </div>
          
          <p>Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact form email sent from ${contactData.email}`);
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
}

// Send newsletter subscription confirmation
async function sendNewsletterConfirmation(email) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Welcome to Frtl Creative Labs Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to our Newsletter!</h2>
          <p>Thank you for subscribing to the Frtl Creative Labs newsletter.</p>
          
          <p>You'll receive updates about:</p>
          <ul>
            <li>New tech initiatives</li>
            <li>Product launches</li>
            <li>Industry insights</li>
            <li>Special offers</li>
          </ul>
          
          <p>Best regards,<br>Frtl Creative Labs Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Newsletter confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending newsletter confirmation email:', error);
    throw error;
  }
}

module.exports = {
  sendOrderConfirmationEmail,
  sendContactFormEmail,
  sendNewsletterConfirmation
};
