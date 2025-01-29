import Loading from "@components/loading/Loading";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import i18next from "@shared/i18n";
import { useUserStore } from "@stores/userStore";
import React, { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, type ClientLoaderFunctionArgs } from "react-router";
import { clientLoaderAuthGuard } from "../auth-guard";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtools,
  })),
);

const drawerWidth = 250;

const ListItems: React.FC = () => {
  const { t } = useTranslation();

  return [
    {
      text: t("dashboard__page_title"),
      to: `/${i18next.language}/dashboard`,
    },
    {
      text: t("my_account__page_title"),
      to: `/${i18next.language}/settings`,
    },
  ].map(({ text, to }, index) => (
    <ListItem key={text} disablePadding>
      <ListItemButton LinkComponent={Link} {...{ to }}>
        <ListItemIcon>
          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  ));
};

const DrawerContent: React.FC = () => {
  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItems />
      </List>
    </div>
  );
};

export const clientLoader = async ({
  params: _params,
}: ClientLoaderFunctionArgs) => {
  await clientLoaderAuthGuard(true);
  return {};
};

export default function Layout() {
  const { user } = useUserStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const container =
    window !== undefined ? () => window.document.body : undefined;

  if (!user) {
    return <Loading />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            nventive
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <DrawerContent />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <DrawerContent />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>

        <div style={{ marginTop: 100 }}>
          <Typography variant="caption" display="block">
            VERSION: {import.meta.env.VITE_VERSION_NUMBER}
          </Typography>
          <Typography variant="caption" display="block">
            API_URL: {import.meta.env.VITE_API_URL}
          </Typography>
        </div>

        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      </Box>
    </Box>
  );
}
