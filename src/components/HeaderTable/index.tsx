import React, { Fragment } from "react"
import { CardHeader, Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from "./headerTable.module.css"
import { useRouter } from "next/navigation";

interface Props {
    title: string;
    subheader: string;
    buttonBack: boolean;
}

export default function HeaderTable({ title, subheader, buttonBack }: Props) {
    const navigation = useRouter();
    return (
        <div className={styles.container} >
            {buttonBack && (
                <div>
                    <Fab 
                    size="small" 
                    
                    aria-label="back"
                    onClick={() => navigation.back()}>
                        <ArrowBackIcon />
                    </Fab></div>
            )}

            <CardHeader
                title={title}
                subheader={subheader}
                style={{ paddingBottom: 0 }}
            />
        </div>
    )
}