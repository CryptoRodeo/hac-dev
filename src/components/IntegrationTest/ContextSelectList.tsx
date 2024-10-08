import React, { useState, useCallback } from 'react';
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { ContextOptions } from './ContextsField';

type ContextSelectListProps = {
  selectedContexts: ContextOptions;
  onSelect: (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    contextName: string,
  ) => void;
};

export const ContextSelectList: React.FC<ContextSelectListProps> = ({
  selectedContexts,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggleClick = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const renderToggle = useCallback(
    (toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle
        ref={toggleRef}
        onClick={onToggleClick}
        isExpanded={isOpen}
        style={{ maxWidth: '300px' } as React.CSSProperties}
      >
        Select Contexts
      </MenuToggle>
    ),
    [isOpen, onToggleClick],
  );

  return (
    <Select
      role="menu"
      id="context-select"
      isOpen={isOpen}
      onSelect={(_event, value) => onSelect(_event, value as string)}
      onOpenChange={setIsOpen}
      toggle={renderToggle}
    >
      <SelectList>
        {Object.entries(selectedContexts).map(([name, values]) => (
          <SelectOption
            key={name}
            value={name}
            isSelected={values.selected}
            description={values.description}
          >
            {name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
