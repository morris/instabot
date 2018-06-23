const { By, Key, until } = require("selenium-webdriver");
const click = require("./click");

module.exports = login;

async function login(options) {
  const driver = options.driver;
  await driver.get("https://www.instagram.com/accounts/login/");
  await driver.wait(until.elementLocated(By.name("username")), 5000);
  await driver.findElement(By.name("username")).sendKeys(options.username);
  await driver
    .findElement(By.name("password"))
    .sendKeys(options.password, Key.RETURN);
  try {
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Not Now')]")),
      5000
    );
    await click(
      driver,
      await driver.findElement(By.xpath("//*[contains(text(), 'Not Now')]"))
    );
  } catch (ex) {
    // ignore
    await driver.wait(
      until.elementLocated(By.className("coreSpriteFeedCreation")),
      1000
    );
  }
}
