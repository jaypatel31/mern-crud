import React,{useState,useEffect} from 'react'
import axios from "axios"
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  const useStyles = makeStyles((theme)=>({
    table: {
      width: "100%",
    },
    container:{
        width: "80%",
        margin:"auto",
        marginTop:"2rem"
    },
    button:{
      marginTop:"5px"
    },
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    formElem:{
      width:"100%"
    }
  }));

const TableDisp = () => {
    const [users, setUsers] = useState([])
    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);

    const classes = useStyles();

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const snackClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setSnackOpen(false);
    };

    useEffect(() => {
        axios.get("/allusers")
        .then(response=>{
            console.log(response.data)
            setUsers(response.data.users)
        })
        .catch(e=>{
            console.log(e)
        })
    }, [])

    const submitForm = (e)=>{
      e.preventDefault()
      if(!email || !name || !name || !userName){
        setSnackOpen(true)
        return
      }
      axios.post('/createuser',{
        name,
        username:userName,
        email,
        phone
      },{
        headers:{
          "Content-Type":"application/json"
        }
      })
      .then(response=>{
        console.log(response.data)
        
        setUsers(prevstate=>{
          return[
            ...prevstate,
            response.data.user
          ]
        })
        setOpen(false);

      })
      .catch(e=>{
        console.log(e)
      })
    }

    const body = (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Enter User Details</h2>
        <p id="simple-modal-description">
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="standard-basic" label="Name"  className={classes.formElem} defaultValue={name} onChange={(e)=>setName(e.target.value)}/>
            <TextField id="standard-basic" label="User Name" className={classes.formElem} defaultValue={userName} onChange={(e)=>setUserName(e.target.value)}/>
            <TextField id="standard-basic" label="Email" className={classes.formElem} defaultValue={email} onChange={(e)=>setEmail(e.target.value)}/>
            <TextField id="standard-basic" label="Phone" className={classes.formElem} defaultValue={phone} onChange={(e)=>setPhone(e.target.value)}/>
            <Button variant="contained" color="primary" className={classes.button} onClick={(e)=>submitForm(e)}>
              Add User
            </Button>
          </form>
        </p>
        <Snackbar open={snackOpen} autoHideDuration={6000} onClose={snackClose}>
          <Alert onClose={snackClose} severity="error" sx={{ width: '100%' }}>
            Please fill all the fields!!
          </Alert>
        </Snackbar>
      </div>
    );


    

    return (
        <div>
          <Button variant="contained" color="secondary" className={classes.button} onClick={handleOpen}>
            Add User
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
            <TableContainer component={Paper} className={classes.container}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">User Name</StyledTableCell>
                        <StyledTableCell align="center">Email</StyledTableCell>
                        <StyledTableCell align="center">Phone</StyledTableCell>
                        <StyledTableCell align="center">Actions</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {users?users.map((row,index) => (
                        <StyledTableRow hover key={index}>
                            <StyledTableCell component="th" scope="row">{index+1}</StyledTableCell>
                            <StyledTableCell align="center">{row.name}</StyledTableCell>
                            <StyledTableCell align="center">{row.username}</StyledTableCell>
                            <StyledTableCell align="center">{row.email}</StyledTableCell>
                            <StyledTableCell align="center">{row.phone}</StyledTableCell>
                            <StyledTableCell align="center">
                            <label htmlFor="icon-button-file">
                              <IconButton color="primary" aria-label="upload picture" component="span">
                                <EditIcon />
                              </IconButton>
                            </label>
                            </StyledTableCell>
                        </StyledTableRow >
                    )):""}
                    </TableBody>
                </Table>
                </TableContainer>
        </div>
    )
}

export default TableDisp
