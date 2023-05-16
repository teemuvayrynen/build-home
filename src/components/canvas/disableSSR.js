import dynamic from "next/dynamic";

const CanvasSSRDisabled = dynamic(() => import("."), {
  ssr: false,
});

export default function TestsPage(props) {
  return <CanvasSSRDisabled />;
}