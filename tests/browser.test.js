const { Builder, By, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
require('geckodriver');

// Här anger vi var testfilen ska hämtas. De konstiga replaceAll-funktionerna ersätter
// mellanslag med URL-säkra '%20' och backslash (\) på Windows med slash (/).
const fileUnderTest =
    'file://' + __dirname.replaceAll(/ /g, '%20').replaceAll(/\\/g, '/') + '/../dist/index.html';

const defaultTimeout = 10000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter


// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång

beforeAll(async () => {

    driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(
            new firefox.Options().setBinary(
                'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
            )
        )
        .build();

    await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async () => {
    await driver.quit();
}, defaultTimeout);

test('pop button removes top element', async () => {
    console.log('TEST STARTAR');

    // Hitta push-knappen
    let pushButton = await driver.findElement(By.id('push'));

    // Klicka på push
    await pushButton.click();

    // Vänta på prompt-rutan
    await driver.wait(until.alertIsPresent(), 5000);

    // Hantera prompten
    let alert = await driver.switchTo().alert();

    // Skriv in värde
    await alert.sendKeys('n/a');

    // Tryck OK
    await alert.accept();

    // Hitta pop-knappen
    let popButton = await driver.findElement(By.id('pop'));

    // Klicka på pop
    await popButton.click();

    // Läs av texten i top_of_stack
    let stackText = await driver
        .findElement(By.id('top_of_stack'))
        .getText();

    // Kontrollera resultatet
    expect(stackText).toEqual('n/a');
});

test('The stack should be empty in the beginning', async () => {
    let stack = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
    it('should open a prompt box', async () => {
        let push = await driver.findElement(By.id('push'));
        await push.click();
        let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
    });
});

