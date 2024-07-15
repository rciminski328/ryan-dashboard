import { useAssetsQuery } from "./api/assetsQuery";

export function Main() {
  const assetsQuery = useAssetsQuery();
  console.log({ assetsQuery });
  return <div>heyyy</div>;
}
