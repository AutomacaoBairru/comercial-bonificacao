import React, { Fragment } from "react"
import styles from './cardtitulo.module.css'
import { useRouter } from "next/navigation";


import { IconButton } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


interface Props {
    children: React.ReactNode;
    buttonGoBack: boolean;
}

export default function CardTitulo({ children, buttonGoBack }: Props) {
    const router = useRouter()
    return (
        <Fragment>
            <div className={styles.container}>
                {buttonGoBack &&
                    <IconButton aria-label="delete" size="large" onClick={() => (router.back())}>
                        <ArrowBackIcon style={{ color: "white" }} />
                    </IconButton>}
                <h2 className={styles.title}>{children}</h2>
            </div>
        </Fragment>
    )
}