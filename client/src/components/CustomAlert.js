import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomAlert(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);


  useEffect(() => {
    if(props.open){
      setOpen(true)
    }
  }, [props.open])


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // <Alert severity="error">This is an error message!</Alert>
  // <Alert severity="warning">This is a warning message!</Alert>
  // <Alert severity="info">This is an information message!</Alert>
  // <Alert severity="success">This is a success message!</Alert>

  return (
    <div className={classes.root}>
  
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.severity}>
          {props.severity === "error" ? "Hubo un error: '" + props.message + "'" : null}
        </Alert>
      </Snackbar>

    </div>
  );
}