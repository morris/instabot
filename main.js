const path = require("path");
const fs = require("fs");
const util = require("util");
const Instagram = require("instagram-web-api");

autoPost(true);

async function autoPost(init) {
  try {
    const config = JSON.parse(await util.promisify(fs.readFile)("config.json"));
    const delay = (config.interval + Math.random() * config.deviation) * 60000;
    const client = new Instagram({
      username: config.username,
      password: config.password
    });
    await client.login();

    if (init) return setTimeout(autoPost, delay);

    const images = (await util.promisify(fs.readdir)(config.path))
      .filter(filename => filename.match(/\.jpe?g$/i))
      .map(filename => ({
        filename: filename,
        path: path.resolve(config.path, filename),
        caption: path.basename(filename, path.extname(filename))
      }))
      .map(image =>
        Object.assign({ number: parseInt(image.caption, 10) }, image)
      )
      .filter(image => isFinite(image.number))
      .sort((a, b) => {
        return a.number - b.number;
      });

    if (images.length === 0) return setTimeout(autoPost, delay);

    const image = images[0];

    console.log("posting " + image.filename + "...");

    await client.uploadPhoto({
      photo: image.path,
      caption: image.caption
    });

    await util.promisify(fs.rename)(
      image.path,
      path.resolve(config.path, "done", image.filename)
    );

    console.log("done");

    setTimeout(autoPost, delay);
  } catch (ex) {
    console.error(ex.stack);
    return process.exit(1);
  }
}
