import { Backdrop } from "@mui/material";
import CenteredSpinner from "./CenteredSpinner";

export interface CenteredSpinnerWithBackdropProps {
    message?: string;
}

export default function CenteredSpinnerWithBackdrop({ message }: CenteredSpinnerWithBackdropProps) {
    return (
        <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CenteredSpinner message={message} />
        </Backdrop>
    );
}