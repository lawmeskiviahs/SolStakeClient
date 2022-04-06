import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';  
export default function BasicTextFields() {


    const fileUp =()=>{
  const x = document.getElementById("myFile");
 console.log(x);
 console.log("hello");
 

    }
   React.useEffect(() => {
    var x = document.querySelector("input")
    console.log(x,"???????????");
    
    
    }, [])
    
    return (

        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '65ch' },
            }}
            noValidate
            autoComplete="off"
        >

            {/* <TextField id="standard-basic" label="Name" variant="standard" /> */}
            {/* <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Name"
        /> */}
            <TextField inputProps={{ inputMode: 'text' }} label="Name" />
            <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} label="Price" />

            {/* <Button
                variant="contained"
                component="label"
                // onClick={()=>fileUp}
                >
                Upload File */}

                <input
                id = "myFile"
                    type="file"
                    onChange={()=>fileUp()}
                />
            
        </Box>
    );
}
