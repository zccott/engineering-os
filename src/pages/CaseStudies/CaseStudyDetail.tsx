import { Navigate, useParams } from "react-router-dom";
import { getCaseStudy } from "../../content/case-studies";
import CaseStudyPageView from "../../components/CaseStudyPage/CaseStudyPage";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function CaseStudyDetail() {
  const { caseStudyId } = useParams<{ caseStudyId: string }>();
  const caseStudy = caseStudyId ? getCaseStudy(caseStudyId) : undefined;

  useDocumentMeta({
    title: caseStudy ? `Design ${caseStudy.title}` : "Case Study",
    description: caseStudy?.summary ?? "",
    path: `/case-studies/${caseStudyId ?? ""}`,
  });

  if (!caseStudy) {
    return <Navigate to="/case-studies" replace />;
  }

  return <CaseStudyPageView caseStudy={caseStudy} />;
}
