import { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import RichText, { InlineText } from "./RichText";
import CodeBlock from "../CodeBlock/CodeBlock";
import InterviewQuestions from "../InterviewQuestions/InterviewQuestions";
import RelatedTopics from "../RelatedTopics/RelatedTopics";
import { useProgress } from "../../hooks/useProgress";
import { useBookmarks } from "../../hooks/useBookmarks";
import { getAdjacentTopics } from "../../content";
import { getProblemCategoriesForTopic } from "../../content/dsaProblemLinks";
import { getCategory, getProblemCount } from "../../content/problems";
import { getCaseStudiesForTopic } from "../../content/case-studies";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import type { Subject, Topic } from "../../types/content";

interface TopicPageProps {
  subject: Subject;
  topic: Topic;
}

const LEVEL_LABEL: Record<Topic["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const DIFFICULTY_COLOR: Record<
  Topic["exercises"][number]["difficulty"],
  "success" | "warning" | "error"
> = {
  Easy: "success",
  Medium: "warning",
  Hard: "error",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h2" component="h2" sx={{ mt: 5, mb: 1.5 }}>
      {children}
    </Typography>
  );
}

interface AdjacentTopicCardProps {
  direction: "prev" | "next";
  topic?: Topic;
  onClick: () => void;
}

/** A "Previous topic" / "Next topic" nav card, used below the topic content. */
function AdjacentTopicCard({ direction, topic, onClick }: AdjacentTopicCardProps) {
  if (!topic) return <Box sx={{ flex: 1 }} />;

  const isNext = direction === "next";

  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: isNext ? "flex-end" : "flex-start",
        textAlign: isNext ? "right" : "left",
        gap: 0.5,
        p: 2,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { borderColor: "primary.main" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
        {!isNext && <ArrowBackIcon fontSize="small" />}
        <Typography variant="caption">{isNext ? "Next" : "Previous"}</Typography>
        {isNext && <ArrowForwardIcon fontSize="small" />}
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {topic.title}
      </Typography>
    </Box>
  );
}

/**
 * Renders the full, consistent topic template: what it is, an analogy,
 * an example, how it works, why it exists, common mistakes, practice
 * exercises, interview questions, and related topics.
 */
export default function TopicPage({ subject, topic }: TopicPageProps) {
  const navigate = useNavigate();
  const { getStatus, markCompleted, recordVisit } = useProgress();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    recordVisit(subject.id, topic.id);
    // Re-run only when the topic actually changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject.id, topic.id]);

  const status = getStatus(topic.id);
  const bookmarked = isBookmarked(topic.id);
  const { prev, next } = getAdjacentTopics(subject.id, topic.id);
  const practiceCategories =
    subject.id === "dsa"
      ? getProblemCategoriesForTopic(topic.id)
          .map((id) => getCategory(id))
          .filter((c): c is NonNullable<typeof c> => Boolean(c))
      : [];
  const relatedCaseStudies =
    subject.id === "system-design" ? getCaseStudiesForTopic(topic.id) : [];

  return (
    <Box sx={{ maxWidth: 850, mx: "auto" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link component={RouterLink} to={`/${subject.id}`} underline="hover" color="inherit">
          {subject.title}
        </Link>
        <Typography color="text.primary">{topic.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
            {topic.title}
          </Typography>
          <Chip
            label={LEVEL_LABEL[topic.level]}
            size="small"
            variant="outlined"
            sx={{ mb: 1 }}
          />
        </Box>
        <Tooltip title={bookmarked ? "Remove bookmark" : "Bookmark this topic"}>
          <IconButton onClick={() => toggleBookmark(subject.id, topic.id)} sx={{ mt: 0.5 }}>
            {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderOutlinedIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
        <InlineText text={topic.description} />
      </Typography>

      {topic.prerequisites && topic.prerequisites.length > 0 && (
        <Box sx={{ mt: 2.5 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 600, mb: 1 }}
          >
            Before this, make sure you understand
          </Typography>
          <RelatedTopics subjectId={subject.id} topicIds={topic.prerequisites} />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <SectionHeading>What is it?</SectionHeading>
      <RichText text={topic.explanation} />

      <SectionHeading>Explain Like I'm 10</SectionHeading>
      <Box
        sx={[
          {
            p: 2,
            borderRadius: 1.5,
            bgcolor: "rgba(37, 99, 235, 0.08)",
            border: "1px solid",
            borderColor: "divider",
          },
          (theme) => theme.applyStyles("dark", { bgcolor: "rgba(96, 165, 250, 0.16)" }),
        ]}
      >
        <Typography variant="body1" sx={{ fontStyle: "italic" }}>
          <InlineText text={topic.analogy} />
        </Typography>
      </Box>

      {topic.examples.length > 0 && (
        <>
          <SectionHeading>Simple Example</SectionHeading>
          {topic.examples.map((example, i) => (
            <CodeBlock key={i} example={example} />
          ))}
        </>
      )}

      <SectionHeading>How It Works</SectionHeading>
      <RichText text={topic.howItWorks} />
      {topic.diagram && (
        <Box
          component="pre"
          sx={[
            {
              mt: 2,
              p: 2,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
              overflowX: "auto",
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: "0.8rem",
              lineHeight: 1.6,
              textAlign: "center",
              color: "text.secondary",
            },
            (theme) => theme.applyStyles("dark", { bgcolor: "grey.900" }),
          ]}
        >
          {topic.diagram}
        </Box>
      )}

      <SectionHeading>Why Does This Exist?</SectionHeading>
      <RichText text={topic.whyItExists} />

      <SectionHeading>When To Use It</SectionHeading>
      <RichText text={topic.whenToUse} />

      <SectionHeading>When NOT To Use It</SectionHeading>
      <RichText text={topic.whenNotToUse} />

      {topic.commonMistakes.length > 0 && (
        <>
          <SectionHeading>Common Mistakes</SectionHeading>
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {topic.commonMistakes.map((mistake, i) => (
              <Typography key={i} component="li" variant="body1" sx={{ mb: 0.75 }}>
                <InlineText text={mistake} />
              </Typography>
            ))}
          </Box>
        </>
      )}

      {topic.exercises.length > 0 && (
        <>
          <SectionHeading>Practice</SectionHeading>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {topic.exercises.map((exercise, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                <Chip
                  label={exercise.difficulty}
                  size="small"
                  color={DIFFICULTY_COLOR[exercise.difficulty]}
                  variant="outlined"
                  sx={{ flexShrink: 0 }}
                />
                <Typography variant="body1">
                  <InlineText text={exercise.prompt} />
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {practiceCategories.length > 0 && (
        <>
          <SectionHeading>Practice Problems</SectionHeading>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
            Ready to apply this? Try real coding problems that use this pattern.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {practiceCategories.map((category) => (
              <Box
                key={category.id}
                onClick={() => navigate(`/problems/${category.id}`)}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  cursor: "pointer",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {category.title}
                </Typography>
                <Chip
                  label={`${getProblemCount(category.id)} problems`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            ))}
          </Box>
        </>
      )}

      {relatedCaseStudies.length > 0 && (
        <>
          <SectionHeading>Real-World Examples</SectionHeading>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
            See this idea used in a full system design walkthrough.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {relatedCaseStudies.map((caseStudy) => (
              <Box
                key={caseStudy.id}
                onClick={() => navigate(`/case-studies/${caseStudy.id}`)}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <DomainOutlinedIcon fontSize="small" sx={{ color: "text.secondary", flexShrink: 0 }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Design {caseStudy.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {topic.interviewQuestions.length > 0 && (
        <>
          <SectionHeading>Interview Questions</SectionHeading>
          <InterviewQuestions questions={topic.interviewQuestions} />
        </>
      )}

      {topic.relatedTopics.length > 0 && (
        <>
          <SectionHeading>Related Topics</SectionHeading>
          <RelatedTopics subjectId={subject.id} topicIds={topic.relatedTopics} />
        </>
      )}

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Button
          variant={status === "completed" ? "outlined" : "contained"}
          startIcon={status === "completed" ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
          onClick={() => markCompleted(topic.id)}
          size="large"
        >
          {status === "completed" ? "Completed" : "Mark as completed"}
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <AdjacentTopicCard
          direction="prev"
          topic={prev}
          onClick={() => prev && navigate(`/${subject.id}/${prev.id}`)}
        />
        <AdjacentTopicCard
          direction="next"
          topic={next}
          onClick={() => next && navigate(`/${subject.id}/${next.id}`)}
        />
      </Box>
    </Box>
  );
}
