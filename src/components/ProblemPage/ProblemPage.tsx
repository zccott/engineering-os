import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { InlineText } from "../TopicPage/RichText";
import RichText from "../TopicPage/RichText";
import CodeBlock from "../CodeBlock/CodeBlock";
import InterviewQuestions from "../InterviewQuestions/InterviewQuestions";
import RelatedProblems from "../RelatedTopics/RelatedProblems";
import { useProblemProgress } from "../../hooks/useProblemProgress";
import type { Problem, ProblemCategory } from "../../types/problem";

interface ProblemPageProps {
  category: ProblemCategory;
  problem: Problem;
}

const DIFFICULTY_COLOR: Record<Problem["difficulty"], "success" | "warning" | "error"> = {
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

function ExampleBox({ example, index }: { example: Problem["examples"][number]; index: number }) {
  const CODE_FONT_STACK =
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';

  return (
    <Box
      sx={[
        {
          p: 2,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
          mb: 1.5,
        },
        (theme) => theme.applyStyles("dark", { bgcolor: "grey.900" }),
      ]}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        Example {index + 1}
      </Typography>
      <Typography
        component="pre"
        variant="body2"
        sx={{ fontFamily: CODE_FONT_STACK, m: 0, whiteSpace: "pre-wrap", overflowX: "auto" }}
      >
        Input: {example.input}
        {"\n"}Output: {example.output}
      </Typography>
      {example.explanation && (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          <InlineText text={example.explanation} />
        </Typography>
      )}
    </Box>
  );
}

/**
 * Renders a single DSA problem: statement, examples, constraints, hints,
 * an approach overview, one or more solutions (brute force -> optimal),
 * and related problems.
 */
export default function ProblemPage({ category, problem }: ProblemPageProps) {
  const { isSolved, toggleSolved } = useProblemProgress();
  const solved = isSolved(problem.id);

  return (
    <Box sx={{ maxWidth: 850, mx: "auto" }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/problems" underline="hover" color="inherit">
          Problems
        </Link>
        <Link component={RouterLink} to={`/problems/${category.id}`} underline="hover" color="inherit">
          {category.title}
        </Link>
        <Typography color="text.primary">{problem.title}</Typography>
      </Breadcrumbs>

      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        {problem.title}
      </Typography>
      <Chip label={problem.difficulty} size="small" color={DIFFICULTY_COLOR[problem.difficulty]} variant="outlined" sx={{ mb: 2 }} />

      <RichText text={problem.description} />

      {problem.examples.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {problem.examples.map((example, i) => (
            <ExampleBox key={i} example={example} index={i} />
          ))}
        </Box>
      )}

      {problem.constraints && problem.constraints.length > 0 && (
        <>
          <Typography variant="body2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
            Constraints
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {problem.constraints.map((c, i) => (
              <Typography key={i} component="li" variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                <InlineText text={c} />
              </Typography>
            ))}
          </Box>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <SectionHeading>How To Think About It</SectionHeading>
      <RichText text={problem.approachOverview} />

      {problem.hints && problem.hints.length > 0 && (
        <>
          <SectionHeading>Hints</SectionHeading>
          <InterviewQuestions
            questions={problem.hints.map((hint, i) => ({ question: `Hint ${i + 1}`, answer: hint }))}
          />
        </>
      )}

      {problem.solutions.map((solution, i) => (
        <Box key={i}>
          <SectionHeading>
            Solution {problem.solutions.length > 1 ? `${i + 1}: ` : ""}
            {solution.approach}
          </SectionHeading>
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
            <Chip label={`Time: ${solution.timeComplexity}`} size="small" variant="outlined" />
            <Chip label={`Space: ${solution.spaceComplexity}`} size="small" variant="outlined" />
          </Box>
          <RichText text={solution.explanation} />
          <CodeBlock
            example={{ code: solution.code, walkthrough: solution.walkthrough }}
            testCases={problem.examples}
          />
        </Box>
      ))}

      {problem.relatedProblems && problem.relatedProblems.length > 0 && (
        <>
          <SectionHeading>Related Problems</SectionHeading>
          <RelatedProblems categoryId={category.id} problemIds={problem.relatedProblems} />
        </>
      )}

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Button
          variant={solved ? "outlined" : "contained"}
          startIcon={solved ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
          onClick={() => toggleSolved(problem.id)}
          size="large"
        >
          {solved ? "Solved" : "Mark as solved"}
        </Button>
      </Box>
    </Box>
  );
}
