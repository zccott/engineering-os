import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { caseStudies } from "../../content/case-studies";
import type { CaseStudy } from "../../types/caseStudy";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

const DIFFICULTY_COLOR: Record<CaseStudy["difficulty"], "success" | "warning" | "error"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "error",
};

/** Overview of every "Real System Design" case study. */
export default function CaseStudiesHome() {
  const navigate = useNavigate();

  useDocumentMeta({
    title: "Real System Designs",
    description:
      "Full worked system design walkthroughs for real products — requirements, capacity estimation, high-level design, deep dives, and trade-offs.",
    path: "/case-studies",
  });

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        Real System Designs
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Full worked design walkthroughs for real products — requirements,
        capacity estimation, high-level design, deep dives, and trade-offs,
        the way a system design interview would go.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {caseStudies.map((caseStudy) => (
          <Box
            key={caseStudy.id}
            onClick={() => navigate(`/case-studies/${caseStudy.id}`)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              cursor: "pointer",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Design {caseStudy.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {caseStudy.summary}
              </Typography>
            </Box>
            <Chip
              label={caseStudy.difficulty}
              size="small"
              color={DIFFICULTY_COLOR[caseStudy.difficulty]}
              variant="outlined"
              sx={{ flexShrink: 0 }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
