import { useState } from "react";
import { useDebounce, useJobItems } from "../lib/hooks";
import Background from "./Background";
import Header, { HeaderTop } from "./Header";
import Container from "./Container";
import Footer from "./Footer";
import Logo from "./Logo";
import BookmarksButton from "./BookmarksButton";
import SearchForm from "./SearchForm";
import JobItemContent from "./JobItemContent";
import Sidebar, { SidebarTop } from "./Sidebar";
import JobList from "./JobList";
import PaginationControls from "./PaginationControls";
import ResultsCount from "./ResultsCount";
import SortingControls from "./SortingControls";
import { Toaster } from "react-hot-toast";
import { RESULTS_PER_PAGE } from "../lib/constants";

function App() {
  // state
  const [searchText, setSearchText] = useState("");
  const deboucedSearchText = useDebounce(searchText, 250);
  const { jobItems, isLoading } = useJobItems(deboucedSearchText);
  const [currentPage, setCurrentPage] = useState(1);

  // derived / computed state
  const totalNumberOfResults = jobItems?.length || 0;
  const totalNumberOfPages = Math.ceil(totalNumberOfResults / RESULTS_PER_PAGE);
  const jobItemsSliced =
    jobItems?.slice(
      currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
      currentPage * RESULTS_PER_PAGE
    ) || [];

  // event handlers / actions
  const handleChangePage = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev") {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <Background />

      <Header>
        <HeaderTop>
          <Logo />
          <BookmarksButton />
        </HeaderTop>

        <SearchForm searchText={searchText} setSearchText={setSearchText} />
      </Header>

      <Container>
        <Sidebar>
          <SidebarTop>
            <ResultsCount totalNumberOfResults={totalNumberOfResults} />
            <SortingControls />
          </SidebarTop>

          <JobList jobItems={jobItemsSliced} isLoading={isLoading} />

          <PaginationControls
            onClick={handleChangePage}
            currentPage={currentPage}
            totalNumberOfPages={totalNumberOfPages}
          />
        </Sidebar>

        <JobItemContent />
      </Container>

      <Footer />

      <Toaster position="top-right" />
    </>
  );
}

export default App;
