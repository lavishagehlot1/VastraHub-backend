export const forgotPasswordTemplate = (name, link) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Password Reset</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Password Reset Request</h2>
    <p>Hello ${name},</p>
    <p>
      Click on this link to reset your password:
      <a href="${link.startsWith('http') ? link : 'https://' + link}" target="_blank">
        ${link.startsWith('http') ? link : 'https://' + link}
      </a>
    </p>
    <p>This link is valid for 10 minutes.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
  </body>
  </html>
  `;
};