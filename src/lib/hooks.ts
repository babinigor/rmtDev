import { useEffect, useState } from "react";
import { JobItem, JobItemExpanded } from "./types";
import { BASE_API_URL } from "./constants";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
      onError: (error) => {
        console.log(error);
      },
    }
  );
  const isLoading = isInitialLoading;
  return { jobItem: data?.jobItem, isLoading } as const;
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

export function useJobItems(searchText: string) {
  const { data, isInitialLoading } = useQuery(
    ["job-items", searchText],
    () => fetchJobItems(searchText),
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!searchText,

      onError: (error) => {
        toast.error(error.message);
      },
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
