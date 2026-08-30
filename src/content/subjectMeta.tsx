import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import ArchitectureOutlinedIcon from "@mui/icons-material/ArchitectureOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import type { SubjectId } from "../types/content";

export interface SubjectMeta {
  id: SubjectId;
  path: string;
  icon: SvgIconComponent;
}

// Presentation metadata for each subject (icon + route), kept separate from
// the pure content data so content/ stays UI-agnostic.
export const subjectMeta: Record<SubjectId, SubjectMeta> = {
  javascript: { id: "javascript", path: "/javascript", icon: CodeOutlinedIcon },
  typescript: { id: "typescript", path: "/typescript", icon: IntegrationInstructionsOutlinedIcon },
  dsa: { id: "dsa", path: "/dsa", icon: AccountTreeOutlinedIcon },
  "web-fundamentals": { id: "web-fundamentals", path: "/web-fundamentals", icon: LanguageOutlinedIcon },
  backend: { id: "backend", path: "/backend", icon: DnsOutlinedIcon },
  databases: { id: "databases", path: "/databases", icon: StorageOutlinedIcon },
  "system-design": {
    id: "system-design",
    path: "/system-design",
    icon: ArchitectureOutlinedIcon,
  },
  "software-architecture": {
    id: "software-architecture",
    path: "/software-architecture",
    icon: HubOutlinedIcon,
  },
};
