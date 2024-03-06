import React, { Fragment } from "react"
import { CardHeader } from '@mui/material';

interface Props {
    title: string;
    subheader: string;
}

export default function HeaderTable({ title, subheader }: Props) {
    return (
        <Fragment>
            <CardHeader
                title={title}
                subheader={subheader}
                style={{ paddingBottom: 0, marginLeft: 16 }}
            />
        </Fragment>
    )
}