import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState, useCallback } from "react";

interface FetchListResult<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

const useFetchList = <T>(options: AxiosRequestConfig): FetchListResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    axios(options)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [options]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return { data, loading, error };
};

export default useFetchList;
