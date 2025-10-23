import { trpc } from "@/lib/trpc";

export default function TestSites() {
  const { data: sites, isLoading, error } = trpc.site.list.useQuery();
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Test Sites Page</h1>
      <div>
        <p><strong>Loading:</strong> {isLoading ? 'YES' : 'NO'}</p>
        <p><strong>Error:</strong> {error ? JSON.stringify(error) : 'NONE'}</p>
        <p><strong>Sites:</strong> {sites ? JSON.stringify(sites, null, 2) : 'undefined'}</p>
        <p><strong>Sites Length:</strong> {sites?.length || 0}</p>
      </div>
      <hr />
      <h2>Raw Data:</h2>
      <pre>{JSON.stringify({ sites, isLoading, error }, null, 2)}</pre>
    </div>
  );
}

