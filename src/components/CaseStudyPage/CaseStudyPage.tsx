import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import RichText, { InlineText } from "../TopicPage/RichText";
import { getTopic } from "../../content";
import type { CaseStudy } from "../../types/caseStudy";

interface CaseStudyPageProps {
  caseStudy: CaseStudy;
}

const DIFFICULTY_COLOR: Record<CaseStudy["difficulty"], "success" | "warning" | "error"> = {
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

function DiagramBlock({ diagram }: { diagram: string }) {
  return (
    <Box
      component="pre"
      sx={[
        {
          mt: 2,
          mb: 2,
          p: 2,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
          overflowX: "auto",
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          fontSize: "0.8rem",
          lineHeight: 1.6,
          textAlign: "center",
          color: "text.secondary",
        },
        (theme) => theme.applyStyles("dark", { bgcolor: "grey.900" }),
      ]}
    >
      {diagram}
    </Box>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 3 }}>
      {items.map((item, i) => (
        <Typography key={i} component="li" variant="body1" sx={{ mb: 0.75 }}>
          <InlineText text={item} />
        </Typography>
      ))}
    </Box>
  );
}

/**
 * Renders a full "Real System Design" case study: requirements, capacity
 * estimation, API design, data model, high-level design, deep dives into
 * the hardest parts, bottlenecks/scaling, and explicit trade-offs — the
 * shape of a real system design interview walkthrough.
 */
export default function CaseStudyPage({ caseStudy }: CaseStudyPageProps) {
  const navigate = useNavigate();

  const relatedTopics = (caseStudy.relatedTopics ?? [])
    .map((id) => getTopic("system-design", id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <Box sx={{ maxWidth: 850, mx: "auto" }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/case-studies" underline="hover" color="inherit">
          Real System Designs
        </Link>
        <Typography color="text.primary">{caseStudy.title}</Typography>
      </Breadcrumbs>

      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        Design {caseStudy.title}
      </Typography>
      <Chip
        label={caseStudy.difficulty}
        size="small"
        color={DIFFICULTY_COLOR[caseStudy.difficulty]}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
        {caseStudy.summary}
      </Typography>

      <SectionHeading>The Problem</SectionHeading>
      <RichText text={caseStudy.problemStatement} />

      {(caseStudy.requirements.functional.length > 0 ||
        caseStudy.requirements.nonFunctional.length > 0) && (
        <>
          <SectionHeading>Requirements</SectionHeading>
          {caseStudy.requirements.functional.length > 0 && (
            <>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Functional
              </Typography>
              <BulletList items={caseStudy.requirements.functional} />
            </>
          )}
          {caseStudy.requirements.nonFunctional.length > 0 && (
            <>
              <Typography variant="body1" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Non-Functional
              </Typography>
              <BulletList items={caseStudy.requirements.nonFunctional} />
            </>
          )}
        </>
      )}

      {caseStudy.capacityEstimation.length > 0 && (
        <>
          <SectionHeading>Capacity Estimation</SectionHeading>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {caseStudy.capacityEstimation.map((estimate, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {estimate.label}
                  </Typography>
                  {estimate.note && (
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      <InlineText text={estimate.note} />
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  {estimate.value}
                </Typography>
              </Box>
            ))}
          </Box>
          {caseStudy.capacityNotes && <RichText text={caseStudy.capacityNotes} />}
        </>
      )}

      {caseStudy.apiDesign && caseStudy.apiDesign.length > 0 && (
        <>
          <SectionHeading>API Design</SectionHeading>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {caseStudy.apiDesign.map((endpoint, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                <Chip label={endpoint.method} size="small" sx={{ fontFamily: "monospace", flexShrink: 0 }} />
                <Typography
                  component="code"
                  sx={{ fontFamily: "monospace", fontSize: "0.9em", flexShrink: 0 }}
                >
                  {endpoint.path}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <InlineText text={endpoint.description} />
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {caseStudy.dataModel && (
        <>
          <SectionHeading>Data Model</SectionHeading>
          <RichText text={caseStudy.dataModel} />
        </>
      )}

      <SectionHeading>High-Level Design</SectionHeading>
      <RichText text={caseStudy.highLevelDesign} />
      {caseStudy.highLevelDiagram && <DiagramBlock diagram={caseStudy.highLevelDiagram} />}

      {caseStudy.deepDives.length > 0 && (
        <>
          <SectionHeading>Deep Dives</SectionHeading>
          {caseStudy.deepDives.map((dive, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Typography variant="h3" component="h3" sx={{ mb: 1 }}>
                {dive.title}
              </Typography>
              <RichText text={dive.explanation} />
              {dive.diagram && <DiagramBlock diagram={dive.diagram} />}
            </Box>
          ))}
        </>
      )}

      <SectionHeading>Bottlenecks &amp; Scaling</SectionHeading>
      <RichText text={caseStudy.bottlenecksAndScaling} />

      {caseStudy.tradeOffs.length > 0 && (
        <>
          <SectionHeading>Trade-offs</SectionHeading>
          {caseStudy.tradeOffs.map((tradeOff, i) => (
            <Box key={i} sx={{ mb: 2.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                <InlineText text={tradeOff.decision} />
              </Typography>
              <RichText text={tradeOff.explanation} />
            </Box>
          ))}
        </>
      )}

      {caseStudy.interviewTips && caseStudy.interviewTips.length > 0 && (
        <>
          <SectionHeading>Interview Tips</SectionHeading>
          <BulletList items={caseStudy.interviewTips} />
        </>
      )}

      {relatedTopics.length > 0 && (
        <>
          <SectionHeading>Related Concepts</SectionHeading>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {relatedTopics.map((topic) => (
              <Chip
                key={topic.id}
                label={topic.title}
                variant="outlined"
                onClick={() => navigate(`/system-design/${topic.id}`)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </>
      )}

      <Divider sx={{ my: 4 }} />
    </Box>
  );
}
