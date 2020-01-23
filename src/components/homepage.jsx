import React from "react";
import Typography from '@material-ui/core/Typography';
import {componentDidMount, loadSheetsAPI} from "../helpers/google-auth";
import AddComputer from "./addComputer";
import AddEmployee from "./newEmployee";
import RemoveEmployee from "./removeEmployee";
import Repair from "./repair"
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";




const SHEETID = '1c0P99C3BHUSCeK4N914pwfIEfy-1KP6E4q2uWWVGgn0';
const customStyles = {
    control: base => ({
        ...base,
        height: 50,
        minHeight: 50
    })
};


export default class MainPage extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            gapiReady: false,
            option: null,

        };

        this.sheetsaccess();

    }

    async sheetsaccess() {
        if(await componentDidMount() && await loadSheetsAPI()) {
            this.state.gapiReady = true;
        }
    }

    listMajors() {
        window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1c0P99C3BHUSCeK4N914pwfIEfy-1KP6E4q2uWWVGgn0',
            range: 'Current Employees!A2:B',
        }).then(function(response) {
            var range = response.result;
            if (range.values.length > 0) {
                for (let i = 0; i < range.values.length; i++) {
                    let row = range.values[i];
                    // Print columns A and E, which correspond to indices 0 and 4.
                    console.log(row[0] + ', ' + row[1]);
                }
            } else {
                console.log('No data found.');
            }
        }, function(response) {
            console.log('Error: ' + response.result.error.message);
        });
    }



    render() {
        return (
            <Grid container justify={"center"}>
                <Grid item xs={4}>
                    <FormControl
                        fullWidth>
                        <InputLabel>Option</InputLabel>
                        <Select
                            name={'option'}
                            onChange={(evt) => {
                                this.setState({option: evt.target.value});
                            }}
                            labelWidth={500}
                            styles={customStyles}
                            fullWidth={true}
                        >
                            <MenuItem value="new-computer">Register New Computer</MenuItem>
                            <MenuItem value="add-employee">Add a New Employee</MenuItem>
                            <MenuItem value="remove-employee">Remove an Employee</MenuItem>
                            <MenuItem value="repair">Repair Computer</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {((this.state.option === "new-computer") ?
                        <Grid container justify={"center"}>
                            <AddComputer/>
                        </Grid>
                :
                        null
                )}
                {((this.state.option === "add-employee") ?
                        <Grid container justify={"center"}>
                            <AddEmployee/>
                        </Grid>
                        :
                        null
                )}
                {((this.state.option === "remove-employee") ?
                        <Grid container justify={"center"}>
                            <RemoveEmployee/>
                        </Grid>
                        :
                        null
                )}
                {((this.state.option === "repair") ?
                        <Grid container justify={"center"}>
                            <Repair/>
                        </Grid>
                        :
                        null
                )}
            </Grid>

        )
    }
}