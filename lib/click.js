module.exports = click;

async function click(driver, el) {
  await driver.executeScript("arguments[0].click();", el);
}
