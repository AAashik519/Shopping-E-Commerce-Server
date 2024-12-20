const verifyEmailTemplate = ({ name, url }) => {
  return `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #f7f7f7; padding: 20px;">
            <tr>
                <td align="center" style="padding: 20px 0;">
               
                    <h2 style="color: #4CAF50;">Welcome to Binkeyit, ${name}!</h2>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px 30px;">
                    <p>Thank you for signing up with us! To get started, please confirm your email address by clicking the button below:</p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px;">
                    <a href="${url}" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; background-color: #4CAF50; border-radius: 5px; text-decoration: none;">
                        Verify Email
                    </a>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px 30px;">
                    <p>If you didn’t create this account, please ignore this email. The link will expire in 24 hours for your security.</p>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px 0; font-size: 14px; color: #999;">
                    <p>Thank you for choosing Binkeyit! We’re excited to have you onboard.</p>
                    <p>&copy; 2024 Binkeyit. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </div>
`;
};

export default verifyEmailTemplate;
