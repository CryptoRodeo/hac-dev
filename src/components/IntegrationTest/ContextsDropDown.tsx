/* eslint-disable camelcase */
import React from 'react';
import { DropdownField } from '../../../src/shared';
import { Context } from '../../types/coreBuildService';

type ContextDropdownProps = Omit<
  React.ComponentProps<typeof DropdownField>,
  'items' | 'label' | 'placeholder'
> & {
  contextsSet: Context[];
};

// Define the structure of contextOptions
interface ContextOption {
  description: string;
}

interface ContextOptions {
  [key: string]: ContextOption;
}

const contextOptions: ContextOptions = {
  application: {
    description: 'execute the integration test in all cases - this would be the default state',
  },
  group: { description: 'execute the integration test for a Snapshot of the `group` type' },
  override: { description: 'execute the integration test for a Snapshot of the `override` type' },
  component: { description: 'execute the integration test for a Snapshot of the `component` type' },
  component_COMPONENT: {
    description: 'execute the integration test for a specific component update',
  },
  pull_request: {
    description:
      'execute the integration test in case of the Snapshot being created for a `pull request` event',
  },
  push: {
    description:
      'execute the integration test in case of the Snapshot being created for a `push` event',
  },
};

// Add TypeScript annotations to filterContextOptions
const filterContextOptions = (
  options: ContextOptions,
  names: string[],
): [string, ContextOption][] => {
  return Object.entries(options).filter(([name]) => !names.includes(name));
};

export const ContextDropdown: React.FC<ContextDropdownProps> = ({ contextsSet, ...props }) => {
  const contextNamesAlreadyUsed = contextsSet.map((c) => c.name);

  const dropdownItems = React.useMemo(
    () =>
      filterContextOptions(contextOptions, contextNamesAlreadyUsed).map(([name]) => ({
        key: name,
        value: name,
      })),
    [contextNamesAlreadyUsed],
  );

  return (
    <DropdownField
      {...props}
      label="Supported contexts"
      placeholder="Select Context to add"
      items={dropdownItems}
    />
  );
};
