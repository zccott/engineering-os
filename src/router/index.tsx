import { Routes, Route } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home/Home";
import Subject from "../pages/Subject/Subject";
import Topic from "../pages/Topic/Topic";
import Progress from "../pages/Progress/Progress";
import Bookmarks from "../pages/Bookmarks/Bookmarks";
import ProblemsHome from "../pages/Problems/ProblemsHome";
import ProblemsCategory from "../pages/Problems/ProblemsCategory";
import ProblemDetail from "../pages/Problems/ProblemDetail";
import CaseStudiesHome from "../pages/CaseStudies/CaseStudiesHome";
import CaseStudyDetail from "../pages/CaseStudies/CaseStudyDetail";

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/problems" element={<ProblemsHome />} />
          <Route path="/problems/:categoryId" element={<ProblemsCategory />} />
          <Route path="/problems/:categoryId/:problemId" element={<ProblemDetail />} />
          <Route path="/case-studies" element={<CaseStudiesHome />} />
          <Route path="/case-studies/:caseStudyId" element={<CaseStudyDetail />} />
          <Route path="/:subjectId" element={<Subject />} />
          <Route path="/:subjectId/:topicId" element={<Topic />} />
        </Route>
      </Routes>
    </>
  );
}
