const path = require("path");
const fs = require("fs");
const util = require("util");

process.env.PATH =
  process.env.PATH + path.delimiter + path.resolve(process.cwd(), "bin");

const { Builder } = require("selenium-webdriver");

const login = require("./lib/login");
const post = require("./lib/post");

autoShare(true);

async function autoShare(init) {
  try {
    const config = JSON.parse(await util.promisify(fs.readFile)("config.json"));
    const delay = (config.interval + Math.random() * config.deviation) * 60000;

    if (init) return setTimeout(autoShare, delay);

    const images = (await util.promisify(fs.readdir)(config.path))
      .filter(filename => filename.match(/\.jpe?g$/i))
      .map(filename => ({
        filename: filename,
        path: path.resolve(config.path, filename),
        caption: path.basename(filename, path.extname(filename))
      }))
      .sort((a, b) => {
        return parseInt(a.caption, 10) - parseInt(b.caption, 10);
      });

    if (images.length === 0) return setTimeout(autoShare, delay);

    const image = images[0];

    console.log("posting " + image.filename + "...");

    const driver = new Builder()
      .forBrowser("chrome")
      .withCapabilities({
        browserName: "chrome",
        chromeOptions: {
          mobileEmulation: {
            deviceName: "iPhone X"
          }
        }
      })
      .build();

    try {
      await login({
        driver: driver,
        username: config.username,
        password: config.password
      });

      await post({
        driver: driver,
        path: image.path,
        caption: image.caption
      });

      await driver.close();
    } catch (ex) {
      await driver.close();
      throw ex;
    }

    await util.promisify(fs.rename)(
      image.path,
      path.resolve(config.path, "done", image.filename)
    );

    console.log("done");

    setTimeout(autoShare, delay);
  } catch (ex) {
    console.error(ex.stack);
    return process.exit(1);
  }
}
