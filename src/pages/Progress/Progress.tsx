import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { subjects } from "../../content";
import { subjectMeta } from "../../content/subjectMeta";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import TopicList from "../../components/TopicList/TopicList";
import { useProgress } from "../../hooks/useProgress";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

/** Overview of completion across every subject. */
export default function Progress() {
  const { getSubjectCompletion } = useProgress();

  useDocumentMeta({
    title: "Progress",
    description: "Your local, browser-only progress across every subject.",
    path: "/progress",
    noindex: true,
  });

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        Progress
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        How far along you are in each subject.
      </Typography>

      {subjects.map((subject) => {
        const meta = subjectMeta[subject.id];
        const Icon = meta.icon;
        const completion = getSubjectCompletion(subject.topics.map((t) => t.id));

        return (
          <Box key={subject.id} sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <Icon sx={{ color: "primary.main" }} fontSize="small" />
              <Typography variant="h2" component="h2">
                {subject.title}
              </Typography>
            </Box>
            <Box sx={{ maxWidth: 320, mb: 3 }}>
              <ProgressBar value={completion} />
            </Box>
            <TopicList subjectId={subject.id} topics={subject.topics} />
          </Box>
        );
      })}
    </Box>
  );
}
