const { By, Key, until } = require("selenium-webdriver");
const click = require("./click");

module.exports = post;

async function post(options) {
  const driver = options.driver;
  await driver.wait(
    until.elementLocated(By.className("coreSpriteFeedCreation"), 10000)
  );
  await click(
    driver,
    await driver.findElement(By.className("coreSpriteFeedCreation"))
  );
  await driver.wait(
    until.elementLocated(By.xpath("//input[@type='file']")),
    10000
  );
  await driver
    .findElement(By.xpath("//input[@type='file']"))
    .sendKeys(options.path);
  await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(), 'Next')]")),
    10000
  );
  await click(
    driver,
    await driver.findElement(By.xpath("//*[contains(text(), 'Next')]"))
  );
  await driver.wait(
    until.elementLocated(
      By.xpath("//textarea[@placeholder='Write a caption…']")
    ),
    10000
  );
  await driver
    .findElement(By.xpath("//textarea[@placeholder='Write a caption…']"))
    .sendKeys(options.caption || "");
  await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(), 'Share')]")),
    10000
  );
  await click(
    driver,
    await driver.findElement(By.xpath("//*[contains(text(), 'Share')]"))
  );
  await driver.wait(
    until.elementLocated(By.className("coreSpriteFeedCreation")),
    50000
  );
}
