import React from "react";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


const SHEETID = '1c0P99C3BHUSCeK4N914pwfIEfy-1KP6E4q2uWWVGgn0';

const customStyles = {
    control: base => ({
        ...base,
        height: 50,
        minHeight: 50
    })
};

export default class RemoveEmployee extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            os: null,
            name: null,
            SN: null,
            model: null,
            memory: null,
            storage: null,
            date: null,
            accessories: null,
            array: [],
            index: null,
            status: null,
        };

    }

    appendUser(values, range, inputOption) {
        let body = {
            values: values
        };
        window.gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SHEETID,
            range: range,
            valueInputOption: inputOption,
            resource: body
        }).then((response) => {
            let result = response.result;
            console.log(`${result.updates.updatedCells} cells appended.`)
        });
        return new Promise(resolve => {resolve(true)})

    }

    removeRow(values, range, inputOption) {
        let body = {
            values: values
        };
        window.gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SHEETID,
            range: range,
            valueInputOption: inputOption,
            resource: body
        }).then((response) => {
            let result = response.result;
            console.log(`${result.updatedCells} cells updated.`);
        });
    }

    async loadArray() {
        let range = 'Current Employees!A2:E';
        let name = String(this.state.name);

        let list = [];
        await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1c0P99C3BHUSCeK4N914pwfIEfy-1KP6E4q2uWWVGgn0',
            range: range,
        }).then(function(response) {
            let range = response.result;
            if (range.values.length > 0) {
                for (let i = 0; i < range.values.length; i++) {
                    let row = range.values[i];
                    if(String(row[1]).includes(name)) {
                        let temp = {SN: row[0], name: row[1], model: row[3], memory: row[4], storage: row[5], index: i+2};
                        console.log(row[1]);
                        list.push(temp);
                    }
                }
            }
        });
        this.setState({array: list});
        return new Promise(resolve => {
            resolve(true);
        })
    }

    handleChange = event => {
        let sn = event.target.value;
        let x;
        for (let i = 0; i < this.state.array.length; i++) {
            if (sn === this.state.array[i].SN)
                x = this.state.array[i]
        }
        this.setState({name: x.name, SN: sn, model: x.model, memory: x.memory, storage: x.storage, index: x.index});
    };

    async submit() {
        if(this.state.status === "received") {
            let values = [
                [
                    this.state.SN, this.state.model, this.state.date,
                    this.state.memory, this.state.storage, this.state.name
                ]
            ];
            if(this.state.model && String(this.state.model).includes("mac")) {
                let r = await this.appendUser(values, 'spare macs!A2:F', 'USER_ENTERED');
                values = [
                    [
                        "", "", "", "", "", "", "", ""
                    ],
                ];
                let range = 'Current Employees!A' + this.state.index + ':H' + this.state.index;

                this.removeRow(values, range, 'USER_ENTERED')
            }
            else {
                let r = await this.appendUser(values, 'spare windows!A2:F', 'USER_ENTERED');
                values = [
                    [
                        "", "", "", "", "", "", "", ""
                    ],
                ];
                let range = 'Current Employees!A' + this.state.index + ':H' + this.state.index;
                this.removeRow(values, range, 'USER_ENTERED')
            }

        }
        else {
            let values = [
                [
                    this.state.SN, this.state.name,
                    this.state.model, this.state.memory, this.state.storage
                ]
            ];
            this.appendUser(values, 'Removed Employees!A2:F', 'USER_ENTERED');
        }
    }

    render() {
        return (
            <Grid container justify={"center"}>
                <Grid item xs={4}>
                    <form>
                        <Grid container justify={"center"} >
                            <Grid style={{padding:10, }}>
                                <TextField
                                    name={'name'}
                                    helperText="Search user by name"
                                    margin="normal"
                                    variant="outlined"
                                    onChange={(event) =>
                                    {this.setState({name: event.target.value})}}
                                    fullWidth
                                />
                            </Grid>
                            <Grid>
                                <Button style={{marginTop:35, }} onClick={() => {this.loadArray()}} variant="contained">search</Button>
                            </Grid>
                        </Grid>
                        {((this.state.array) ?
                                <Grid container justify={"center"} >
                                    <Grid style={{padding:20, }}>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">Select an employee</FormLabel>
                                            <RadioGroup aria-label="spare-option" name="spare-option"
                                                        onChange={this.handleChange}>
                                                {
                                                    this.state.array.length && this.state.array.map((item) => {
                                                            return (
                                                                <FormControlLabel value={item.SN} control={<Radio />}
                                                                                  label={item.name + ", S/N: " + item.SN}
                                                                />
                                                            )
                                                        }
                                                    )
                                                }

                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                :
                                null
                        )}
                        <Grid>
                            <FormControl
                                fullWidth>
                                <InputLabel>Return Status</InputLabel>
                                <Select
                                    name={'status'}
                                    onChange={async (evt) => {
                                        this.setState({status: evt.target.value});
                                    }}
                                    styles={customStyles}
                                    fullWidth={true}
                                >
                                    <MenuItem value="received">Laptop has been returned</MenuItem>
                                    <MenuItem value="waiting">Waiting for return</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid>
                            <Button onClick={() => {this.submit()}} variant="contained" style={{marginTop:10, }}>submit</Button>
                        </Grid>
                    </form>
                </Grid>
            </Grid>

        )
    }
}
