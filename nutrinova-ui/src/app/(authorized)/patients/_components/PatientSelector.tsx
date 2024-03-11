import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography, Divider } from "@mui/material";
import React, { useContext } from "react";
import { PatientContext } from "@/components/providers/PatientProvider";
import { Patient } from "../_models/patient";
import { useRouter } from "next/navigation";
import { Settings } from "@mui/icons-material";

export const PatientSelector = () => {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const { patients, selectedPatient, setSelectedPatient, isLoading, isError } = useContext(PatientContext);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    handleCloseUserMenu();
  }

  const stringAvatar = (name: string) => {
    return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0] ?? ""}`,
    };
  }

  const patientName = `${selectedPatient?.firstname} ${selectedPatient?.lastname}`;
  return (
    <>
      <Typography variant="button" sx={{ mx: 2 }}>{selectedPatient ? patientName : <></>}</Typography>
      <Tooltip title="Select a patient to care for">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          {selectedPatient ? <Avatar src={`${selectedPatient.base64image}`} {...stringAvatar(patientName)} /> : <Avatar />}
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {isLoading && <MenuItem><Typography textAlign="center">Loading...</Typography></MenuItem>}
        {isError && <MenuItem><Typography textAlign="center">Error loading patients</Typography></MenuItem>}
        {patients?.map((p) => (
          <MenuItem key={p.id} onClick={handleCloseUserMenu}>
            <Typography textAlign="center" onClick={() => handleSelectPatient(p)}>{p.firstname} {p.lastname}</Typography>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem>
          <Settings sx={{ mr: 1 }} />
          <Typography textAlign="center" onClick={() => {
            router.push("/patients")
            handleCloseUserMenu()
          }
          }>Manage Patients </Typography>
        </MenuItem>
      </Menu>
    </>
  );

};