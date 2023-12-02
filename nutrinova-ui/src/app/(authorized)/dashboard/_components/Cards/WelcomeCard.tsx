'use client'
import React from 'react';
import { Typography } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { PatientContext } from '@/components/providers/PatientProvider';
import GenericCard from './GenericCard';

interface WelcomeCardProps {
  caretakerName?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ caretakerName }) => {
  const patientContext = React.useContext(PatientContext);
  const patientName = patientContext?.selectedPatientName ?? '';
  return (
    <GenericCard title={"Hello" + caretakerName}>
      <Typography variant="body1" color="text.secondary">
        You&apos;re caring for {patientName}. Let&apos;s ensure their health is on track.
      </Typography>
      <LocalHospitalIcon sx={{ marginTop: 1, color: 'green' }} />
    </GenericCard>
  );
};

export default WelcomeCard;
