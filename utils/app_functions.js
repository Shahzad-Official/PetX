const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const axios = require("axios");

function base64_decode(base64Image, folder, filename, fileExtension) {
  var folderPath = path.join(process.cwd(), "/public", folder);
  var filePath = path.join(
    folderPath,
    filename + Date.now() + "." + fileExtension
  );
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  fs.writeFileSync(filePath, Buffer.from(base64Image, "base64"));

  return filePath;
}
function saveListOfFiles(base64Files, folder, filename, fileExtension) {
  var filesPath = [];
  var folderPath = path.join(process.cwd(), "/public", folder);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  base64Files.forEach((e, index) => {
    var filePath = path.join(
      folderPath,
      filename + Date.now() + `(${index})` + "." + fileExtension
    );
    fs.writeFileSync(filePath, Buffer.from(e, "base64"));
    filesPath.push(filePath);
  });

  return filesPath;
}

async function sendEmail(email, otp) {
  var emailTemplate = fs.readFileSync(
    process.cwd() + "/html/index.html",
    "utf-8"
  );
  var otpTemplate = emailTemplate
    .replace("otpPlaceholder", otp)
    .replace("emailplaceholder", email);

  var transport = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 465,
    secure: true,
    auth: {
      user: "shahzad.official.90@gmail.com",
      pass: "ThjOpXnf56SqWNMw",
    },
  });
  await transport
    .sendMail({
      to: email,
      subject:"Otp Verification",
      from: "petx.org@gmail.com",
      html: otpTemplate,
    })
    .then((res) => {
      console.log("otp has been send");
    })
    .catch((err) => {
      console.log(err);
    });
}
async function downloadAndSaveImage(imageUrl, folder, filename, fileExtension) {
  try {
    var folderPath = path.join(process.cwd(), "/public", folder);
    var filePath = path.join(
      folderPath,
      filename + Date.now() + "." + fileExtension
    );
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const response = await axios.get(imageUrl, { responseType: "stream" });

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(`Image saved to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error downloading and saving image:", error);
  }
}
function calculateDate(days) {
  var startDate = new Date();
  var endDate = startDate;
  endDate.setDate(startDate.getDate() + days);

  return endDate;
}

function sendFcmNotification(fcmToken, title, message, data) {
  var body = {
    to: fcmToken,
    notification: {
      title: title,
      body: message,
    },
    data: data,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "key=AAAA8mTWLQw:APA91bHZuVFBo4Wpe-zyxQ1Rql1uKx0COwSY_mlIIqji6gIDXq5iDJ6e2YYqIJPIhU9w5lYvB_1ogyOrLyUwcTsNOKhi8UulprOxg2riB_8GwSZVKOu1C1AEygrcTV9Y6VpUCxzWGWDp",
  };
  try {
    axios.post("https://fcm.googleapis.com/fcm/send", body, { headers });
  } catch {
    console.log("message not send");
  }
}

module.exports = {
  base64_decode,
  sendEmail,
  downloadAndSaveImage,
  calculateDate,
  saveListOfFiles,
  sendFcmNotification,
};
