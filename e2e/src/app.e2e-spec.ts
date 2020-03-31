import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display fake sign-in screen', () => {
    page.navigateTo();
    expect(page.getText('h1')).toEqual('FAKE UVA NETBADGE SIGN IN (FOR TESTING ONLY)');
  });

  it('should click sign-in and navigate to home screen', () => {
    page.clickAndExpectRoute('#sign_in', '/');
    expect(page.getElements('app-workflow-spec-list').count()).toBeGreaterThan(0);
    expect(page.getElements('app-file-list').count()).toBeGreaterThan(0);
  });

  it('should display diagram', async () => {
    const el = await page.getElement('app-file-list mat-list-item');
    const specId = await el.getAttribute('data-workflow-spec-id');
    const fileMetaId = await el.getAttribute('data-file-meta-id');
    const expectedRoute = `/modeler/${specId}/${fileMetaId}`;

    page.clickAndExpectRoute('app-file-list mat-list-item h4', expectedRoute);
    expect(page.getElements('.diagram-container').count()).toBeGreaterThan(0);
  });

  it('should show dialog to open a diagram file');

  it('should show dialog to add a new diagram file');

  it('should add a new BPMN file');

  it('should add a new DMN file');

  it('should open a diagram file from a URL');

  it('should open a local diagram file');

  it('should save diagram changes');

  it('should export diagram as XML file');

  it('should export diagram as SVG image');

  it('should save diagram changes');

  it('should save diagram changes');

  it('should save diagram changes');
});
