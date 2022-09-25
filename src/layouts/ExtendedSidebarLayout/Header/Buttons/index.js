import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import HeaderNotifications from './Notifications';
// import LanguageSwitcher from './LanguageSwitcher';
// import Chat from './Chat';
import { setSidebarMode } from 'src/slices/theme';

function HeaderButtons() {
  const dispatch = useDispatch();
  const sidebarMode = useSelector((state) => state.theme.sidebarMode);

  const changeSidebarMode = () => {
    dispatch(setSidebarMode(!sidebarMode));
  };

  return (
    <Box>
      <HeaderNotifications />
      {/* <LanguageSwitcher /> */}
      {/* <Chat /> */}
      <Button onClick={() => changeSidebarMode()}>Switch</Button>
    </Box>
  );
}

export default HeaderButtons;
