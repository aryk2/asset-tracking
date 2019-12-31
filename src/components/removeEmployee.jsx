import React from "react";
import Typography from '@material-ui/core/Typography';


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
        };

    }

    render() {
        return (
            <Typography>nothing here </Typography>
        )
    }
}