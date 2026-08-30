import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { subjects } from "../../content";
import { subjectMeta } from "../../content/subjectMeta";

interface SidebarProps {
  /** Called after a navigation click — used to close the mobile Drawer. */
  onNavigate?: () => void;
}

export const SIDEBAR_WIDTH = 240;

function NavRow({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <ListItemButton
      selected={active}
      onClick={onClick}
      sx={[
        {
          borderRadius: 1,
          mb: 0.25,
          "&.Mui-selected": {
            bgcolor: "rgba(37, 99, 235, 0.08)",
            "&:hover": { bgcolor: "rgba(37, 99, 235, 0.12)" },
          },
        },
        (theme) =>
          theme.applyStyles("dark", {
            "&.Mui-selected": {
              bgcolor: "rgba(96, 165, 250, 0.16)",
              "&:hover": { bgcolor: "rgba(96, 165, 250, 0.22)" },
            },
          }),
      ]}
    >
      <ListItemIcon sx={{ minWidth: 36, color: active ? "primary.main" : "text.secondary" }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        slotProps={{
          primary: {
            sx: { fontWeight: active ? 600 : 500, color: active ? "primary.main" : "text.primary" },
          },
        }}
      />
    </ListItemButton>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{ color: "text.disabled", fontWeight: 700, letterSpacing: 1, pl: 1.75, mt: 2, mb: 0.5, display: "block" }}
    >
      {children}
    </Typography>
  );
}

/** Primary app navigation. Rendered as a permanent panel on desktop and inside a Drawer on mobile. */
export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", py: 2, px: 1.5 }}>
      <Typography
        variant="overline"
        sx={{ color: "text.disabled", fontWeight: 700, letterSpacing: 1, pl: 1.75, mb: 1, display: "block" }}
      >
        Engineering OS
      </Typography>

      <List disablePadding>
        <NavRow
          icon={<HomeOutlinedIcon fontSize="small" />}
          label="Home"
          active={isActive("/")}
          onClick={() => go("/")}
        />
      </List>

      <SectionLabel>Learn</SectionLabel>
      <List disablePadding>
        {subjects.map((subject) => {
          const meta = subjectMeta[subject.id];
          const Icon = meta.icon;
          return (
            <NavRow
              key={subject.id}
              icon={<Icon fontSize="small" />}
              label={subject.title}
              active={isActive(meta.path)}
              onClick={() => go(meta.path)}
            />
          );
        })}
        <NavRow
          icon={<ChecklistOutlinedIcon fontSize="small" />}
          label="Problems"
          active={isActive("/problems")}
          onClick={() => go("/problems")}
        />
        <NavRow
          icon={<DomainOutlinedIcon fontSize="small" />}
          label="Real System Designs"
          active={isActive("/case-studies")}
          onClick={() => go("/case-studies")}
        />
      </List>

      <SectionLabel>Other</SectionLabel>
      <List disablePadding>
        <NavRow
          icon={<TrendingUpOutlinedIcon fontSize="small" />}
          label="Progress"
          active={isActive("/progress")}
          onClick={() => go("/progress")}
        />
        <NavRow
          icon={<BookmarkBorderOutlinedIcon fontSize="small" />}
          label="Bookmarks"
          active={isActive("/bookmarks")}
          onClick={() => go("/bookmarks")}
        />
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ mt: 2 }} />
      <Typography variant="caption" sx={{ color: "text.disabled", pl: 1.75, pt: 1.5 }}>
        Learn once. Never start from zero again.
      </Typography>
    </Box>
  );
}
