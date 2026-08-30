import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { subjects, getTopic } from "../../content";
import { subjectMeta } from "../../content/subjectMeta";
import { useProgress } from "../../hooks/useProgress";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import type { ProgressStatus } from "../../types/content";

const STATUS_LABEL: Record<ProgressStatus, string> = {
  "not-started": "Not started",
  learning: "In progress",
  completed: "Completed",
  "needs-review": "Needs review",
};

export default function Home() {
  const navigate = useNavigate();
  const { getRecent, getStatus, getSubjectCompletion } = useProgress();

  useDocumentMeta({
    title: "EngineeringWiki — Learn once. Understand deeply.",
    description:
      "A free, structured software-engineering knowledge base: JavaScript, TypeScript, DSA, system design, backend, databases, and more — beginner to advanced.",
    path: "/",
  });

  const recent = getRecent(3);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        EngineeringWiki
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 5 }}>
        My personal software engineering knowledge base.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
          mb: 6,
        }}
      >
        {subjects.map((subject) => {
          const meta = subjectMeta[subject.id];
          const Icon = meta.icon;
          const completion = getSubjectCompletion(subject.topics.map((t) => t.id));

          return (
            <Box
              key={subject.id}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Icon sx={{ color: "primary.main", mb: 1.5 }} />
              <Typography variant="h2" component="h2" sx={{ mb: 0.75 }}>
                {subject.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, flexGrow: 1 }}>
                {subject.description}
              </Typography>
              {completion > 0 && (
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 1.5 }}>
                  {completion}% complete
                </Typography>
              )}
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(meta.path)}
                sx={{ alignSelf: "flex-start" }}
              >
                Continue Learning
              </Button>
            </Box>
          );
        })}
      </Box>

      {recent.length > 0 && (
        <Box>
          <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
            Continue Learning
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {recent.map((entry) => {
              const topic = getTopic(entry.subjectId, entry.topicId);
              const subject = subjects.find((s) => s.id === entry.subjectId);
              if (!topic || !subject) return null;
              const status = getStatus(entry.topicId);
              const completion =
                status === "completed" ? 100 : status === "learning" ? 50 : 0;

              return (
                <Box
                  key={`${entry.subjectId}/${entry.topicId}`}
                  onClick={() => navigate(`/${entry.subjectId}/${entry.topicId}`)}
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
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {subject.title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {topic.title}
                    </Typography>
                  </Box>
                  <Chip
                    label={STATUS_LABEL[status]}
                    size="small"
                    color={status === "completed" ? "primary" : "default"}
                    variant={status === "completed" ? "filled" : "outlined"}
                  />
                  {completion > 0 && completion < 100 && (
                    <Typography variant="caption" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                      {completion}% complete
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
