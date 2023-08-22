import React from 'react';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from '@material-ui/core';

type SidebarItemProps = {
  text: string;
  icon: typeof SvgIcon;
};

function SidebarItem({ text, icon }: SidebarItemProps) {
  const CustomIcon = icon;

  return (
    <ListItem button>
      <ListItemIcon>
        <CustomIcon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

export default React.memo(SidebarItem);
