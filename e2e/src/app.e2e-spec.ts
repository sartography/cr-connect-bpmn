import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display home screen', () => {
    page.navigateTo();
    expect(page.getText('h1')).toEqual('Workflow Specifications');
    expect(page.getRoute()).toEqual('/home');
    expect(page.getElements('app-workflow-spec-list').count()).toBeGreaterThan(0);
    expect(page.getElements('app-file-list').count()).toBeGreaterThan(0);
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
