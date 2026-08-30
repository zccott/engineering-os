import { Navigate, useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { getCategory, getProblemsByCategory } from "../../content/problems";
import { getDsaTopicsForProblemCategory } from "../../content/dsaProblemLinks";
import { getTopic } from "../../content";
import ProblemList from "../../components/ProblemList/ProblemList";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function ProblemsCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? getCategory(categoryId) : undefined;
  const navigate = useNavigate();

  useDocumentMeta({
    title: category ? `${category.title} Problems` : "Problems",
    description: category?.description ?? "",
    path: `/problems/${categoryId ?? ""}`,
  });

  if (!category) {
    return <Navigate to="/problems" replace />;
  }

  const problems = getProblemsByCategory(category.id);
  const relatedDsaTopics = getDsaTopicsForProblemCategory(category.id)
    .map((topicId) => getTopic("dsa", topicId))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/problems" underline="hover" color="inherit">
          Problems
        </Link>
        <Typography color="text.primary">{category.title}</Typography>
      </Breadcrumbs>

      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        {category.title}
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        {category.description}
      </Typography>

      {relatedDsaTopics.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
          {relatedDsaTopics.map((topic) => (
            <Button
              key={topic.id}
              size="small"
              variant="outlined"
              startIcon={<MenuBookOutlinedIcon fontSize="small" />}
              onClick={() => navigate(`/dsa/${topic.id}`)}
            >
              New to this? Learn {topic.title} first
            </Button>
          ))}
        </Box>
      )}

      {problems.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.disabled" }}>
          Problems for this category are on their way.
        </Typography>
      ) : (
        <ProblemList categoryId={category.id} problems={problems} />
      )}
    </Box>
  );
}
