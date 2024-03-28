import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react'

interface WarningModalProps {
  decline: () => void;
  accept: () => void;
  openModal: boolean;
  warningText: string;
}

export const AcceptDeclineModal = ({ decline, accept, openModal, warningText }: WarningModalProps) => {
  return (
    <Dialog open={openModal} onClose={decline}>
      <DialogTitle>
        {warningText}
      </DialogTitle>
      <DialogContent>
        <Button onClick={accept}>Accept</Button>
        <Button onClick={decline}>Decline</Button>
      </DialogContent>
    </Dialog>
  )
}
