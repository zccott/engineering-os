import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { getSubject, getTopic } from "../../content";
import { useBookmarks } from "../../hooks/useBookmarks";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

/** Topics the user has bookmarked for later, read from localStorage. */
export default function Bookmarks() {
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();

  useDocumentMeta({
    title: "Bookmarks",
    description: "Topics you've saved to come back to later, stored locally in your browser.",
    path: "/bookmarks",
    noindex: true,
  });

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h1" component="h1" sx={{ mb: 1 }}>
        Bookmarks
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Topics you've saved to come back to later.
      </Typography>

      {bookmarks.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            py: 8,
            color: "text.disabled",
          }}
        >
          <BookmarkBorderOutlinedIcon sx={{ fontSize: 40 }} />
          <Typography variant="body2">No bookmarks yet.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {bookmarks.map((bookmark) => {
            const subject = getSubject(bookmark.subjectId);
            const topic = getTopic(bookmark.subjectId, bookmark.topicId);
            if (!subject || !topic) return null;

            return (
              <Box
                key={`${bookmark.subjectId}/${bookmark.topicId}`}
                onClick={() => navigate(`/${bookmark.subjectId}/${bookmark.topicId}`)}
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
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {subject.title}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {topic.title}
                  </Typography>
                </Box>
                <Chip label={topic.level} size="small" variant="outlined" />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
