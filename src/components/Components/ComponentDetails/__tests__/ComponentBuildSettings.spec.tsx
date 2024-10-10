import usePACState, { PACState } from '../../../../hooks/usePACState';
import { getHelpPopoverText, getBuildTriggerText } from '../tabs/ComponentBuildSettings';

jest.mock('../../../../hooks/usePACState');
jest.mock('../../../../../src/components/HelpPopover');

const usePacStateMock = usePACState as jest.Mock;

describe('getHelpPopoverText', () => {
  beforeEach(() => {
    usePacStateMock.mockReturnValue(PACState.ready);
  });

  it('renders the correct help popover text for enabled PACState', () => {
    expect(getHelpPopoverText(PACState.ready)).toBe(
      'A new build pipeline run is automatically triggered with every commit to the source code.',
    );
  });

  it('renders the correct help popover text for disabled PACState', () => {
    usePacStateMock.mockReturnValue(PACState.disabled);
    expect(getHelpPopoverText(PACState.disabled)).toBe(
      'Trigger a new build manually from the component’s action menu. To enable an automatic trigger with every commit, upgrade to the Custom build pipeline plan.',
    );
  });

  it('renders the correct build trigger text based on PACState value', () => {
    usePacStateMock.mockReturnValue(PACState.disabled);
    expect(getBuildTriggerText(PACState.disabled)).toBe('Manual');

    usePacStateMock.mockReturnValue(PACState.ready);
    expect(getBuildTriggerText(PACState.ready)).toBe('Automatic');
  });
});
