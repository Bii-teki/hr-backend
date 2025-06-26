const transporter = require('../config/email');
const logger = require('../utils/logger');

const sendEmail = async (options) => {
  const message = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html, // You can add HTML version too
  };

  try {
    await transporter.sendMail(message);
    logger.info(`Email sent to ${options.email}`);
  } catch (error) {
    logger.error(`Error sending email to ${options.email}: ${error.message}`);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;