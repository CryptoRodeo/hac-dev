/* eslint-disable camelcase */
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { FieldArray, useField } from 'formik';
import { useComponents } from '../../../src/hooks/useComponents';
import ErrorEmptyState from '../../../src/shared/components/empty-state/ErrorEmptyState';
import { useWorkspaceInfo } from '../../../src/utils/workspace-context-utils';
import { HttpError } from '../../shared/utils/error/http-error';
import { ContextSelectList } from './ContextSelectList';

export interface ContextOption {
  description: string;
  selected: boolean;
}

export interface ContextOptions {
  [key: string]: ContextOption;
}

export const contextOptions: ContextOptions = {
  application: {
    description: 'execute the integration test in all cases - this would be the default state',
    selected: false,
  },
  group: {
    description: 'execute the integration test for a Snapshot of the `group` type',
    selected: false,
  },
  override: {
    description: 'execute the integration test for a Snapshot of the `override` type',
    selected: false,
  },
  component: {
    description: 'execute the integration test for a Snapshot of the `component` type',
    selected: false,
  },
  pull_request: {
    description: 'execute the integration test for a Snapshot created for a `pull request` event',
    selected: false,
  },
  push: {
    description: 'execute the integration test for a Snapshot created for a `push` event',
    selected: false,
  },
};

interface IntegrationTestContextProps {
  heading?: React.ReactNode;
  fieldName: string;
}

// Helper to get selected contexts based on form value
const getSelectedContexts = (contexts: any[], options: ContextOptions): ContextOptions =>
  Object.keys(options).reduce((acc, name) => {
    acc[name] = { ...options[name], selected: contexts.some((c) => c.name === name) };
    return acc;
  }, {} as ContextOptions);

// Helper to append components-specific context options
const addComponentContexts = (
  selectedContexts: ContextOptions,
  components: any[],
  contexts: any[],
) => {
  components.forEach((component) => {
    const componentName = component.metadata.name;
    selectedContexts[`component_${componentName}`] = {
      description: `execute the integration test when component ${componentName} updates`,
      selected: contexts.some((c) => c.name === `component_${componentName}`), // Check if it's selected
    };
  });
};

const ContextsField: React.FC<IntegrationTestContextProps> = ({ heading, fieldName }) => {
  const { namespace } = useWorkspaceInfo();
  const { appName } = useParams();
  const [components, loaded, loadErr] = useComponents(namespace, appName);

  const [, { value: contexts }] = useField(fieldName);

  const selectedContexts = React.useMemo(() => {
    const initialSelectedContexts = getSelectedContexts(contexts, contextOptions);
    if (loaded && components) {
      addComponentContexts(initialSelectedContexts, components, contexts);
    }
    return initialSelectedContexts;
  }, [contexts, loaded, components]);

  const handleSelect = React.useCallback(
    (arrayHelpers: any, contextName: string) => {
      const isSelected = selectedContexts[contextName].selected;
      const index = contexts.findIndex((c) => c.name === contextName);

      if (isSelected && index !== -1) {
        arrayHelpers.remove(index); // Deselect
      } else if (!isSelected) {
        arrayHelpers.push({ name: contextName }); // Select
      }
    },
    [contexts, selectedContexts],
  );

  if (loadErr || (loaded && !components)) {
    return (
      <ErrorEmptyState
        httpError={HttpError.fromCode(loadErr ? (loadErr as any).code : 404)}
        title="Components for Integration test not found"
        body="No such Components for Integration test"
      />
    );
  }

  return (
    <div style={{ maxWidth: '300px' }}>
      <h1>{heading ?? 'Contexts'}</h1>
      <FieldArray
        name={fieldName}
        render={(arrayHelpers) => (
          <ContextSelectList
            selectedContexts={selectedContexts}
            onSelect={(_event, contextName: string) => handleSelect(arrayHelpers, contextName)}
          />
        )}
      />
    </div>
  );
};

export default ContextsField;
