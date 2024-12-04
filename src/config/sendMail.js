import nodemailer from "nodemailer";

export default (to, subject, text) => {
  // Cấu hình transporter cho Gmail
  let configMail = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "duongbinhminh10032004@gmail.com",
      pass: "fsrtyhtbginctawn", // Lưu ý: Không nên lưu trực tiếp mật khẩu trong mã nguồn
    },
  });

  // Nội dung HTML của email
  const emailContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Code Email</title>
      <link rel="stylesheet" href="styles.css">
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }

          .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #f0f0f0;
              border-radius: 8px;
              padding-top: 40px;
              padding-bottom: 40px;
          }

          .header {
              text-align: center;
          }

          .logo {
              width: 70px;
              height: 70px;
              border-radius: 50%;
          }

          .title {
              font-size: 24px;
              color: #333;
              margin-top: 10px;
          }

          .content {
              margin-top: 20px;
              text-align: center;
          }

          .description {
              font-size: 18px;
              color: #555;
          }

          .code {
              font-size: 32px;
              font-weight: bold;
              color: #333;
              background-color: #f7f7f7;
              padding: 10px;
              border-radius: 8px;
              margin-top: 10px;
          }

          .warning {
              font-size: 14px;
              color: #f44336;
              margin-top: 20px;
          }

          .info {
              font-size: 14px;
              color: #555;
              margin-top: 5px;
          }

          .footer {
              margin-top: 40px;
              text-align: center;
          }

          .footer-logo {
              margin-bottom: 20px;
          }

          .footer-img {
              width: 80px;
              margin: 0 10px;
          }

          .social-media {
              margin-top: 20px;
          }

          .social-icon {
              text-decoration: none;
              color: #555;
              margin: 0 10px;
          }

          .footer-note {
              font-size: 12px;
              color: #777;
              margin-top: 20px;
          }

          .footer-note a {
              text-decoration: none;
              color: #777;
              margin: 0 5px;
          }

          .footer-note a:hover {
              color: #333;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZmg4fA7ZwYx7fB7O3Em3UJzIwJoQwDbDWQw&s"
                  alt="Logo" class="logo">
              <h2 class="title">Phone Store</h2>
          </div>

          <div class="content">
              <p class="description">Mã khuyến mãi:</p>
              <div class="code">
                  <span>${text}</span>
              </div>
          </div>

          <div class="footer">


              <p class="footer-note">
                  <a href="#">Privacy Notice</a> | <a href="#">Support</a> | <a href="#">Terms of Service</a>
              </p>
          </div>
      </div>
  </body>
  </html>
  `;

  // Gửi email
  configMail.sendMail(
    {
      from: "duongbinhminh10032004@gmail.com",
      to,
      subject,
      text,
      html: emailContent, // Nội dung HTML
    },
    (err, info) => {
      if (err) {
        console.error("Lỗi khi gửi email:", err);
      } else {
        console.log("Email đã gửi thành công:", info);
      }
    }
  );
};
