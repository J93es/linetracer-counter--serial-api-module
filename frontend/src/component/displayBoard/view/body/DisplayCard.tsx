import "component/displayBoard/view/body/DisplayCard.css";

export default function DisplayCard({ htmlElement }: { htmlElement: any }) {
  return <div className="display-card">{htmlElement}</div>;
}