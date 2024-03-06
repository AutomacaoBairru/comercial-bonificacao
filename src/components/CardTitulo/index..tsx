import React, { Fragment } from "react"
import styles from './cardtitulo.module.css'

interface Props {
    children: React.ReactNode
}

export default function CardTitulo({ children }: Props) {
    return (
        <Fragment>
            <div className={styles.container}>
                <h2>{children}</h2>
            </div>
        </Fragment>
    )
}