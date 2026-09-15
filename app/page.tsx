import { Portfolio } from "@/components/portfolio/Portfolio";
import { StaticPortfolio } from "@/components/fallback/StaticPortfolio";

export default function HomePage() {
  return (
    <>
      <Portfolio />
      <noscript>
        <StaticPortfolio />
      </noscript>
    </>
  );
}
