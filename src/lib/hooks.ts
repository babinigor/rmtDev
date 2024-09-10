import { useContext, useEffect, useState } from "react";
import { JobItem, JobItemExpanded } from "./types";
import { BASE_API_URL } from "./constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import { handleError } from "./utils";
import { BookmarksContext } from "../contexts/BookmarksContextProvider";

//------------------------------------------------------------------------------
type JobItemApiResponse = {
  public: boolean;
  jobItem: JobItemExpanded;
};

const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  const response = await fetch(`${BASE_API_URL}/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }
  const data = await response.json();
  return data;
};

export function useJobItem(id: number | null) {
  const { data, isInitialLoading } = useQuery(
    ["job-item", id],
    () => (id ? fetchJobItem(id) : null),
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!id,
      onError: handleError,
    }
  );
  const isLoading = isInitialLoading;
  return { jobItem: data?.jobItem, isLoading } as const;
}

//------------------------------------------------------------------------------
export function useJobItems(ids: number[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["job-item", id],
      queryFn: () => (id ? fetchJobItem(id) : null),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!id,
      onError: handleError,
    })),
  });

  const jobItems = results
    .map((r) => r.data?.jobItem)
    // .filter((jobItem) => jobItem !== undefined);
    // .filter((jobItem) => !!jobItem);
    .filter((jobItem) => Boolean(jobItem)) as JobItemExpanded[];
  const isLoading = results.some((r) => r.isLoading);

  return { jobItems, isLoading } as const;
}

//------------------------------------------------------------------------------
type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
};

const fetchJobItems = async (
  searchText: string
): Promise<JobItemsApiResponse> => {
  const response = await fetch(`${BASE_API_URL}?search=${searchText}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }
  const data = await response.json();
  return data;
};

export function useSearchQuery(searchText: string) {
  const { data, isInitialLoading } = useQuery(
    ["job-items", searchText],
    () => fetchJobItems(searchText),
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!searchText,
      onError: handleError,
    }
  );

  const isLoading = isInitialLoading;
  return { jobItems: data?.jobItems, isLoading } as const;
}
//------------------------------------------------------------------------------

export function useDebounce<T>(value: T, delay = 500): T {
  const [deboucedValue, setDeboucedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDeboucedValue(value);
    }, delay);
    return () => clearTimeout(timerId);
  }, [value, delay]);
  return deboucedValue;
}

export function useActiveId() {
  const [activeId, setAcitveId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setAcitveId(id);
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return activeId;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue] as const;
}

// ------------------------------------------------------------------------------
export function useBookmarksContext() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("BookmarksContextProvider not found");
  }
  return context;
}
