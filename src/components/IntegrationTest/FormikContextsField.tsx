/* eslint-disable camelcase */
import * as React from 'react';
import {
  TextContent,
  DataList,
  DataListItem,
  DataListToggle,
  DataListContent,
  Button,
  Alert,
  AlertVariant,
  FormGroup,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  CardHeader,
  Card,
  CardExpandableContent,
  CardBody,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/js/icons/minus-circle-icon';
import { FieldArray, useField } from 'formik';
import { InputField } from '../../shared';
import { Context } from '../../types/coreBuildService';
import { ContextDropdown } from './ContextsDropDown';

interface IntegrationTestContextProps {
  heading?: React.ReactNode;
  fieldName: string;
  initExpanded?: boolean;
}

const contextOptions = {
  application: {
    description: 'execute the integration test in all cases - this would be the default state',
  },
  group: {
    description: 'execute the integration test for a Snapshot of the `group` type',
  },
  override: {
    description: 'execute the integration test for a Snapshot of the `override` type',
  },
  component: {
    description: 'execute the integration test for a Snapshot of the `component` type',
  },
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

const IntegrationTestContexts: React.FC<React.PropsWithChildren<IntegrationTestContextProps>> = ({
  heading,
  fieldName,
  initExpanded = false,
}) => {
  const [, { value: contexts, error }] = useField<Context[]>(fieldName);

  const initExpandedState = React.useMemo(() => {
    const state = [];
    for (let i = 0; i < contexts?.length; i++) {
      state.push(false);
    }
    return state;
  }, [contexts]);

  // State hook for whether we expand context at index i.
  const [expanded, setExpanded] = React.useState<boolean[]>(initExpandedState);
  // State hook for whether the list should be expanded.
  const [contextExpanded, setContextExpanded] = React.useState<boolean>(initExpanded);

  /**
   * Toggle the expanded state for context at index i
   * @param i
   */
  const toggleExpandedState = (i) => {
    // get all the current expanded contexts
    const state = [...expanded];
    // toggle the value for context at index i
    state[i] = !state[i];
    // update state
    setExpanded(state);
  };

  /**
   * When adding a context make sure it's expanded.
   */
  const expandNewContext = () => {
    const state = [...expanded, true];
    setExpanded(state);
  };

  /**
   * Remove the context at index i
   * @param i
   */
  const removeContext = (i) => {
    const state = [...expanded];
    state.splice(i, 1);
    setExpanded(state);
  };

  return (
    <div style={{ maxWidth: '750px' }}>
      <Card
        isSelected={contextExpanded}
        isExpanded={contextExpanded}
        data-test="its-context-field"
        isCompact
        isPlain
      >
        <CardHeader
          onExpand={() => setContextExpanded((v) => !v)}
          toggleButtonProps={{
            id: `toggle-${name}`,
            'aria-label': name,
            'aria-labelledby': `review-${name} toggle-${name}`,
            'aria-expanded': contextExpanded,
            'data-test': `${name}-toggle-button`,
            className: 'pf-v5-u-pr-xs pf-v5-u-pl-sm',
          }}
          className="pf-v5-u-pl-xs pf-v5-u-pr-xs"
        >
          {heading ?? 'Contexts'}
          {error && (
            <Alert
              data-test="its-contexts-error-alert"
              title={error}
              variant={AlertVariant.danger}
            />
          )}
        </CardHeader>
        <CardExpandableContent>
          <CardBody className="review-component-card__card-body">
            <FieldArray
              name={fieldName}
              render={(contextArrayHelpers) => (
                <>
                  <ContextDropdown
                    name="context"
                    existingContexts={contexts}
                    onChange={(val: string) => {
                      expandNewContext();
                      contextArrayHelpers.push({
                        name: val,
                        description: contextOptions[val].description,
                      });
                    }}
                    required
                  />
                  <DataList aria-label="contexts-list" data-test="its-contexts-list">
                    {Array.isArray(contexts) &&
                      contexts.length > 0 &&
                      contexts.map((context, index) => {
                        return (
                          <DataListItem
                            key={`context-${index}`}
                            isExpanded={expanded[index]}
                            data-test={`its-context-${index + 1}`}
                          >
                            <DataListItemRow className="pf-v5-u-pl-0">
                              <DataListToggle
                                id={context.name}
                                data-testid={`${context.name}-toggle`}
                                onClick={() => toggleExpandedState(index)}
                                isExpanded={expanded[index]}
                                data-test={`expand-context-${index + 1}`}
                                className="pf-v5-u-mr-0"
                              />
                              <DataListItemCells
                                dataListCells={[
                                  <DataListCell key="context-title" width={5}>
                                    <TextContent>{`Context: ${context.name}`}</TextContent>
                                  </DataListCell>,

                                  <DataListCell key="remove-context-button" width={3}>
                                    <Button
                                      isInline
                                      type="button"
                                      variant="link"
                                      data-test={`remove-context-${index + 1}`}
                                      icon={<MinusCircleIcon />}
                                      onClick={() => {
                                        removeContext(index);
                                        contextArrayHelpers.remove(index);
                                      }}
                                    >
                                      Remove context
                                    </Button>
                                  </DataListCell>,
                                ]}
                              />
                            </DataListItemRow>
                            <DataListContent
                              hasNoPadding
                              aria-label="list-item-content"
                              isHidden={!expanded[index]}
                            >
                              <DataListItemRow className="pf-v5-u-pl-0">
                                <DataListItemCells
                                  dataListCells={[
                                    <DataListCell
                                      key="context-value"
                                      width={4}
                                      className="pf-v5-u-pl-xl pf-v5-u-pt-0"
                                    >
                                      <FormGroup label="Name">
                                        <InputField
                                          name={`${fieldName}[${index}].name`}
                                          data-test={`context-${index}-name`}
                                        />
                                      </FormGroup>
                                    </DataListCell>,
                                    <DataListCell
                                      key="context-description"
                                      width={3}
                                      className="pf-v5-u-pl-xl pf-v5-u-pt-0"
                                    >
                                      <FormGroup label="Description">
                                        <InputField
                                          name={`${fieldName}[${index}].description`}
                                          data-test={`context-${index}-description`}
                                        />
                                      </FormGroup>
                                    </DataListCell>,
                                  ]}
                                />
                              </DataListItemRow>
                            </DataListContent>
                          </DataListItem>
                        );
                      })}
                  </DataList>
                </>
              )}
            />
          </CardBody>
        </CardExpandableContent>
      </Card>
    </div>
  );
};

export default IntegrationTestContexts;
