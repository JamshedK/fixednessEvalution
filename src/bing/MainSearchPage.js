import SearchResultContainer from "./SearchResultContainer";
const MainSearchPage = () => {
    const resultContainers = Array.from({ length: 5 }, (_, index) => <SearchResultContainer key={index} />);

    return (
      <div className="max-w-2xl mx-auto mt-10 bg-[#2f4454]">
        {resultContainers}
      </div>
    );
  };
  export default MainSearchPage;
  