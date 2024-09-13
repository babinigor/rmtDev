import { useJobItemsContext } from "../lib/hooks";
import { SortBy } from "../lib/types";

export default function SortingControls() {
  const { sortBy, handleChangeSortBy } = useJobItemsContext();

  return (
    <section className="sorting">
      <i className="fa-solid fa-arrow-down-short-wide"></i>

      <SortingButton
        onClick={() => handleChangeSortBy("relevant")}
        isActive={sortBy === "relevant"}
        sortBy="relevant"
      >
        Relevant
      </SortingButton>
      <SortingButton
        onClick={() => handleChangeSortBy("recent")}
        isActive={sortBy === "recent"}
        sortBy="recent"
      >
        Recent
      </SortingButton>
    </section>
  );
}

type SortingButtonProps = {
  onClick: () => void;
  sortBy: SortBy;
  isActive: boolean;
  children?: React.ReactNode;
};

function SortingButton({
  onClick,
  sortBy,
  children,
  isActive,
}: SortingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`sorting__button sorting__button--${sortBy} ${
        isActive ? "sorting__button--active" : ""
      }`}
    >
      {children}
    </button>
  );
}
