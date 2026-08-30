import { Navigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getSubject } from "../../content";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import TopicList from "../../components/TopicList/TopicList";
import { useProgress } from "../../hooks/useProgress";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function Subject() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const subject = subjectId ? getSubject(subjectId) : undefined;
  const { getSubjectCompletion } = useProgress();

  useDocumentMeta({
    title: subject?.title ?? "Subject",
    description: subject?.description ?? "",
    path: `/${subjectId ?? ""}`,
  });

  if (!subject) {
    return <Navigate to="/" replace />;
  }

  const completion = getSubjectCompletion(subject.topics.map((t) => t.id));

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        {subject.title}
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
        {subject.description}
      </Typography>

      <Box sx={{ maxWidth: 320, mb: 4 }}>
        <ProgressBar value={completion} />
      </Box>

      <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
        Topics
      </Typography>
      <TopicList subjectId={subject.id} topics={subject.topics} />
    </Box>
  );
}
