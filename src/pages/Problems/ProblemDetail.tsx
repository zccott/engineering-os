import { Navigate, useParams } from "react-router-dom";
import { getCategory, getProblem } from "../../content/problems";
import ProblemPageView from "../../components/ProblemPage/ProblemPage";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function ProblemDetail() {
  const { categoryId, problemId } = useParams<{ categoryId: string; problemId: string }>();

  const category = categoryId ? getCategory(categoryId) : undefined;
  const problem = categoryId && problemId ? getProblem(categoryId, problemId) : undefined;

  useDocumentMeta({
    title: problem ? `${problem.title} (${problem.difficulty})` : "Problem",
    description: problem?.description ?? "",
    path: `/problems/${categoryId ?? ""}/${problemId ?? ""}`,
  });

  if (!category || !problem) {
    return <Navigate to={category ? `/problems/${category.id}` : "/problems"} replace />;
  }

  return <ProblemPageView category={category} problem={problem} />;
}
