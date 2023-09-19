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
      from: "contact@hexon.online",
      html: otpTemplate,
    })
    .then((res) => {
      console.log("otp has been send");
    })
    .catch((err) => {
      console.log(err);
    });
}
async function downloadAndSaveImage(imageUrl, folder,filename, fileExtension) {

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

module.exports = { base64_decode, sendEmail ,downloadAndSaveImage};
