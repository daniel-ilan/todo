import { Grid, TextField, IconButton } from '@material-ui/core';
import { Edit, CheckCircle } from '@material-ui/icons';
import React from 'react';

interface inlineEditingType {
  cbFunc: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string;
}

const EditInline = ({ cbFunc, value }: inlineEditingType) => {
  return (
    <Grid container spacing={1} alignItems='flex-end'>
      <Grid item>
        <TextField
          onBlur={(event) => cbFunc(event)}
          autoFocus
          id='input-name'
          label={<Edit />}
          variant='outlined'
          defaultValue={value}
        />
      </Grid>
      <Grid item>
        <IconButton>
          <CheckCircle />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default EditInline;
