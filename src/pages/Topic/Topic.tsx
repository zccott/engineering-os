import { Navigate, useParams } from "react-router-dom";
import { getSubject, getTopic } from "../../content";
import TopicPageView from "../../components/TopicPage/TopicPage";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function Topic() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();

  const subject = subjectId ? getSubject(subjectId) : undefined;
  const topic = subjectId && topicId ? getTopic(subjectId, topicId) : undefined;

  useDocumentMeta({
    title: topic ? `${topic.title} (${subject?.title})` : "Topic",
    description: topic?.description ?? "",
    path: `/${subjectId ?? ""}/${topicId ?? ""}`,
  });

  if (!subject || !topic) {
    return <Navigate to={subject ? `/${subject.id}` : "/"} replace />;
  }

  return <TopicPageView subject={subject} topic={topic} />;
}
