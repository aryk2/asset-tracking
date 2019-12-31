import React from "react";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


const SHEETID = '1c0P99C3BHUSCeK4N914pwfIEfy-1KP6E4q2uWWVGgn0';

const customStyles = {
    control: base => ({
        ...base,
        height: 50,
        minHeight: 50
    })
};


export default class AddEmployee extends React.Component {


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
    }

    async loadArray() {
            let range = '';
            if(this.state.os === "windows")
                range = 'spare windows!A2:E';
            else
                range = 'spare macs!A2:E';

            let list = [];
            await window.gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: '1c0P99C3BHUSCeK4N914pwfIEfy-1KP6E4q2uWWVGgn0',
                range: range,
            }).then(function(response) {
                let range = response.result;
                if (range.values.length > 0) {
                    for (let i = 0; i < range.values.length; i++) {
                        let row = range.values[i];
                        let temp = {SN: row[0], model: row[1], memory: row[3], storage: row[4]};
                        list.push(temp);
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
        this.setState({SN: sn, model: x.model, memory: x.memory, storage: x.storage});
    };

    submit() {
        let values = [
            [
                this.state.SN, this.state.name, this.state.date,
                this.state.model, this.state.memory, this.state.storage
            ]
        ];
        this.appendUser(values, 'Current Employees!A2:F', 'USER_ENTERED')
    }

    render() {
        return (


            <Grid container justify={"center"}>
                <Grid item xs={4}>
                        <FormControl
                            fullWidth>
                            <InputLabel>Select OS</InputLabel>
                            <Select
                                name={'os'}
                                onChange={async (evt) => {
                                    await this.setState({os: evt.target.value});
                                    this.loadArray();

                                }}
                                styles={customStyles}
                                fullWidth={true}
                            >
                                <MenuItem value="mac">macOS</MenuItem>
                                <MenuItem value="windows">Windows</MenuItem>
                            </Select>
                        </FormControl>
                <form>
                    {((this.state.array) ?
                            <Grid container justify={"center"} >
                                <Grid style={{padding:20, }}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Pick a Spare</FormLabel>
                                        <RadioGroup aria-label="spare-option" name="spare-option"
                                                    onChange={this.handleChange}>
                                            {
                                                this.state.array.length && this.state.array.map((item) => {
                                                        return (
                                                            <FormControlLabel value={item.SN} control={<Radio />}
                                                                              label={item.model + ", S/N: " + item.SN +
                                                                              ", RAM: " + item.memory + ", Storage: " +
                                                                              item.storage}
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


                    <Grid container justify={"center"} style={{paddingBottom:20, }}>
                        <TextField
                            id="date"
                            label="date added"
                            type="date"
                            defaultValue="2020-01-01"
                            onChange={(event) =>
                            {this.setState({date: event.target.value})}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            name={'name'}
                            helperText="Employee Name"
                            margin="normal"
                            variant="outlined"
                            onChange={(event) =>
                            {this.setState({name: event.target.value})}}
                            fullWidth
                        />
                    </Grid>
                    <Grid>
                        <Button onClick={() => {this.submit()}} variant="contained">submit</Button>
                    </Grid>
                </form>
            </Grid>
            </Grid>

    )
    }

}