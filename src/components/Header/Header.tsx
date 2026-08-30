import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useColorScheme } from "@mui/material/styles";
import SearchDialog from "../Search/SearchDialog";

interface HeaderProps {
  onMenuClick: () => void;
}

/** Top app bar: logo/home link, search, and the mobile menu toggle. */
export default function Header({ onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { mode, setMode } = useColorScheme();

  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { xs: "inline-flex", md: "none" }, mr: 0.5 }}
            aria-label="Open navigation"
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h3"
            component="button"
            onClick={() => navigate("/")}
            sx={{
              border: "none",
              background: "none",
              cursor: "pointer",
              p: 0,
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            EngineeringWiki
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Search">
            <IconButton onClick={() => setSearchOpen(true)} aria-label="Search">
              <SearchIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton onClick={toggleMode} aria-label="Toggle color mode">
              {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
