import dynamic from "next/dynamic";

const CanvasSSRDisabled = dynamic(() => import("./index.jsx"), {
  ssr: false,
});

export default function TestsPage(props) {
  return <CanvasSSRDisabled />;
}