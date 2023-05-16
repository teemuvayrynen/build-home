import dynamic from "next/dynamic";

const NoSSRComponent = dynamic(() => import("."), {
  ssr: false,
});

export default function TestsPage(props) {
  return <NoSSRComponent />;
}