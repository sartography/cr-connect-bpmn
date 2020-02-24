import {browser, by, element, ElementArrayFinder, ElementFinder, ExpectedConditions} from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getDiagramContainer() {
    return element(by.css('app-root .diagram-container'));
  }

  clickAndExpectRoute(clickSelector: string, expectedRoute: string | RegExp) {
    this.waitForClickable(clickSelector);
    this.clickElement(clickSelector);
    if (typeof expectedRoute === 'string') {
      expect(this.getRoute()).toEqual(expectedRoute);
    } else {
      expect(this.getRoute()).toMatch(expectedRoute);
    }
  }

  clickElement(selector: string) {
    this.waitForClickable(selector);
    this.scrollTo(selector);
    this.focus(selector);
    return this.getElement(selector).click();
  }

  closeTab() {
    return browser.close();
  }

  focus(selector: string) {
    return browser.controlFlow().execute(() => {
      return browser.executeScript('arguments[0].focus()', this.getElement(selector).getWebElement());
    });
  }

  getElement(selector: string): ElementFinder {
    return element.all(by.css(selector)).first();
  }

  getElements(selector: string): ElementArrayFinder {
    return element.all(by.css(selector));
  }

  getLocalStorageVar(name: string) {
    return browser.executeScript(`return window.localStorage.getItem('${name}');`);
  }

  getNumTabs() {
    return browser.getAllWindowHandles().then(wh => {
      return wh.length;
    });
  }

  async getRoute() {
    const url = await this.getUrl();
    return '/' + url.split(browser.baseUrl)[1];
  }

  getText(selector: string) {
    return element(by.css(selector)).getText() as Promise<string>;
  }

  getUrl() {
    return browser.getCurrentUrl();
  }

  scrollTo(selector: string) {
    browser.controlFlow().execute(() => {
      browser.executeScript('arguments[0].scrollIntoView(false)', this.getElement(selector).getWebElement());
    });
  }

  setLocalStorageVar(name: string, value: string) {
    return browser.executeScript(`return window.localStorage.setItem('${name}','${value}');`);
  }

  switchFocusToTab(tabIndex: number) {
    return browser.getAllWindowHandles().then(wh => {
      return wh.forEach((h, i) => {
        if (i === tabIndex) {
          return browser.switchTo().window(h);
        }
      });
    });
  }

  waitFor(t: number) {
    return browser.sleep(t);
  }

  waitForClickable(selector: string) {
    const e = this.getElement(selector);
    return browser.wait(ExpectedConditions.elementToBeClickable(e), 5000);
  }
}
