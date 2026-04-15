export const resendOtpTemplate = (name, otp) => {
  return `<div>
    <p>Hello ${name},</p>
    <p>Your OTP has been resent: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
  </div>`;
};