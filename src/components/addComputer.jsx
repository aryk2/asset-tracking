import React from "react";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';


const SHEETID = '1c0P99C3BHUSCeK4N914pwfIEfy-1KP6E4q2uWWVGgn0';

export default class AddComputer extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            SN: null,
            model: null,
            memory: null,
            storage: null,
            date: null,
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

    submit() {
        let values = [
            [
                this.state.SN, this.state.model, this.state.date,
                this.state.memory, this.state.storage, "new system"
            ]
        ];

        if(String(this.state.model).toUpperCase().startsWith("MAC"))
            this.appendUser(values, 'spare macs!A2:F', 'USER_ENTERED');
        else
            this.appendUser(values, 'spare windows!A2:F', 'USER_ENTERED');


    }

    render() {
        return (
            <Grid>
                <form>
                    <Grid container justify={"center"} >
                        <Grid style={{padding:10, }}>
                            <TextField
                                name={'SN'}
                                helperText="Serial Number"
                                margin="normal"
                                variant="outlined"
                                onChange={(event) =>
                                {this.setState({SN: event.target.value})}}
                                fullWidth
                            />
                        </Grid>
                        <Grid style={{padding:10, }}>
                            <TextField
                                name={'model'}
                                helperText="Computer Model"
                                margin="normal"
                                variant="outlined"
                                onChange={(event) =>
                                {this.setState({model: event.target.value})}}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify={"center"} >
                        <Grid style={{padding:10, }}>
                            <TextField
                                name={'memory'}
                                helperText="Memory Size"
                                margin="normal"
                                variant="outlined"
                                onChange={(event) =>
                                {this.setState({memory: event.target.value})}}
                                fullWidth
                            />
                        </Grid>
                        <Grid style={{padding:10, }}>
                            <TextField
                                name={'storage'}
                                helperText="Storage Size"
                                margin="normal"
                                variant="outlined"
                                onChange={(event) =>
                                {this.setState({storage: event.target.value})}}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
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
                        <Button onClick={() => {this.submit()}} variant="contained">submit</Button>
                    </Grid>
                </form>
            </Grid>

        )
    }

}
