const passwordResetSuccessTemplate = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      
      <h2 style="color: #2c3e50;">Password Updated Successfully</h2>
      
      <p>Hi ${name || "User"},</p>
      
      <p>Your password has been <strong>successfully updated</strong>.</p>

         <p style="color: #555;">
        Password changed on: <strong>${new Date().toLocaleString()}</strong>
      </p>
      
      <p>If you did not perform this action, please contact support immediately.</p>
      
      <br/>
      
      <p>Thanks,<br/>Your App Team</p>

      <hr style="margin-top:20px;" />
      <small style="color:gray;">
        This is an automated message. Please do not reply.
      </small>
    </div>
  `;
};

export default passwordResetSuccessTemplate;