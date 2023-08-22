import { View, ViewType } from 'containers/Types';
import React from 'react';
import { useDispatch, useTrackedState } from 'store';
import { filter } from 'store/utils';
import SideChip, { SideChipProps } from './SideChip';

type SideChipListProps = {
  viewType: ViewType;
  className: string;
  backgroundColorOnActive: string | { [name: string]: string };
};

function SideChipList(props: SideChipListProps) {
  const dispatch = useDispatch();
  const state = useTrackedState();

  const getBackgroundColor = (name: string) => {
    let backgroundColorOnActive = '';

    if (typeof props.backgroundColorOnActive === 'string') {
      backgroundColorOnActive = props.backgroundColorOnActive;
    } else if (props.backgroundColorOnActive.hasOwnProperty(name)) {
      backgroundColorOnActive = props.backgroundColorOnActive[name];
    }

    return backgroundColorOnActive;
  };

  const getChips = (): SideChipProps[] => {
    return filter(state, props.viewType).map((view: View) => {
      let disabled = false;

      return {
        name: view.name,
        label: view.label,
        active: view.visible,
        tooltip: view.description,
        className: props.className,
        disabled,
        backgroundColorOnActive: getBackgroundColor(view.name),
      };
    });
  };

  const handleClick = (data: SideChipProps) => {
    dispatch({
      type: 'TOGGLE_VIEW',
      viewType: props.viewType,
      name: data.name,
      visible: data.active,
    });
  };

  return (
    <div>
      {getChips().map((chip: SideChipProps) => (
        <SideChip
          key={chip.label}
          name={chip.name}
          label={chip.label}
          disabled={chip.disabled}
          active={chip.active}
          tooltip={chip.tooltip}
          className={chip.className}
          backgroundColorOnActive={chip.backgroundColorOnActive}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}

export default React.memo(SideChipList);
