import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { problemCategories, getProblemsByCategory } from "../../content/problems";
import { useProblemProgress } from "../../hooks/useProblemProgress";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

/** Overview of every problem category — the DSA practice bank's home page. */
export default function ProblemsHome() {
  const navigate = useNavigate();
  const { getCategorySolvedCount } = useProblemProgress();

  useDocumentMeta({
    title: "DSA Practice Problems",
    description:
      "Practice DSA problems organized by pattern — arrays and hashing, two pointers, graphs, dynamic programming, and more.",
    path: "/problems",
  });

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        Problems
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Practice DSA problems, organized by pattern — from arrays and hashing
        up through graphs and dynamic programming.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {problemCategories.map((category) => {
          const problems = getProblemsByCategory(category.id);
          const solvedCount = getCategorySolvedCount(problems.map((p) => p.id));

          return (
            <Box
              key={category.id}
              onClick={() => navigate(`/problems/${category.id}`)}
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
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {category.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {category.description}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                {solvedCount}/{problems.length} solved
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
