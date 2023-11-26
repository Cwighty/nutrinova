import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography, Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { useGetAllPatientsQuery } from "../patientHooks";
import { AddCircleOutline } from "@mui/icons-material";
import CreatePatientForm from "./CreatePatientForm";

export const PatientSelector = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const { data: patients, isLoading: patientsAreLoading } = useGetAllPatientsQuery();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" />
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
        {patientsAreLoading && <MenuItem><Typography textAlign="center">Loading...</Typography></MenuItem>}
        {patients?.map((p) => (
          <MenuItem key={p.id} onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{p.firstname} {p.lastname}</Typography>
          </MenuItem>
        ))}
        <MenuItem>
          <Typography onClick={() => setOpen(true)}> <AddCircleOutline /></Typography>
        </MenuItem>
      </Menu>
      <Dialog open={open} >
        <DialogTitle>Add Patient</DialogTitle>
        <DialogContent>
          <CreatePatientForm />
        </DialogContent>
      </Dialog>
    </>
  );

};