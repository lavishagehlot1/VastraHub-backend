export const registerTemplate = (name, otp) => {
  return `<div>
    <p>Welcome ${name}!</p>
    <p>Your OTP for registration is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
  </div>`;
};