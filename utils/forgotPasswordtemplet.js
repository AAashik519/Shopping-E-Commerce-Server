const forgotPasswordTemplate = ({ name, otp }) => {
    return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #f7f7f7; padding: 20px;">
              <tr>
                  <td align="center" style="padding: 20px 0;">
                      <h2 style="color: #4CAF50;">Password Reset Request</h2>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 10px 30px;">
                      <p>Hello ${name},</p>
                      <p>You requested a password reset. Use the following OTP code to reset your password:</p>
                  </td>
              </tr>
              <tr>
                  <td align="center" style="padding: 20px;">
                      <div style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; color: #4CAF50; background-color: #e0f7e0; border-radius: 5px;">
                          ${otp}
                      </div>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 10px 30px;">
                      <p>This OTP is valid for the next 1 hour. If you did not request a password reset, please ignore this email.</p>
                  </td>
              </tr>
              <tr>
                  <td align="center" style="padding: 20px 0; font-size: 14px; color: #999;">
                      <p>Thank you for choosing Binkeyit! We're here to help if you need further assistance.</p>
                      <p>&copy; 2024 Binkeyit. All rights reserved.</p>
                  </td>
              </tr>
          </table>
      </div>
  `;
};

export default forgotPasswordTemplate;
