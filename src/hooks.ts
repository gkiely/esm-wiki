import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { recursiveFetch } from './recursiveFetch';

/**
 * Recursively fetches all files in the wiki
 * Updates the swr cache once completed
 */
export const useFiles = ({ id, email }: { id: string | undefined; email?: string; hidden?: boolean }) => {
  const [streamed, setStreamed] = useState<DriveFile[]>([]);
  const idRef = useRef<string | undefined>(id);

  const swr = useSWR(
    id
      ? {
          key: `/api/files/${id}`,
          id,
          email,
        }
      : null,
    (data: DriveFile[]): DriveFile[] => {
      if (!id) throw new Error('No id provided');
      if (id !== idRef.current) throw new Error('id changed');
      setStreamed((prev) => [...prev, ...data]);
      return [];
    },
    {
      use: [recursiveFetch],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (id !== idRef.current) {
      idRef.current = id;
      setStreamed([]);
    }
  }, [id]);

  const data = swr.data?.length ? swr.data : streamed;
  const files = data.filter((file) => file.name !== 'wiki.logo' && file.name !== 'wiki.page');
  return { ...swr, files };
};
