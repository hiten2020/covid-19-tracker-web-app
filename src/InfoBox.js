import React from 'react'
import {Card,CardContent,Typography} from "@material-ui/core"
import "./InfoBox.css";

function InfoBox({title,cases,active,isRed,total,...props}) {
    return (
        <Card  onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"} `} >
            <CardContent>
                {/* Title  i.e Coronavirus cases*/}
                    <Typography className="infoBox__title" color="textSecondary" >
                        {title}
                    </Typography>
                {/* Number of cases i.e +120k*/}
                    <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"} `} >{cases}</h2>
                {/* total cases i.e 1.2M */}
                <Typography className="infoBox__total" color="textSecondary" >
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
