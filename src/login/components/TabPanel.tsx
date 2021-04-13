import React from 'react';
import Box from '@material-ui/core/Box';

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  const { classes } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className={classes.h90}>
      {value === index && <Box className={classes.h100}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
